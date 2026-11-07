# ADR 0009: Put the markup for each page in its own HTML file

- **Status:** Accepted (the routing part is superseded by 0016)
- **Date:** 2026-11-06

## Context

The login form's HTML was written inside a JavaScript string in `src/pages/login.js`. That hides the page layout from anyone who reads the HTML, and it makes the HTML harder to find and change.

The app has four pages: login, dashboard, create, and redirect. [ADR 0007](0007-vercel-hosting-with-spa-rewrites.md) sends every path to `index.html`, so today the app has one HTML file.

## Decision

Keep the markup for each page in its own HTML file:

- `index.html` is the login page. It is the file Vercel serves for `/`.
- Each other page gets its own file, such as `dashboard.html`, `create.html`, and `redirect.html`. Each file holds that page's markup.
- The JavaScript in `src/pages/` connects the markup to behavior. It does not build HTML strings.
- Vite builds each HTML file as a separate page. Each file is listed in `vite.config.js`.

This ADR replaces the rewrite rule in ADR 0007. The `vercel.json` change and the `vite.config.js` change are made together, when the second page is built. The change is not made in this ADR.

## Consequences

- A person reading the HTML can see each page's layout without reading JavaScript.
- Each page needs a rewrite in `vercel.json` so that a direct visit to `/dashboard` or `/r/:code` works. A rule that sends everything to `index.html` would send `/dashboard` to the login page.
- Lists that are built at runtime, such as the link table, still need JavaScript to fill in rows. Those rows can be copied from a `<template>` element in the page's HTML.
- This ADR stays "Proposed" until the second page is built and the rewrites are tested on Vercel.
