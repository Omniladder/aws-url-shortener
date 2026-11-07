# ADR 0003: Use Supabase Auth with email and password

- **Status:** Superseded by 0019
- **Date:** 2026-11-06

## Context

Users must register, log in, log out, and stay logged in between visits. Each user must see only their own URLs. Writing password hashing, session tokens, and a user table ourselves would be a security risk and a distraction for the workshop.

## Decision

Use Supabase Auth with email and password as the only sign-in method. The Supabase client stores the session in the browser and refreshes it automatically. The router checks the session before showing `/dashboard` and `/create`, and sends signed-in users away from `/login`.

Social login, magic links, and password reset are out of scope.

## Consequences

- Authentication is a few client calls: `signUp`, `signInWithPassword`, `signOut`, and `getSession`.
- Supabase Auth owns the `auth.users` table. The `urls.user_id` column references it through a foreign key.
- Session checks in the router are a convenience for the user experience. The real access control is RLS in the database (see [ADR 0004](0004-single-urls-table-with-row-level-security.md)).
- Email confirmation settings in the Supabase project affect the sign-up flow. The workshop setup must document whether confirmation is on or off.
