// api/auth/auto-confirm.js
// Cognito pre sign-up trigger (ADR 0019). Confirms each new account so that
// registering and logging in happen in one step, as they did before.
export async function handler(event) {
  event.response.autoConfirmUser = true;
  event.response.autoVerifyEmail = true;
  return event;
}
