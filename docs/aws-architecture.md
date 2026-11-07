# AWS architecture (for drawing a diagram)

This describes every AWS resource in the Short Links app and how a request moves between them. It is written so you can paste it into an AI tool and ask for an architecture diagram. It matches the CDK code in `infra/stack.js` and `infra/constructs/`.

## Summary

Short Links is a static website plus a small serverless API, all on AWS:

- A browser loads the site from an S3 bucket, through an API Gateway HTTP API on the domain `go.dustintobrien.com`.
- Sign-in uses an Amazon Cognito user pool. The browser signs in directly with Cognito, and then sends a token to the API.
- The API is one AWS Lambda function per route. Each function reads or writes a DynamoDB table.
- DNS is in Cloudflare. It points a CNAME at API Gateway. Cloudflare does not proxy traffic (DNS only).
- Everything is defined in AWS CDK (JavaScript) and deployed with one CloudFormation stack, `ShortLinkStack`.

## Components

### 1. Cloudflare DNS (outside AWS)
- Hosts the domain `go.dustintobrien.com`.
- One CNAME record points `go.dustintobrien.com` at the API Gateway regional domain name (the stack output `DnsTarget`).
- DNS only, not proxied, so API Gateway handles the HTTPS certificate.

### 2. Amazon API Gateway (HTTP API) - the public entry point
- One HTTP API. It serves the website, the API, and short links on the same domain, so there are no cross-origin calls.
- Custom domain `go.dustintobrien.com` with an ACM certificate, mapped to the API's default stage.
- The default `execute-api` URL (stack output `ApiUrl`) also works, and serves the same site.
- Routes:

| Method and path | Goes to | Auth |
|---|---|---|
| `GET /` | S3 bucket (`index.html`) | Public |
| `ANY /{proxy+}` | S3 bucket, same path (for example `/dashboard.html`, `/assets/...`, `/config.json`) | Public |
| `GET /api/links` | Lambda `list.js` | JWT authorizer (Cognito) |
| `POST /api/links` | Lambda `create.js` | JWT authorizer (Cognito) |
| `DELETE /api/links/{shortCode}` | Lambda `delete.js` | JWT authorizer (Cognito) |
| `GET /r/{code}` | Lambda `redirect.js` | Public, no sign-in |

- The JWT authorizer checks the Cognito ID token in the `Authorization: Bearer` header. Its issuer is the user pool, and its audience is the app's client ID.
- The `/api/...` and `/r/{code}` routes are more specific than the catch-all, so they win.
- API Gateway calls S3 and Lambda through integrations. The API Gateway to S3 hop uses HTTP to the S3 website endpoint. Visitors use HTTPS to reach API Gateway.

### 3. Amazon S3 - the site bucket
- One bucket holds the built website (the `dist/` folder: HTML pages, JavaScript, CSS, `logo.svg`) and a generated `config.json`.
- Website hosting is on, with `index.html` as the index document. Public read is allowed through the bucket policy.
- Filled by a CDK `BucketDeployment` on each `cdk deploy`.
- `config.json` holds the Cognito user pool ID and app client ID. The browser reads it at startup, so the build does not need them.
- The bucket is removed when the stack is destroyed.

### 4. Amazon Cognito - sign-in
- One user pool. Users sign in with email and password. Self sign-up is on. Passwords need at least 8 characters.
- One app client (no client secret). The browser uses it with the Amplify library and the SRP sign-in flow.
- A pre sign-up Lambda trigger (`auto-confirm.js`) confirms each new account automatically, so there is no email verification step.
- The user pool is kept on `cdk destroy` (retained).

### 5. AWS Lambda - one function per route
- Node.js 22 runtime. Each file is bundled by esbuild and deployed as its own function.
- Functions:
  - `ListLinksFunction` (`api/links/list.js`): queries the table's `byUser` index for the signed-in user's links.
  - `CreateLinkFunction` (`api/links/create.js`): writes a new link with a random 6-character short code.
  - `DeleteLinkFunction` (`api/links/delete.js`): deletes a link only if the signed-in user owns it.
  - `RedirectFunction` (`api/links/redirect.js`): reads only the destination URL and returns `302` to it, or a `404` "Link not found" HTML page.
  - `AutoConfirmFunction` (`api/auth/auto-confirm.js`): the Cognito pre sign-up trigger.
