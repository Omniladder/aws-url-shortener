# ADR 0014: Put each page's script in `frontend/pages/`, named after the page

- **Status:** Accepted
- **Date:** 2026-11-07

## Context

[ADR 0013](0013-merge-page-logic-into-entry-scripts.md) merged each page's behavior into one script and kept those scripts at the top of `frontend/`. Their names had a `-main` suffix, such as `login-main.js`. That suffix made the files look like something other than page code, and the scripts sat beside the `services/` and `lib/` folders with no grouping.

## Decision

- Each page's script lives in `frontend/pages/`, named after the page:
  - `frontend/pages/login.js` for `index.html`
  - `frontend/pages/dashboard.js` for `dashboard.html`
  - `frontend/pages/create.js` for `create.html`
  - `frontend/pages/redirect.js` for `redirect.html`
- Each script holds the page's behavior, as ADR 0013 decided. The scripts may call the functions in `frontend/services/`. (Originally they could also call the Supabase client directly. That client was removed by [ADR 0021](0021-retire-supabase-and-vercel.md).)
- `frontend/services/` and `frontend/index.css` stay where they are.

This ADR supersedes [ADR 0013](0013-merge-page-logic-into-entry-scripts.md) for the file locations and names. The merge itself is restated here and is unchanged.

## Consequences

- Each page's script sits in one folder, and its name matches the HTML page it belongs to.
- Scripts in `frontend/pages/` import shared code with `../`, such as `../services/auth.js`.
- The `<script>` tag in each HTML file points to `/frontend/pages/<name>.js`.
- The `-main` suffix from [ADR 0013](0013-merge-page-logic-into-entry-scripts.md) is gone, so `frontend/pages/login.js` replaces `login-main.js` and there is no name clash to avoid.
