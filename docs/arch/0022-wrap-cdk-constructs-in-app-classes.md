# ADR 0022: Wrap CDK constructs in app classes for the API and hosting

- **Status:** Accepted
- **Date:** 2026-11-07

## Context

[ADR 0015](0015-host-on-aws-with-cdk.md) puts the infrastructure in CDK. The stack will set up an HTTP API, a hosting bucket, Lambda routes, a table, and a user pool. Written directly with CDK constructs, the stack would repeat the same wiring for each route (integration, route, Lambda, IAM role), and the route list would be hard to read. The workshop needs the route table in [ADR 0017](0017-api-gateway-with-one-lambda-per-route.md) to be visible in the code.

## Decision

- Add a small class that extends `apigatewayv2.HttpApi` and is named `PublicApi`. It is the public entry point and keeps the normal HTTP API behavior. The constructs hold no app-specific names or paths; the stack passes those in.
- The class adds two methods:
  - `addHostingBucket(...)` sends the static paths to the S3 site bucket ([ADR 0016](0016-serve-site-from-s3-through-api-gateway.md)).
  - `addLambdaRoute(path, ...)` creates the Lambda function for a route in `api/` and connects it to the given path and method.
- Each class goes in its own file in `infra/constructs/`. `stack.js` calls the methods in order, so the routes read as a list.
- The classes are thin. They hide the CDK wiring and nothing else.

## Consequences

- `stack.js` reads like the route table in ADR 0017. A route is one line.
- Attendees see one class to learn, not every CDK construct.
- The wrapper adds one layer between the code and CDK. Errors may point to the wrapper's file, not the CDK call. Keep the classes short so this stays easy to follow.
- Any change to how routes are wired goes in the class, so it applies to every route at once.
- Built as `PublicApi` in `infra/constructs/gateway.js`. The other wrappers (`HostingBucket`, `LambdaRole`, `LinksTable`, `UserPool`) follow the same pattern.
