# ADR 0017: Expose the API through API Gateway with one Lambda per route

- **Status:** Accepted
- **Date:** 2026-11-07

## Context

[ADR 0002](0002-supabase-as-managed-backend.md) had no server code: the browser called Supabase directly. The new design needs a server-side API so that the database rules can be checked in code, and so that the redirect can run without a page load. The workshop should show a clear mapping from route to code.

## Decision

- Use an Amazon API Gateway **HTTP API**. It is cheaper than the REST API and supports the JWT authorizer we need.
- Each route has its own Lambda function, in `api/links/`:

| Route | Lambda file | Who can call it |
| --- | --- | --- |
| `GET /api/links` | `list.js` | Signed-in user |
| `POST /api/links` | `create.js` | Signed-in user |
| `DELETE /api/links/{shortCode}` | `delete.js` | Signed-in user |
| `GET /r/{code}` | `redirect.js` | Anyone |

- The three `/api/links` routes check the Cognito ID token in API Gateway, before the Lambda runs. The Lambda reads the user id from the verified claims.
- Errors come back as JSON with an `error` message, which the browser shows to the user.
- The browser and API share one domain, so no CORS headers are needed.
- Lambda functions run Node.js 22. CDK bundles each file with esbuild.

## Consequences

- Each Lambda is small and does one job, which fits the workshop.
- Each Lambda has its own IAM role. Each one gets only the table access it needs (read-only for listing and redirecting).
- Cold starts add a little delay to the first request after a quiet period. This is acceptable for the app.
- Adding a route means adding a file in `api/`, a route in `infra/lib/short-links-stack.js`, and a function in `frontend/services/`.
