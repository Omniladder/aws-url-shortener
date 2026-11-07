# ADR 0019: Use Amazon Cognito for email and password sign-in

- **Status:** Accepted
- **Date:** 2026-11-07

## Context

[ADR 0003](0003-supabase-auth-for-sessions.md) used Supabase Auth. The app still needs email and password sign-in, session tokens in the browser, and a way for the API to know who is calling. Writing this ourselves would be a security risk, as before.

## Decision

- Use an Amazon Cognito user pool with email as the sign-in name, a minimum password of 8 characters, and self sign-up.
- The browser uses the `aws-amplify` library (`aws-amplify/auth`) to call `signIn`, `signUp`, `signOut`, and `fetchAuthSession`. The setup is in `frontend/lib/amplify.js`.
- **Login or register on one form:** `frontend/services/auth.js` tries `signIn` first. If Cognito says `UserNotFoundException`, the function calls `signUp` and then `signIn` again. A wrong password gives "That password is wrong for this email.", the same message as before.
- **No email confirmation:** a pre sign-up Lambda (`api/auth/auto-confirm.js`) confirms each new account, so registering and logging in happen in one step, as they did in the app.
- The pool client sets `preventUserExistenceErrors: false`. Without this, Cognito would hide whether an email is registered, and the register-on-miss flow could not work.
- The browser sends the **ID token** in the `Authorization: Bearer` header. API Gateway's JWT authorizer checks it against the pool's issuer and the app's client id ([ADR 0017](0017-api-gateway-with-one-lambda-per-route.md)).
- The pool's ids are written to `config.json` by CDK. The browser fetches that file at startup, so the build does not need them ([ADR 0016](0016-serve-site-from-s3-through-api-gateway.md)).
- Social login, password reset, and magic links remain out of scope ([ADR 0008](0008-scope-limited-to-core-crud.md)).

## Consequences

- Anyone can register any email address without proving they own it. The workshop accepts this. Turning on email verification later means removing the pre sign-up trigger and adding a confirmation step to the login page. That change needs a new ADR.
- Letting Cognito reveal whether an email is registered makes it possible to find out who has an account. The old app had the same leak, so this does not make things worse.
- Session tokens live in the browser's local storage (managed by Amplify). Signing out on one device does not sign out others, as before.
- Routing still checks the session in the page scripts. Those checks are a convenience. The API is the real check.
