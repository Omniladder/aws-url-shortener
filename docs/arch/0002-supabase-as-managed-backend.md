# ADR 0002: Use Supabase as the managed backend

- **Status:** Superseded by 0015 and 0017
- **Date:** 2026-11-06

## Context

The application needs user accounts, a database, and an API that the browser can call. Building and hosting a custom server would add a lot of setup for a workshop. It would also hide the main teaching point: cloud services can replace much of the backend work.

## Decision

Use Supabase for three things:

- **Supabase Auth** for registration, login, and sessions.
- **Supabase PostgreSQL** for the `urls` table.
- **Supabase API** (the auto-generated REST API and the `supabase-js` client) for browser-to-database calls.

The frontend calls Supabase directly. No custom server code is written.

## Consequences

- There is no backend code to write, deploy, or maintain. The "API" is the Supabase client calls in `src/services/`.
- Security depends on Row Level Security (RLS) in the database, not on server code. See [ADR 0004](0004-single-urls-table-with-row-level-security.md).
- The Supabase project URL and anon key are visible in the browser. This is expected for the anon key, but the workshop must explain why it is safe only when RLS is enabled.
- The app is tied to Supabase's APIs. Moving to another database would mean rewriting `src/services/`.
