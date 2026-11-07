# ADR 0011: Manage database changes with Supabase migrations

- **Status:** Superseded by 0018
- **Date:** 2026-11-06

## Context

The database setup was one file, `supabase/schema.sql`, that was pasted into the Supabase SQL editor by hand. Running it again was the only way to apply a change, and nothing recorded which changes had already run. A change made in the dashboard could also drift away from the file without anyone noticing.

## Decision

Keep database changes in `supabase/migrations/` as numbered SQL files, managed by the Supabase CLI:

- Each change is a new file, created with `npx supabase migration new <name>`.
- The CLI runs each file once, in order, and records which files have run.
- `npx supabase db push` applies new migrations to the linked project.
- A migration that has already run is never edited. A change to it is a new migration.

The first migration, `20261106163958_create_urls.sql`, holds the table, policies, and redirect lookup that were in `schema.sql`.

This ADR changes where the schema lives, which [ADR 0004](0004-single-urls-table-with-row-level-security.md) and [ADR 0010](0010-add-name-to-urls.md) refer to as `supabase/schema.sql`. Their decisions about the table and its rules still stand.

## Consequences

- Each change to the database is recorded in the repository and can be reviewed.
- Setup takes one more tool, the Supabase CLI, which needs a login and the project's database password.
- Students must run `db push` instead of pasting a file, so the setup guide shows both steps.
