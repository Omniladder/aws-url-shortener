# ADR 0008: Limit scope to core create, read, and delete functionality

- **Status:** Accepted
- **Date:** 2026-11-06

## Context

The workshop has a short time slot. The goal is to show how a frontend, authentication, an API, and a database work together. Extra features would add code and concepts that do not support that goal.

## Decision

The application includes only:

- Email and password sign-up, login, and logout.
- Create a short link for a URL the user owns.
- List, copy, and delete the user's own links.
- Public redirect from `/r/:code`.

The following are out of scope:

- Click analytics or any tracking.
- Custom aliases chosen by the user.
- Expiration dates.
- Roles, sharing, teams, or other complex permissions.
- Editing an existing link's destination.

## Consequences

- The database has one table and the code has four pages, which fits in one workshop session.
- Each feature that is left out is listed in `docs/ideation/` so that it can be discussed without being built.
- If a later version adds any out-of-scope feature, it needs a new ADR that explains the change.
