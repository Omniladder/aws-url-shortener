import { fetchAuthSession, signIn, signOut, signUp } from 'aws-amplify/auth';
import { configureAmplify } from '../lib/amplify.js';

/**
 * Logs the user in. If no account exists for this email, creates one and logs in.
 *
 * Cognito says "UserNotFoundException" for an unknown email and "NotAuthorizedException"
 * for a wrong password (the pool client turns off hiding these, see docs/arch/0019).
 * So the function tries to log in first, and only registers on "UserNotFoundException".
 *
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @throws {Error} If the password is wrong or Cognito returns another error.
 */
export async function logInOrRegister(email, password) {
  await configureAmplify();

  try {
    await signIn({ username: email, password });
    return;
  } catch (error) {
    if (error.name === 'NotAuthorizedException') throw new Error('That password is wrong for this email.');
    if (error.name !== 'UserNotFoundException') throw error;
  }

  // The pre sign-up trigger confirms the account, so one sign-in is enough after this.
  await signUp({ username: email, password, options: { userAttributes: { email } } });
  await signIn({ username: email, password });
}

/**
 * Returns the current session's ID token, or `null` when nobody is logged in in this browser.
 * The API checks this token on every request that needs a signed-in user.
 *
 * @returns {Promise<string | null>} The ID token, or `null`.
 */
export async function getIdToken() {
  await configureAmplify();
  const { tokens } = await fetchAuthSession();
  return tokens?.idToken?.toString() ?? null;
}

/**
 * Returns whether someone is logged in in this browser.
 *
 * @returns {Promise<boolean>} `true` when there is a session.
 */
export async function getSession() {
  return (await getIdToken()) !== null;
}

/**
 * Logs the user out of this browser. Sessions on other devices stay active.
 *
 * @throws {Error} If Cognito returns an error.
 */
export async function logOut() {
  await configureAmplify();
  await signOut();
}
