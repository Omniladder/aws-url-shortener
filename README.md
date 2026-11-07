# Short Links

A small URL shortener for the cloud computing workshop. Sign up, make a short link, and send it to anyone. The site runs on AWS. See [`docs/arch/`](docs/arch/) for why it is built this way.

## What you need

- Node.js 22 or newer and npm
- An AWS account, and the AWS CLI signed in with rights to create the resources (see [`docs/guides/07-set-up-from-scratch.md`](docs/guides/07-set-up-from-scratch.md))
- A domain you control (the app is set up for `go.dustintobrien.com`, with DNS in Cloudflare)

## Deploy

1. Install the dependencies:
   ```
   npm install
   (cd api && npm install)
   (cd infra && npm install)
   ```
2. Build the site:
   ```
   npm run build
   ```
3. Set the site domain and certificate in `infra/cdk.json` (see [ADR 0015](docs/arch/0015-host-on-aws-with-cdk.md)). Then deploy:
   ```
   cd infra
   npx cdk bootstrap   # once per AWS account and region
   npx cdk deploy
   ```
4. In Cloudflare, point the site's CNAME at the `ApiGatewayTarget` output from the deploy.

The deploy prints the site address. Open it and sign up.

## Run locally

1. Deploy the stack once (above). It writes the sign-in settings to `config.json` in the bucket.
2. Copy those settings into `public/config.json` (this file is not committed):
   ```json
   { "region": "us-east-1", "userPoolId": "...", "userPoolClientId": "..." }
   ```
3. Start the dev server, and point it at the deployed API so links work:
   ```
   API_ORIGIN=https://<api-id>.execute-api.<region>.amazonaws.com npm run dev
   ```
4. Open the login page at `http://localhost:5173/`. The dashboard is at `/dashboard.html`.

## Project layout

See the file list in [`CLAUDE.md`](CLAUDE.md).
