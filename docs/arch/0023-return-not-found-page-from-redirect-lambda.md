# ADR 0023: Return the "Link not found" page from the redirect Lambda

- **Status:** Accepted
- **Date:** 2026-11-07

## Context

[ADR 0020](0020-redirect-short-links-in-lambda.md) said an unknown code gets a `302` to `/redirect.html`, so the browser loads the redirect page and shows the "Link not found" message. That costs an extra page load for a case that is already a dead end.

## Decision

- When `GET /r/{code}` finds no item, `api/links/redirect.js` returns the "Link not found" HTML directly, with status `404` and `content-type: text/html`.
- The HTML is inline in the Lambda file, because the Lambda cannot read the built site files.
- Known codes still get a `302` to the destination, as ADR 0020 describes.
- This supersedes only the not-found part of ADR 0020.

## Consequences

- Unknown codes take one request instead of two.
- The page text now lives in two places: `redirect.html` (used by the frontend) and the Lambda. Keep them in step, or remove `redirect.html` and `frontend/pages/redirect.js` in a later change.
- The `404` status is correct for an unknown code. Browsers still display the page.
