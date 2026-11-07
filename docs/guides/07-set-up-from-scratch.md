# Set up the app from scratch (developers)

> **Status:** Built for AWS. These steps create the AWS resources, run the app on your computer, and deploy it.

This guide is for developers who build or change the app. For the design reasons, see the ADRs in [`docs/arch/`](../arch/), starting with [ADR 0015](../arch/0015-host-on-aws-with-cdk.md).

## What the project is made of

- `frontend/` is the site: the pages' scripts and the services they call.
- `api/` holds one Lambda file per route.
- `infra/` is the AWS CDK app. It defines every AWS resource and route.
- `index.html`, `dashboard.html`, `create.html`, and `redirect.html` hold each page's markup.

## 1. What you need

- **Node.js 22 or newer** and **npm**.
- **An AWS account** and the **AWS CLI**, signed in with rights to create S3, API Gateway, Lambda, DynamoDB, Cognito, IAM, and CloudFormation resources.
- **A domain** you control, with its DNS in Cloudflare.

## 2. Install the dependencies

From the project folder:

```
npm install
(cd api && npm install)
(cd infra && npm install)
```

## 3. Create the certificate for your domain

API Gateway needs an ACM certificate for the site address (for example `go.dustintobrien.com`).

1. In the AWS console, open **Certificate Manager** in the same region you will deploy to. Request a public certificate for the domain.
2. ACM shows a CNAME record to prove you own the domain. Add it in Cloudflare. Use **DNS only** (grey cloud).
3. Wait until the certificate status is **Issued**. Copy its ARN.

## 4. Set the domain and certificate

Open `infra/cdk.json`. Set `siteDomain` to your domain and `certificateArn` to the ARN from step 3. Leave `certificateArn` empty to deploy without a custom domain, and use the `SiteUrl` output instead.

## 5. Build and deploy

```
npm run build
cd infra
npx cdk bootstrap   # once per AWS account and region
npx cdk deploy
```

The deploy takes a few minutes. It uploads `dist/` to the bucket and writes `config.json` next to it. When it finishes, it prints:

- `SiteUrl`: the address of the app.
- `ApiGatewayTarget`: the API Gateway address for the CNAME.

## 6. Point Cloudflare at the app

In Cloudflare, add a CNAME record for your site domain that points to the `ApiGatewayTarget` value. Use **DNS only** (grey cloud), so API Gateway handles the HTTPS certificate.

## 7. Try it

1. Open the site and log in. The app creates the account if the email is new.
2. Click **+ Create new**, fill in a name and a full address that starts with `https://`, then save.
3. Click the short link in the table. You should go to the destination.
4. Open a short link that does not exist. You should see **Link not found**.

## 8. Run locally

1. Copy the values from `config.json` in the bucket (or from `npx cdk deploy` output) into `public/config.json`. This file is not committed:
   ```json
   { "region": "us-east-1", "userPoolId": "...", "userPoolClientId": "..." }
   ```
2. Start the dev server with the deployed API address:
   ```
   API_ORIGIN=https://<api-id>.execute-api.<region>.amazonaws.com npm run dev
   ```
3. Open `http://localhost:5173/`.

## 9. Change the app

- Change a route: edit its file in `api/links/` and its entry in `infra/lib/short-links-stack.js`.
- Change a table or sign-in setting: edit `infra/lib/short-links-stack.js`, then run `npx cdk diff` and `npx cdk deploy`. Do not change these in the console.
- Add a page: add its HTML file, its script in `frontend/pages/`, a line in `vite.config.js`, and a route in `infra/lib/short-links-stack.js`.

## 10. Remove the app

`cd infra && npx cdk destroy` removes the stack. The DynamoDB table and Cognito user pool are kept on purpose, so user data is not lost. Delete them in the console when you no longer need them.

## Troubleshooting

- **The login page says the site is missing `config.json`.** Run the deploy again, or check `public/config.json` in local development.
- **Creating a link shows "Log in first."** The session has ended. Log in again.
- **`cdk deploy` fails on the certificate.** The certificate is not issued yet, or it is in a different region from the deploy.
- **A short link goes to the login page.** The API route is missing. Check `infra/lib/short-links-stack.js` and deploy again.

## Related decisions

- [ADR 0015](../arch/0015-host-on-aws-with-cdk.md): the AWS platform and CDK.
- [ADR 0016](../arch/0016-serve-site-from-s3-through-api-gateway.md): how the site is served.
- [ADR 0017](../arch/0017-api-gateway-with-one-lambda-per-route.md): the routes.
- [ADR 0018](../arch/0018-store-links-in-dynamodb.md): the links table.
- [ADR 0019](../arch/0019-cognito-for-sign-in.md): sign-in.
- [ADR 0020](../arch/0020-redirect-short-links-in-lambda.md): short link redirects.
