# ADR 0004: Store all links in one `urls` table protected by Row Level Security

- **Status:** Superseded by 0018
- **Date:** 2026-11-06

## Context

The app stores one kind of record: a shortened link that belongs to a user. There are no analytics, custom aliases, or expiration dates, so no other tables are needed.

Users must be able to manage only their own URLs, but the browser talks to the database directly (see [ADR 0002](0002-supabase-as-managed-backend.md)). Access control therefore has to be enforced in the database.

## Decision

Create one table, `urls`, with these columns: `id` (UUID), `user_id` (UUID, foreign key to `auth.users`), `original_url` (TEXT), `short_code` (TEXT, unique), and `created_at` (TIMESTAMPTZ).

Enable Row Level Security on `urls`. Add policies so that an authenticated user can select, insert, and delete only rows where `user_id = auth.uid()`. The schema lives in `supabase/schema.sql`.

## Consequences

- Access control is visible in one SQL file, which is useful for teaching.
- The `user_id` foreign key deletes a user's links when the user is deleted, if the constraint uses `ON DELETE CASCADE`.
- Every query must be scoped by the database policy. A missing policy means either no data is returned or all data is exposed, so the schema must be tested for both cases.
- Public redirect lookups need a separate mechanism. See [ADR 0006](0006-public-redirect-lookup-without-private-data.md).
