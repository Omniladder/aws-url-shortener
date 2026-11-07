# ADR 0016: Serve the static site from S3 through API Gateway

- **Status:** Accepted
- **Date:** 2026-11-07

## Context

The site is a static Vite build with several HTML pages ([ADR 0009](0009-one-html-file-per-page.md)). It needs a single domain for the site and the API, so the browser has no cross-origin calls and the cookie-free token flow stays simple. Vercel used to rewrite clean addresses such as `/dashboard` to `dashboard.html`. That rewrite no longer exists.

## Decision

- An S3 bucket holds the files from `dist/`. CDK uploads them with `BucketDeployment` during `cdk deploy`.
- The bucket has website hosting turned on, so it serves `index.html` for `/`. Public read is allowed, because the site is public anyway.
- API Gateway sends each request to the right place:
  - `GET /` goes to `index.html`. This is the only fixed route for a page.
  - `GET /{proxy+}` goes to the bucket with the same path. This serves each page at its own file name, such as `/dashboard.html` and `/create.html`, and also serves assets, `logo.svg`, and `config.json`.
  - The `/api/...` and `/r/{code}` routes go to Lambda ([ADR 0017](0017-api-gateway-with-one-lambda-per-route.md), [ADR 0020](0020-redirect-short-links-in-lambda.md)). Their own routes win over the catch-all.
- `config.json` is written next to the site files. It holds the Cognito ids, so the build does not need them in environment variables ([ADR 0019](0019-cognito-for-sign-in.md)).
- This replaces the rewrites in `vercel.json`, which are deleted.

## Consequences

- Pages are addressed by their file names, such as `/dashboard.html`. The site has no clean addresses other than `/`. Links in the frontend must use the `.html` names.
- The routes are listed in `infra/stack.js`, so attendees can see how a URL reaches a file.
- The S3 website endpoint is HTTP only. API Gateway reaches it over HTTP, so the hop from API Gateway to the bucket is not encrypted. Visitors still use HTTPS to reach API Gateway. A later ADR can move the bucket behind a private REST integration if this matters.
- The bucket's contents are public. Do not put private files in `dist/`.
- Deep links to pages that do not exist return the bucket's 404 response.