- Each function has its own IAM role. The role allows CloudWatch Logs writes. The three link functions that touch the table get read or write access to it. The redirect function gets read access only.
- The link functions get the table name as the environment variable `TABLE_NAME`.
- Logs go to CloudWatch Logs.

### 6. Amazon DynamoDB - links table
- One table, `LinksTable`, with on-demand billing (pay per request).
- Partition key `shortCode` (string). Each short code is unique because the create function writes with a condition that the key does not already exist.
- Attributes per item: `shortCode`, `userId` (the owner's Cognito `sub`), `name`, `originalUrl`, `createdAt`.
- Global secondary index `byUser`: partition key `userId`, sort key `createdAt`. The list function reads one user's links with it.
- The table is retained on `cdk destroy`.

### 7. AWS CloudFormation / AWS CDK (deployment, not runtime)
- The app is defined in AWS CDK (JavaScript) in `infra/`. `cdk deploy` turns it into one CloudFormation stack, `ShortLinkStack`.
- The build runs first (`npm run build` makes `dist/`), then CDK uploads it to the site bucket.
- Outputs: `ApiUrl` (the default address of the site) and `DnsTarget` (the value for the Cloudflare CNAME).

## Request flows

**Load the site:** Browser -> Cloudflare DNS -> API Gateway (custom domain) -> `GET /` or `/{proxy+}` -> S3 bucket -> HTML/JS/CSS. The page then fetches `/config.json` from the same site.

**Log in or register:** Browser -> Cognito directly (through Amplify, using the user pool and client IDs from `config.json`). Cognito returns tokens to the browser. For a new email, the browser registers the account first, and the pre sign-up Lambda confirms it.

**List links:** Browser -> API Gateway (`GET /api/links`, with the ID token) -> JWT authorizer checks the token with Cognito's issuer -> `ListLinksFunction` -> DynamoDB `byUser` index query -> JSON list back to the browser.

**Create a link:** Browser -> API Gateway (`POST /api/links`, with the ID token) -> JWT authorizer -> `CreateLinkFunction` -> DynamoDB conditional put -> JSON with the new link.

**Delete a link:** Browser -> API Gateway (`DELETE /api/links/{shortCode}`, with the ID token) -> JWT authorizer -> `DeleteLinkFunction` -> DynamoDB conditional delete (only if `userId` matches) -> 204 or 404.

**Visit a short link:** Anyone -> API Gateway (`GET /r/{code}`, no token) -> `RedirectFunction` -> DynamoDB get (destination only) -> `302` with `Location` to the original URL, or the 404 "Link not found" page.

## Data and access rules

- Only the owner can list or delete a link. This is enforced in the Lambda code, not in the database.
- Anyone who knows a short code can use it. This is intended.
- No secrets are stored in the code. Domain and certificate ARN come from `infra/cdk.json`. The Cognito IDs are written to `config.json` at deploy time.

## Things not in the app
- No VPC, no NAT gateway, no servers, no containers, no CDN (CloudFront). The site is served directly from S3 through API Gateway.
- No click tracking, no email sending, no custom domains per user.

## Suggested diagram layout
Left to right: Browser and Cloudflare DNS, then API Gateway (HTTP API) in the middle. From API Gateway, one arrow goes to the S3 site bucket, one to Cognito (JWT authorizer), and four arrows go to the Lambda functions (list, create, delete, redirect). The Lambda functions connect to the DynamoDB table `LinksTable`. Show the Cognito user pool with its pre sign-up trigger, and show the browser connecting to Cognito directly for sign-in. Label each arrow with the route. Draw the CDK/CloudFormation stack as a box around the AWS resources.
