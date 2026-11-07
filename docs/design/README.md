# Design: How the code works

This folder explains what each function in the frontend is for. It is written for a new developer who has not seen the project before. Each page covers one file in `frontend/`, and it describes the purpose of each function in plain words.

The API (`api/`) and the AWS setup (`infra/`) are not covered here. Read [ADR 0017](../arch/0017-api-gateway-with-one-lambda-per-route.md) for the routes, and [`infra/CLAUDE.md`](../../infra/CLAUDE.md) for the stack.

The same descriptions are written as JSDoc comments directly above each function in the code. Read this folder to get the big picture. Read the code comments when you are about to change a function.

## Files

| Document | Covers |
|----------|--------|
| [01-entry-point.md](01-entry-point.md) | `frontend/pages/login.js`, the first script the browser runs on the login page |
| [02-login-page.md](02-login-page.md) | `frontend/pages/login.js`, the login form behavior |
| [03-auth-service.md](03-auth-service.md) | `frontend/services/auth.js`, log in or register, log out, and the session |
| [04-urls-service.md](04-urls-service.md) | `frontend/services/urls.js`, create, list, and delete links through the API |
| [05-dashboard-page.md](05-dashboard-page.md) | `frontend/pages/dashboard.js`, the list of links and its buttons |
| [06-create-page.md](06-create-page.md) | `frontend/pages/create.js`, the form that makes a new link |

`frontend/pages/redirect.js` only shows the "Link not found" message when someone opens `redirect.html` directly. It is short enough to read in its JSDoc comment.

## Keeping this current

When you add, rename, or remove a function, update its JSDoc comment and the matching design page in the same change. See [docs/CLAUDE.md](../CLAUDE.md).
