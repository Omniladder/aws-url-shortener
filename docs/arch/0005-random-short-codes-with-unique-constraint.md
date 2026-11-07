# ADR 0005: Generate random short codes and enforce uniqueness in the database

- **Status:** Superseded by 0018
- **Date:** 2026-11-06

## Context

Each shortened URL needs a short, unique code that appears in the path `/r/:code`. The codes must not be guessable in a way that lets someone list other users' links, and two links must never share a code.

Checking for duplicates in application code is not safe when two users create links at the same moment. Only the database can guarantee uniqueness.

## Decision

- Generate the code in the browser from random characters (URL-safe letters and digits, about 6 to 8 characters).
- Put a `UNIQUE` constraint on `urls.short_code`.
- When an insert fails with a unique-violation error, generate a new code and try again. Limit the retries to a small number, such as 5, and show an error if all of them fail.

## Consequences

- Uniqueness is guaranteed by PostgreSQL, not by the client.
- The retry loop is a short, readable example of how a client handles a database error. It is worth pointing out in the workshop.
- A random code with 6 to 8 characters has a very small chance of collision. Retries are a safety net, not the normal path.
- Users cannot choose their own codes. Custom aliases are out of scope.
