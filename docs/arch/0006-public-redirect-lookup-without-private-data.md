# ADR 0006: Let anonymous visitors resolve a short code through a restricted lookup

- **Status:** Superseded by 0020
- **Date:** 2026-11-06

## Context

Visiting `/r/:code` must work without signing in. The redirect page has to find the `original_url` for a code. ADR 0004 restricts `urls` rows to their owner, so an anonymous visitor cannot read the table at all.

Opening the table to anonymous reads would expose `user_id`, `created_at`, and the full list of links. The requirements say public redirect lookups must not expose private user data.

## Decision

Keep the RLS policies on `urls` as they are. Add a PostgreSQL function, for example `get_original_url(code text)`, that:

- runs with `SECURITY DEFINER` so it can read the row,
- returns only the `original_url` text for the matching `short_code`,
- is granted `EXECUTE` to the `anon` role.

The redirect page calls this function through the Supabase API (`supabase.rpc('get_original_url', { code })`). If no row matches, it returns null and the page shows the "link not found" error.

## Consequences

- Anonymous visitors can resolve a code but cannot list links, read `user_id`, or read `created_at`.
- The function is a small, visible piece of SQL that can be used to teach stored procedures and access control.
- The `SECURITY DEFINER` function must set a fixed `search_path` to avoid a known privilege escalation pattern. The schema file must include this.
- Anyone who knows a code can still open that link. This is intended: short links are public by design.
- Status stays "Proposed" until the function is written in `supabase/schema.sql` and tested with the anon key.
