# docs/arch: Architecture Decision Records

This folder holds Architecture Decision Records (ADRs). Each ADR records one decision about how the app is built, why it was chosen, and what it costs.

## When to write an ADR

Write a new ADR when a change:

- picks a technology, service, or library the app will depend on (for example, a new AWS service or a UI framework),
- changes the database schema, access rules (RLS policies), or who can see what,
- changes how the app is deployed, routed, or configured,
- adds or removes a feature listed in [ADR 0008](0008-scope-limited-to-core-crud.md), or
- reverses an earlier ADR.

Do not write an ADR for:

- bug fixes, styling changes, or copy edits,
- ideas that are not yet decided (put those in `docs/ideation/`),
- how to run or set up the project (put those in `README.md`).

## When to read ADRs

Read the relevant ADR before changing code it covers. For example:

- Before editing the DynamoDB table or the owner checks in `api/links/`, read [ADR 0018](0018-store-links-in-dynamodb.md) and [ADR 0020](0020-redirect-short-links-in-lambda.md).
- Before editing `frontend/services/auth.js` or the Cognito setup, read [ADR 0019](0019-cognito-for-sign-in.md).
- Before editing `infra/stack.js`, `infra/constructs/`, the routes, or the build setup, read [ADR 0015](0015-host-on-aws-with-cdk.md), [ADR 0016](0016-serve-site-from-s3-through-api-gateway.md), and [ADR 0022](0022-wrap-cdk-constructs-in-app-classes.md).

If new code contradicts an accepted ADR, stop and write a new ADR that supersedes it. Do not silently change the code.

## File naming

- Use a four-digit number, then a short kebab-case title: `0009-short-title.md`.
- Numbers only go up. Never reuse or renumber an ADR.
- Copy the format of an existing ADR: title, Status, Date, Context, Decision, Consequences.

## Status values

- **Proposed:** written but not yet built or tested.
- **Accepted:** the decision is in effect.
- **Superseded by NNNN:** replaced by a later ADR. Keep the file and link to the new one.

When an ADR is superseded, change only its Status line. Do not delete it.
