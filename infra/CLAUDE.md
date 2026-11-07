# infra: AWS CDK app

This folder defines every AWS resource the app uses, in AWS CDK written in JavaScript (ES modules). Run `cdk` commands from this folder. Infrastructure changes go here, not in the AWS console ([ADR 0015](../docs/arch/0015-host-on-aws-with-cdk.md)).

## What is here

| File | What it does |
| --- | --- |
| `app.js` | CDK entry point. Creates the `App` and one `ShortLinkStack`. |
| `stack.js` | The stack. Creates the user pool, the table, the public API, the routes, and the custom domain, in that order. Reading it top to bottom matches the route table in [ADR 0017](../docs/arch/0017-api-gateway-with-one-lambda-per-route.md). |
| `cdk.json` | Context values: `siteDomain` and `certificateArn`. Both are required. |
| `package.json` | CDK dependencies (`aws-cdk-lib`, `constructs`). Separate from the frontend's `package.json`. |
| `constructs/` | The wrapper classes the stack uses (see below). Each class is in its own file. |

## Constructs

Each wrapper extends a CDK class and hides the CDK wiring that attendees do not need to see ([ADR 0022](../docs/arch/0022-wrap-cdk-constructs-in-app-classes.md)).

| File | Class | What it is |
| --- | --- | --- |
| `gateway.js` | `PublicApi` | Extends `apigatewayv2.HttpApi`, the public entry point ([ADR 0017](../docs/arch/0017-api-gateway-with-one-lambda-per-route.md)). Methods: `addHostingBucket(...)` and `addLambdaRoute(...)`. |
| `hosting-bucket.js` | `HostingBucket` | The S3 bucket for the built site, with website hosting and public read ([ADR 0016](../docs/arch/0016-serve-site-from-s3-through-api-gateway.md)). |
| `lambda-role.js` | `LambdaRole` | The IAM role one Lambda runs as. Gives CloudWatch logging, plus `read` or `write` access to the table if one is passed in. |
| `links-table.js` | `LinksTable` | The DynamoDB table of links, with the `byUser` index ([ADR 0018](../docs/arch/0018-store-links-in-dynamodb.md)). |
| `user-pool.js` | `UserPool` | The Cognito user pool. Methods: `addWebClient()` for the browser's client, and `addAutoConfirm(...)` for the pre sign-up trigger ([ADR 0019](../docs/arch/0019-cognito-for-sign-in.md)). |

What `stack.js` builds:

- The user pool, its web client, and the auto-confirm trigger.
- The links table.
- `PublicApi`, with the site bucket for `/` and `/{proxy+}`, and `config.json` written next to the site files.
- The custom domain (`DomainName`, `ApiMapping`) using the ACM certificate from `cdk.json`.
- Four Lambda routes: `GET /api/links`, `POST /api/links`, `DELETE /api/links/{shortCode}` (all behind the JWT authorizer), and `GET /r/{code}` (public).

## Rules

- **Read the ADRs first.** Before changing the stack, the routes, or the build, read [ADR 0015](../docs/arch/0015-host-on-aws-with-cdk.md), [ADR 0016](../docs/arch/0016-serve-site-from-s3-through-api-gateway.md), and [ADR 0022](../docs/arch/0022-wrap-cdk-constructs-in-app-classes.md). Before changing the table or the user pool, read [ADR 0018](../docs/arch/0018-store-links-in-dynamodb.md) and [ADR 0019](../docs/arch/0019-cognito-for-sign-in.md).
- **Keep data safe.** The DynamoDB table and the user pool use `RETAIN`, so `cdk destroy` does not delete user data. Do not change this without a new ADR.
- **No account ids or secrets in code.** Domain and certificate ARN come from `cdk.json` or `cdk deploy -c name=value`.
- **Browser config comes from `config.json`.** CDK writes the Cognito ids to `config.json` in the site files. Do not add them as `VITE_` variables ([ADR 0019](../docs/arch/0019-cognito-for-sign-in.md)).
- **Deploy order matters.** `npm run build` at the root must run before `cdk deploy`, because `BucketDeployment` uploads `dist/`.
- **The certificate is manual.** The ACM certificate must exist before the first deploy, and its DNS validation record is added in Cloudflare by hand ([ADR 0015](../docs/arch/0015-host-on-aws-with-cdk.md)).
- **Match the style of the code around your change.** Keep files small and named after what they do. This is a teaching codebase, so favor clear code over clever code.

## Commands

Run from this folder (`cd infra`):

```
npm install          Install the CDK dependencies (once)
npx cdk synth        Build the CloudFormation template and check it, without deploying
npx cdk diff         Show what a deploy would change
npx cdk deploy       Deploy the stack (run `npm run build` in the root first)
npx cdk destroy      Remove the stack. The table and user pool are kept.
```

## Adding a route

1. Add a handler file in `api/links/` (or another folder in `api/`) that exports `handler`.
2. Add an `addLambdaRoute` call in `stack.js`, with its own `LambdaRole`, and the `authorizer` for any route that needs a signed-in user.
3. Add the matching function in `frontend/services/urls.js`.
4. Run `npx cdk synth` to check the template before deploying.
5. If the route changes the access rules or the table, write an ADR first ([docs/arch/CLAUDE.md](../docs/arch/CLAUDE.md)).
