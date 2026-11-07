# ADR 0021: Retire Supabase and Vercel, and keep a record of what their code did

- **Status:** Accepted
- **Date:** 2026-11-07

## Context

[ADR 0015](0015-host-on-aws-with-cdk.md) moves the app to AWS. The Supabase project, the Vercel project, and their code are no longer used. The code is removed from the repository. This ADR keeps a record of what each part did, so the behavior can be understood and rebuilt if needed.

## Decision

Remove these files and settings:

- `supabase/`, including the migrations and the CLI's `.temp` folder.
- `vercel.json` and the Vercel project's settings.
- `.env.example`, `.env.local`, and the `hidden/` folder that held the database password. Their values belong to the retired Supabase project.
- `src/lib/supabase.js` and the `@supabase/supabase-js` dependency.

Then delete the Supabase project in its dashboard, after exporting any data that is still needed. The data is not copied to AWS. Rotate or delete the Supabase keys and database password before deleting the project.

The removal also changes two places that earlier ADRs name. `src/lib/supabase.js` no longer exists, so the file list in [ADR 0013](0013-merge-page-logic-into-entry-scripts.md) and [ADR 0014](0014-page-scripts-in-pages-folder.md) is out of date. The `vercel.json` rewrites named in [ADR 0007](0007-vercel-hosting-with-spa-rewrites.md) and [ADR 0009](0009-one-html-file-per-page.md) are gone. [ADR 0016](0016-serve-site-from-s3-through-api-gateway.md) replaces them.

## What the Supabase code did

These are the rules the AWS code keeps, moved to new places:

- **Sign-up and login** (`src/services/auth.js`): try `signInWithPassword`. On "Invalid login credentials", try `signUp`. If the email is already registered, show "That password is wrong for this email." Now: [ADR 0019](0019-cognito-for-sign-in.md).
- **Session** (`getSession`, `signOut` with `scope: 'local'`): the Supabase client stored the session and refreshed it. Now: Amplify does this.
- **Table `urls`** (migrations `20261106163958` and `20261106170000`): `id` (UUID key), `user_id` (owner, cascades on user delete), `name` (required, backfilled with the destination for older rows), `original_url` (must start with `http://` or `https://`), `short_code` (unique), `created_at`. Now: [ADR 0018](0018-store-links-in-dynamodb.md), which keeps the same fields under different names.
- **Row Level Security:** a signed-in user could select, insert, and delete only rows where `user_id = auth.uid()`. Anonymous visitors could read nothing. Now: the Lambdas check the owner ([ADR 0018](0018-store-links-in-dynamodb.md)).
- **`get_original_url(code)`** (a `SECURITY DEFINER` SQL function granted to `anon` and `authenticated`): returned only `original_url` for a code. Now: [ADR 0020](0020-redirect-short-links-in-lambda.md).
- **Random short codes** (`src/services/urls.js`, 7 characters, up to five tries on a unique-violation error). Now: `api/links/create.js`, using a DynamoDB condition.
- **`vercel.json` rewrites:** `/dashboard`, `/create`, and `/r/:code` to their HTML files, and everything else to `index.html`. Now: [ADR 0016](0016-serve-site-from-s3-through-api-gateway.md) and [ADR 0020](0020-redirect-short-links-in-lambda.md).

## Consequences

- Once the removal is done, the repository contains no Supabase or Vercel code or secrets.
- Anyone who needs the old behavior can read this record, then the Git history from before this change.
- Links that existed in Supabase are not moved. The workshop starts with an empty table.
