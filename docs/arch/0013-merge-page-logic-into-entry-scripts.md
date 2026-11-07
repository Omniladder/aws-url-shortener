# ADR 0013: Put each page's logic in its entry script

- **Status:** Superseded by [ADR 0014](0014-page-scripts-in-pages-folder.md)
- **Date:** 2026-11-07

## Context

Each HTML page had two JavaScript files. The entry script (`login-main.js`, `dashboard-main.js`, `create-main.js`) imported the service functions and passed them to a `setUp...` function in `src/pages/`. The `src/pages/` file added the event listeners and handled the form and table. It never imported `src/services/`. Its actions came in as arguments.

This split kept Supabase calls out of the page code, as the layer rules in `CLAUDE.md` required. It also made each page take two files to read. A reader had to follow the entry script to the `pages/` file and back to see what a button does.

The split also added a rule the workshop does not need. The app has four pages and one client, and the page code is short. The security of the app comes from Row Level Security in the database, not from keeping Supabase calls out of the page code (see [ADR 0002](0002-supabase-as-managed-backend.md) and [ADR 0004](0004-single-urls-table-with-row-level-security.md)).

## Decision

- Each page's behavior lives in its entry script: `src/login-main.js`, `src/dashboard-main.js`, `src/create-main.js`, and `src/redirect-main.js`.
- The `src/pages/` folder is removed.
- The entry scripts may call the functions in `src/services/`. They may also use the Supabase client from `src/lib/supabase.js` directly.
- `src/services/` and `src/lib/supabase.js` stay as they are. The sign-in and link functions remain in `src/services/`, so they can be shared and read in one place.
- The login entry script is named `login-main.js` to match the other entry scripts.

This ADR amends the part of [ADR 0009](0009-one-html-file-per-page.md) that says the JavaScript in `src/pages/` connects the markup to behavior. The rest of ADR 0009 stands, and the markup for each page is still in its own HTML file.

## Consequences

- A reader can see a page's markup in its HTML file and its behavior in one script. Two files per page become one script.
- The page code can now call Supabase or the services directly. Nothing stops a page from building its own queries, so a future change can break the layout that `CLAUDE.md` describes. The layer rules in `CLAUDE.md` are updated to match this ADR.
- The entry scripts are longer. The dashboard script is the longest, at about 130 lines, and stays small enough to read in one sitting.
- The `docs/design/` pages and the user guides that named `src/pages/` now name the entry scripts.
- Services keep their single purpose: each function does one thing and returns data or throws an error.
