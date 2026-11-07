# 05: Future ideas (parked)

These ideas came up during planning. None of them are in the current scope (see [ADR 0008](../arch/0008-scope-limited-to-core-crud.md)). They are listed so the group can discuss them without building them.

Each idea is a candidate for a workshop exercise or a later version. If one is picked up, it needs its own ADR first.

## Features

| Idea | What it would add | Teaching value | Cost |
|------|-------------------|----------------|------|
| Click count | A counter on each link, updated on redirect | Shows writes from an anonymous visitor, which raises access control questions | Medium: needs a safe way to increment without exposing data |
| Custom alias | User picks the short code, such as `/r/my-talk` | Shows a conditional write error in the Lambda | Low |
| Expiration date | Links stop working after a date | Shows a server-side check versus a client-side check | Medium |
| Edit destination | Change the original URL of an existing link | Shows an owner check on an update in the Lambda | Low |
| Copy history | Log of copied links per user | Adds a second DynamoDB table | Medium |
| QR code | Show a QR code for each short link | A client-side library with no backend change | Low |

## Platform and process

| Idea | Note |
|------|------|
| Preview stacks per pull request | Deploy a second CDK stack for each branch. Adds cost and cleanup. |
| Local development with DynamoDB Local | Run the table on a laptop, so the workshop works offline. Adds setup time. |
| Automated tests for owner checks | A script that signs in as two users and checks that each sees only their links. Good teaching tool for security. |
| Email password reset | Requires Cognito email set up with Amazon SES. Adds time to setup. |

## Why these are parked

- The workshop is short, and each feature adds code and a new concept.
- Several of them (click count, expiration) need a security decision that deserves its own ADR.
- The core flows in [02-user-flows.md](02-user-flows.md) must work before any of these are considered.
