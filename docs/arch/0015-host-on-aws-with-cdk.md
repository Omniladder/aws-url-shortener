# ADR 0015: Host and run the app on AWS, defined with AWS CDK in JavaScript

- **Status:** Accepted
- **Date:** 2026-11-07

## Context

The app ran on Vercel (hosting) and Supabase (sign-in, database, API). The workshop is about cloud services, and attendees should see one cloud provider's services work together. The team wants a serverless design that scales without servers to manage, and the infrastructure should be code that attendees can read.

## Decision

Run the whole app on AWS:

- **Site files:** an S3 bucket holds the built `dist/` folder ([ADR 0016](0016-serve-site-from-s3-through-api-gateway.md)).
- **API:** API Gateway HTTP API in front of Lambda functions, one per route ([ADR 0017](0017-api-gateway-with-one-lambda-per-route.md)).
- **Data:** a DynamoDB table ([ADR 0018](0018-store-links-in-dynamodb.md)).
- **Sign-in:** an Amazon Cognito user pool ([ADR 0019](0019-cognito-for-sign-in.md)).
- **Short links:** a Lambda answers `/r/{code}` with a redirect ([ADR 0020](0020-redirect-short-links-in-lambda.md)).
- **Infrastructure:** AWS CDK, written in JavaScript (ES modules), in the `infra/` folder. Lambda source is in `api/`. The browser code stays in `frontend/`.
- **Domain:** `go.dustintobrien.com`. The DNS is in Cloudflare, which points a CNAME at the API Gateway domain. Cloudflare stays in DNS-only mode (grey cloud), so API Gateway handles TLS with an ACM certificate.

Vercel and Supabase have been removed. [ADR 0021](0021-retire-supabase-and-vercel.md) records what their code did.

## Consequences

- One `cdk deploy` creates every resource. `cdk destroy` removes the stack, except resources kept on purpose (see below).
- The table and the user pool use `RETAIN`, so deleting the stack does not delete user data. The bucket is rebuilt from `dist/` and is removed with the stack.
- The ACM certificate must be created before the first deploy, and its DNS validation record must be added in Cloudflare by hand. CDK cannot validate it, because the zone is not in Route 53.
- The workshop needs an AWS account and the AWS CLI. Setup docs cover both.
- The app is tied to AWS services. Moving it would mean rewriting `api/` and `infra/`.
