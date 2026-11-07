# 03: Auth service (`frontend/services/auth.js`)

`frontend/services/auth.js` is the only code that signs users in and out. The pages do not call Cognito themselves. They call the functions in this file.

## The functions

### `logInOrRegister(email, password)`

Logs the user in. If no account exists for the email, it creates one and logs in.

Cognito says "UserNotFoundException" for an email with no account, and "NotAuthorizedException" for a wrong password. So the function works in three steps:

1. It tries to log in. If that works, it stops.
2. If the error is a wrong password, it throws "That password is wrong for this email." Any other error that is not "UserNotFoundException" is passed on as it is.
3. If the email has no account, it registers the email and logs in again. The account is confirmed on creation, so no email step is needed.

See [ADR 0019](../arch/0019-cognito-for-sign-in.md) for why the account is confirmed without an email step.

### `getIdToken()`

Returns the current session's ID token, or `null` when nobody is logged in in this browser. The services in `urls.js` send this token to the API, which checks it before each request that needs a signed-in user.

### `getSession()`

Returns `true` when someone is logged in in this browser. The login page uses it to skip the form for users who are already signed in.

### `logOut()`

Logs the user out of this browser. Sessions on other devices stay active.

## Related

- [01: Entry point](01-entry-point.md), which calls `getSession` and `logInOrRegister`.
- [02: Login page](02-login-page.md), which shows the messages from `logInOrRegister`.
- [04: URLs service](04-urls-service.md), which uses `getIdToken`.
- [05: Dashboard page](05-dashboard-page.md), which calls `logOut`.
