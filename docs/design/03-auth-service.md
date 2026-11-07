# 03: Auth service (`frontend/services/auth.js`)

`frontend/services/auth.js` is the only code that signs users in. The login page does not call Cognito itself. It calls the one function in this file.

## The function

### `logInOrRegister(email, password)`

Logs the user in. If no account exists for the email, it creates one and logs in.

Cognito says "UserNotFoundException" for an email with no account, and "NotAuthorizedException" for a wrong password. So the function works in three steps:

1. It tries to log in. If that works, it stops.
2. If the error is a wrong password, it shows "That password is wrong for this email." Any other error is shown as it is.
3. If the email has no account, it registers the email and logs in again. The account is confirmed on creation, so no email step is needed.

See [ADR 0019](../arch/0019-cognito-for-sign-in.md) for why the account is confirmed without an email step.

## Related

- [01: Entry point](01-entry-point.md), which passes this function to the login page.
- [02: Login page](02-login-page.md), which shows the messages in its red box.
