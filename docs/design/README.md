# Design: How the code works

This folder explains what each function in the code is for. It is written for a new developer who has not seen the project before. Each page covers one file in `frontend/`, and it describes the purpose of each function in plain words.

The same descriptions are written as JSDoc comments directly above each function in the code. Read this folder to get the big picture. Read the code comments when you are about to change a function.

## Files

| Document | Covers |
|----------|--------|
| [01-entry-point.md](01-entry-point.md) | `frontend/pages/login.js`, the first script the browser runs on the login page |
| [02-login-page.md](02-login-page.md) | `frontend/pages/login.js`, the login form behavior |
| [03-auth-service.md](03-auth-service.md) | `frontend/services/auth.js`, the log in or register action |
| [04-urls-service.md](04-urls-service.md) | `frontend/services/urls.js`, the action that saves a short link |

## Keeping this current

When you add, rename, or remove a function, update its JSDoc comment and the matching design page in the same change. See [docs/CLAUDE.md](../CLAUDE.md).
