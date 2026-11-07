# ADR 0020: Redirect short links in a Lambda

- **Status:** Partly superseded by [ADR 0023](0023-return-not-found-page-from-redirect-lambda.md) (the not-found response only)
- **Date:** 2026-11-07

## Context

[ADR 0006](0006-public-redirect-lookup-without-private-data.md) was never built. It proposed a database function that returned only the destination, and the browser then redirected. That needed a page load and a Supabase call. With API Gateway in place, the redirect can run on the server.

## Decision

- `GET /r/{code}` is handled by `api/links/redirect.js`. It reads the item with a `GetItem` that asks for only `originalUrl` (`ProjectionExpression`), so the owner and dates are never read.
- If the code exists, the Lambda returns `302` with a `Location` header set to the destination.
- If the code does not exist, the Lambda returns `302` to `/redirect.html`. That page shows the existing "Link not found" message, unchanged.
- No sign-in is needed. Anyone who knows a code can use it, as before.
- `redirect.html` keeps its markup. `frontend/pages/redirect.js` now only shows the "not found" state.

## Consequences

- Visitors get the redirect in one step. The redirect page is no longer loaded for known codes.
- The Lambda reads only the destination, so private data stays out of the response, as ADR 0006 intended.
- Unknown codes still show the same page, so the visible behavior is unchanged.
- Redirects are cacheable by browsers and CDNs, but the response does not set cache headers yet. Clicks are not tracked (out of scope, [ADR 0008](0008-scope-limited-to-core-crud.md)).
