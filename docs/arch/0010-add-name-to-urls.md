# ADR 0010: Add a `name` column to `urls`

- **Status:** Accepted
- **Date:** 2026-11-06

## Context

[ADR 0004](0004-single-urls-table-with-row-level-security.md) lists the columns of the `urls` table: `id`, `user_id`, `original_url`, `short_code`, and `created_at`. The create page has a field for a name, so users can tell their links apart on the dashboard. The table has no column for it.

## Decision

Add a `name` column (TEXT, optional) to `urls`. An empty name is saved as `NULL`, and the dashboard can show the destination URL in that case.

The rest of ADR 0004 stands. The table, the row-level security policies, and the `user_id` foreign key are unchanged.

## Consequences

- The table has one more column than ADR 0004 lists. `supabase/schema.sql` is the source of truth for the columns.
- Custom short codes are still out of scope. The name is a label only and is not used in the link.
