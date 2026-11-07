# ADR 0018: Store links in DynamoDB with ownership and uniqueness enforced in code

- **Status:** Accepted
- **Date:** 2026-11-07

## Context

[ADR 0004](0004-single-urls-table-with-row-level-security.md) stored links in a PostgreSQL table protected by Row Level Security (RLS). [ADR 0005](0005-random-short-codes-with-unique-constraint.md) made the database enforce unique short codes. DynamoDB has no RLS and no UNIQUE constraints, so both rules must be built another way. The data model, the one-table design, and the random codes all still hold.

## Decision

- One DynamoDB table, `LinksTable`, with on-demand billing. Its partition key is `shortCode`.
- Each item has: `shortCode` (the key), `userId` (the Cognito `sub` of the owner), `name` (required), `originalUrl`, and `createdAt` (ISO 8601 text).
- A global secondary index, `byUser`, has `userId` as its partition key and `createdAt` as its sort key. The dashboard reads one user's links with a single Query on this index.
- **Uniqueness:** the table key is `shortCode`. `create.js` writes with `ConditionExpression: attribute_not_exists(shortCode)`. On a clash it makes a new random code and tries again, up to five times (the same rule as ADR 0005).
- **Ownership (replaces RLS):** the Lambdas check the user, not the database. `list.js` queries only the caller's `userId`. `delete.js` deletes with `ConditionExpression: userId = :caller`. If the condition fails, it answers 404, so it does not reveal whether another user's link exists.
- **Validation (replaces the CHECK and NOT NULL constraints):** `create.js` refuses an empty name and a URL that does not start with `http://` or `https://`, before it writes.
- The table is defined in `infra/constructs/links-table.js` (the `LinksTable` construct) and created in `infra/stack.js`. Each Lambda's role gets read or write access to it through `LambdaRole` in `infra/constructs/lambda-role.js`. Table changes go through CDK, not hand-edited consoles. This replaces the Supabase migrations ([ADR 0011](0011-manage-database-changes-with-migrations.md)).
- The table uses `RETAIN`, so a stack deletion keeps the data.

## Consequences

- The security rule now lives in `api/links/` code, and a bug there could expose data. The rule is tested by reading the three handlers and by trying to delete another user's code.
- The table has no schema beyond the key. The attribute names above are a convention in the code.
- The short code is the primary key, so a code can be read by anyone who knows it. This is intended ([ADR 0020](0020-redirect-short-links-in-lambda.md)).
- Links from the Supabase database are not copied to DynamoDB. The app starts with an empty table.
