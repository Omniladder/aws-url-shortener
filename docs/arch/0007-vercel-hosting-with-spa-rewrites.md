# ADR 0007: Host the built site on Vercel from GitHub, with single-page app rewrites

- **Status:** Superseded by 0015 and 0016
- **Date:** 2026-11-06

## Context

The app is a static Vite build (`dist/`) with client-side routes: `/login`, `/dashboard`, `/create`, and `/r/:code`. Each route is handled by JavaScript in the browser, not by a file on the server.

Workshop attendees should see a full deployment workflow: push to GitHub, and the site updates without manual steps.

## Decision

- Host the site on Vercel and connect it to the GitHub repository.
- Vercel runs `npm install` and `npm run build`, then serves `dist/`.
- Every push to the main branch triggers a new deployment.
- Add a rewrite in `vercel.json` so that any path not matching a file (for example `/r/abc123`) serves `index.html`. The router then decides what to show.

## Consequences

- A direct visit to `/r/:code` or `/dashboard` works, not only navigation from the home page.
- Without the rewrite, Vercel would return 404 for these paths. The rewrite is the first thing to check if deep links fail.
- Environment values for Supabase (project URL and anon key) must be set in Vercel's project settings as `VITE_` variables, because Vite exposes only those to the browser build.
- Preview deployments for pull requests come for free, but are not part of the workshop scope.
