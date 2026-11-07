# Short Links

A small URL shortener for the cloud computing workshop. Sign up, make a short link, and send it to anyone. The site runs on AWS. See [`docs/arch/`](docs/arch/) for why it is built this way.

## How it fits together

- **Browser:** plain HTML, CSS, and JavaScript modules, built with Vite. Each page has its own HTML file and script ([ADR 0001](docs/arch/0001-vanilla-javascript-with-vite.md), [ADR 0009](docs/arch/0009-one-html-file-per-page.md), [ADR 0014](docs/arch/0014-page-scripts-in-pages-folder.md)).
- **Site files:** an S3 bucket holds the built `dist/` folder ([ADR 0016](docs/arch/0016-serve-site-from-s3-through-api-gateway.md)).
- **Entry point:** one API Gateway HTTP API serves the site, the API, and short links on one domain ([ADR 0017](docs/arch/0017-api-gateway-with-one-lambda-per-route.md)).
- **API:** one Lambda function per route, in `api/` ([ADR 0017](docs/arch/0017-api-gateway-with-one-lambda-per-route.md)).
- **Data:** a DynamoDB table of links ([ADR 0018](docs/arch/0018-store-links-in-dynamodb.md)).
- **Sign-in:** an Amazon Cognito user pool. API Gateway checks each token before the API runs ([ADR 0019](docs/arch/0019-cognito-for-sign-in.md)).
- **Short links:** `GET /r/{code}` is a Lambda that returns a redirect ([ADR 0020](docs/arch/0020-redirect-short-links-in-lambda.md), [ADR 0023](docs/arch/0023-return-not-found-page-from-redirect-lambda.md)).
- **Infrastructure:** AWS CDK in JavaScript, in `infra/` ([ADR 0015](docs/arch/0015-host-on-aws-with-cdk.md), [ADR 0022](docs/arch/0022-wrap-cdk-constructs-in-app-classes.md)).

## What you need

- Node.js 22 or newer and npm
- An AWS account, and the AWS CLI signed in with rights to create the resources (see [`docs/guides/07-set-up-from-scratch.md`](docs/guides/07-set-up-from-scratch.md))
- A domain you control (the app is set up for `go.dustintobrien.com`, with DNS in Cloudflare)
- An ACM certificate for that domain, issued in the region you deploy to (see [guide 07, step 3](docs/guides/07-set-up-from-scratch.md#3-create-the-certificate-for-your-domain))

## Deploy

1. Install the dependencies:
   ```
   npm install
   (cd api && npm install)
   (cd infra && npm install)
   ```
2. Set the site domain and certificate ARN in `infra/cdk.json`. Both are required (see [ADR 0015](docs/arch/0015-host-on-aws-with-cdk.md)).
3. Build the site. This must happen before the deploy, because the stack uploads `dist/`:
   ```
   npm run build
   ```
4. Deploy from `infra/`:
   ```
   cd infra
   npx cdk bootstrap   # once per AWS account and region
   npx cdk deploy
   ```
5. In Cloudflare, add a CNAME for your domain that points at the `DnsTarget` output. Use DNS only (grey cloud), so API Gateway handles HTTPS.

The deploy prints `ApiUrl`, the public address of the site. Open it and sign up.

## Run locally

1. Deploy the stack once (above). It writes the sign-in settings to `config.json` next to the site. Open `https://<your-site>/config.json` to see them.
2. Copy those two values into `public/config.json` (this file is not committed):
   ```json
   { "userPoolId": "...", "userPoolClientId": "..." }
   ```
3. Start the dev server, and point it at the deployed API so links work. Use the `ApiUrl` value:
   ```
   API_ORIGIN=https://<api-id>.execute-api.<region>.amazonaws.com npm run dev
   ```
   The dev server forwards `/api` and `/r` to that address (see `vite.config.js`).
4. Open the login page at `http://localhost:5173/`. The dashboard is at `/dashboard.html`.

## Project layout

See the file list in [`CLAUDE.md`](CLAUDE.md). Each folder has its own guide: [`infra/CLAUDE.md`](infra/CLAUDE.md) for the CDK app, and [`docs/CLAUDE.md`](docs/CLAUDE.md) for the documentation.
