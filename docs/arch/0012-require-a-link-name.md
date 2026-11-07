# ADR 0012: Require a name on every link

- **Status:** Accepted
- **Date:** 2026-11-06

## Context

[ADR 0010](0010-add-name-to-urls.md) added a `name` column and made it optional, so an empty name was saved as `NULL`. The dashboard then had to show a placeholder for links with no name, and the name was not useful as a label for the user's links.

## Decision

Make the name required:

- The create page refuses an empty name with "Enter a name for the link." before it saves.
- The `name` column is `NOT NULL`. The database refuses a row without a name, even if the app's check is skipped.
- A new migration, `20261106170000_require_link_name.sql`, gives each older link without a name its destination as its name, then sets the column to `NOT NULL`.

This changes the optional name from ADR 0010. The rest of ADR 0010 still stands.

## Consequences

- The dashboard always has a name to show for each link.
- Links made before this migration get their destination as a name. The user can't rename them yet, since editing a link is out of scope under [ADR 0008](0008-scope-limited-to-core-crud.md).
