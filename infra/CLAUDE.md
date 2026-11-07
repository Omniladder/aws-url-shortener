# infra: AWS CDK app

This folder defines every AWS resource the app uses, in AWS CDK written in JavaScript (ES modules). Run `cdk` commands from this folder. Infrastructure changes go here, not in the AWS console ([ADR 0015](../docs/arch/0015-host-on-aws-with-cdk.md)).

## What is here

| File | What it does |
| --- | --- |
| `app.js` | CDK entry point. Creates the `App` and the stack. |
| `stack.js` | The stack. Will hold the resources and routes once they are written. Currently empty. |
| `cdk.json` | Context values: the site domain and the ACM certificate ARN. Read by the stack. |
| `package.json` | CDK dependencies (`aws-cdk-lib`, `constructs`). Separate from the frontend's `package.json`. |

## Planned structure (not written yet)

The stack will be built from small classes that wrap CDK constructs. Each wrapper has a name that says what it is and hides the CDK details that attendees do not need to see.

- **`ShortLinkApi`** extends `apigatewayv2.HttpApi`, the AWS API Gateway HTTP API. It is the public entry point ([ADR 0017](../docs/arch/0017-api-gateway-with-one-lambda-per-route.md)). It gets two methods:
  - `addHostingBucket(...)`: puts the S3 site bucket behind the gateway for the static paths ([ADR 0016](../docs/arch/0016-serve-site-from-s3-through-api-gateway.md)).
  - `addLambdaRoute(path, ...)`: adds a route for a given path and method, backed by a Lambda function in `api/`.
- Each wrapper goes in its own file. Keep `stack.js` short: it creates the table, the user pool, the bucket, and the API, then calls the methods above in order.

Design rules for these classes:

- Each route in the stack is one `addLambdaRoute` call. Reading the stack top to bottom should match the route table in [ADR 0017](../docs/arch/0017-api-gateway-with-one-lambda-per-route.md).
- The JWT authorizer for `/api/links` uses the pool's issuer and the app's client id ([ADR 0019](../docs/arch/0019-cognito-for-sign-in.md)).
- Each Lambda gets its own IAM role with only the table access it needs (read only for list and redirect).
- Keep the wrappers thin. If a wrapper needs a lot of logic, the logic belongs in the stack or in its own file.

## Rules

- **Read the ADRs first.** Before changing the stack, the routes, or the build, read [ADR 0015](../docs/arch/0015-host-on-aws-with-cdk.md) and [ADR 0016](../docs/arch/0016-serve-site-from-s3-through-api-gateway.md). Before changing the table or the user pool, read [ADR 0018](../docs/arch/0018-store-links-in-dynamodb.md) and [ADR 0019](../docs/arch/0019-cognito-for-sign-in.md).
- **Keep data safe.** The DynamoDB table and the user pool use `RETAIN`, so `cdk destroy` does not delete user data. Do not change this without a new ADR.
- **No account ids or secrets in code.** Domain and certificate ARN come from `cdk.json` or `cdk deploy -c name=value`.
- **Browser config comes from `config.json`.** CDK writes the Cognito ids to `config.json` in the site files. Do not add them as `VITE_` variables ([ADR 0019](../docs/arch/0019-cognito-for-sign-in.md)).
- **Deploy order matters.** `npm run build` at the root must run before `cdk deploy`, because `BucketDeployment` uploads `dist/`.
- **The certificate is manual.** The ACM certificate must exist before the first deploy, and its DNS validation record is added in Cloudflare by hand ([ADR 0015](../docs/arch/0015-host-on-aws-with-cdk.md)).
- **Match the style of the code around your change.** Keep files small and named after what they do. This is a teaching codebase, so favor clear code over clever code.

## Commands

Run from this folder (`cd infra`):

```
3. Add the matching function in `frontend/services/urls.js`.
4. Run `npx cdk synth` to check the template before deploying.
5. If the route changes the access rules or the table, write an ADR first ([docs/arch/CLAUDE.md](../docs/arch/CLAUDE.md)).
