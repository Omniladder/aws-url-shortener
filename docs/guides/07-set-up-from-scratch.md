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

Open `infra/cdk.json`. Set `siteDomain` to your domain and `certificateArn` to the ARN from step 3. Both are required: the stack will not deploy without a certificate.

## 5. Build and deploy

```
npm run build
cd infra
npx cdk bootstrap   # once per AWS account and region
npx cdk deploy
```

Run `npm run build` first. The deploy uploads the `dist/` folder to the site bucket.

The deploy takes a few minutes. It also writes `config.json` next to the site files. When it finishes, it prints:

- `ApiUrl`: the public address of the app. Open it in a browser.
- `DnsTarget`: the address the Cloudflare CNAME points to.

## 6. Point Cloudflare at the app

In Cloudflare, add a CNAME record for your site domain that points to the `DnsTarget` value. Use **DNS only** (grey cloud), so API Gateway handles the HTTPS certificate.

## 7. Try it

1. Open the site and log in. The app creates the account if the email is new.
2. Click **+ Create new**, fill in a name and a full address that starts with `https://`, then save.
3. Click the short link in the table. You should go to the destination.
4. Open a short link that does not exist. You should see **Link not found**.

## 8. Run locally

1. Open `https://<your-site>/config.json` in a browser. Copy the two values into `public/config.json`. This file is not committed:
   ```json
   { "userPoolId": "...", "userPoolClientId": "..." }
   ```
2. Start the dev server with the deployed API address (the `ApiUrl` value):
   ```
   API_ORIGIN=https://<api-id>.execute-api.<region>.amazonaws.com npm run dev
   ```
3. Open `http://localhost:5173/`.

## 9. Change the app

- **Change a route:** edit its file in `api/links/`, and its `addLambdaRoute` call in `infra/stack.js`. Then add or change the matching function in `frontend/services/urls.js`.
- **Change a table or sign-in setting:** edit `infra/stack.js` or the file in `infra/constructs/`, then run `npx cdk diff` and `npx cdk deploy`. Do not change these in the console.
- **Add a page:** add its HTML file, its script in `frontend/pages/`, and an entry in the `input` list in `vite.config.js`. No infrastructure change is needed, because the site bucket serves every file in `dist/` ([ADR 0016](../arch/0016-serve-site-from-s3-through-api-gateway.md)).

## 10. Remove the app

`cd infra && npx cdk destroy` removes the stack, including the site bucket. The DynamoDB table and Cognito user pool are kept on purpose, so user data is not lost. Delete them in the console when you no longer need them.

## Troubleshooting

- **The login page says the site is missing `config.json`.** Run the deploy again, or check `public/config.json` in local development.
- **Creating a link shows "Log in first."** The session has ended. Log in again.
- **`cdk deploy` fails on the certificate.** The certificate is not issued yet, or it is in a different region from the deploy.
- **A short link does not redirect.** The `/r/{code}` route is missing or has not been deployed. Check `infra/stack.js` and deploy again.

## Related decisions

- [ADR 0015](../arch/0015-host-on-aws-with-cdk.md): the AWS platform and CDK.
- [ADR 0016](../arch/0016-serve-site-from-s3-through-api-gateway.md): how the site is served.
- [ADR 0017](../arch/0017-api-gateway-with-one-lambda-per-route.md): the routes.
- [ADR 0018](../arch/0018-store-links-in-dynamodb.md): the links table.
- [ADR 0019](../arch/0019-cognito-for-sign-in.md): sign-in.
- [ADR 0020](../arch/0020-redirect-short-links-in-lambda.md) and [ADR 0023](../arch/0023-return-not-found-page-from-redirect-lambda.md): short link redirects.
- [ADR 0022](../arch/0022-wrap-cdk-constructs-in-app-classes.md): the CDK wrapper classes.
