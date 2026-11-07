import '../index.css';
import { getSession, logInOrRegister } from '../services/auth.js';

const container = document.querySelector('#login');
const form = container.querySelector('form');
const errorBox = container.querySelector('.login-error');
const buttons = container.querySelectorAll('button');

/**
 * Sends the user straight to the dashboard when they are already logged in,
 * so the login form is skipped.
 */
async function redirectIfLoggedIn() {
  // Short links (/r/:code) belong to the redirect page, not the login page.
  if (window.location.pathname.startsWith('/r/')) return;
  if (await getSession()) window.location.href = '/dashboard.html';
}

/**
 * Shows a message in the red box under the form. An empty message hides the box.
 *
 * @param {string} message - The text to show, or an empty string to hide the box.
 */
function showError(message) {
  errorBox.textContent = message;
  errorBox.hidden = !message;
}

/**
 * Turns the form's buttons on or off while a request is running, so the user
 * cannot click them twice.
 *
 * @param {boolean} isBusy - `true` to disable the buttons, `false` to enable them.
 */
function setBusy(isBusy) {
  form.setAttribute('aria-busy', String(isBusy));
  buttons.forEach((button) => {
    button.disabled = isBusy;
  });
}

/**
 * Runs when the form is sent, by pressing Enter or clicking Log in.
 * Stops the browser from reloading the page, then checks that both fields
 * are filled in. Logs in or registers, then sends the user to the dashboard.
 * If that fails, the error is shown under the form and no redirect happens.
 */
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = form.email.value.trim();
  const password = form.password.value;

  if (!email || !password) {
    showError('Enter your email and password.');
    return;
  }

  showError('');
  setBusy(true);
  try {
    await logInOrRegister(email, password);
    window.location.href = '/dashboard.html';
  } catch (error) {
    showError(error.message);
  } finally {
    setBusy(false);
  }
});

/**
 * Starts the login page. Log in uses `logInOrRegister`. It logs in when the
 * account exists and creates the account when it does not.
 */
redirectIfLoggedIn();
