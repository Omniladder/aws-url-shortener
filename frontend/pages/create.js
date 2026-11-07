import '../index.css';
import { createLink } from '../services/urls.js';

const container = document.querySelector('#create');
const form = container.querySelector('form');
const errorBox = container.querySelector('.login-error');
const buttons = container.querySelectorAll('button');

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
 * Turns the buttons on or off while a request is running, so the user
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
 * Checks that the text is a web address, starting with http:// or https://.
 *
 * @param {string} text - The text the user typed.
 * @returns {boolean} `true` when the text is a valid http or https address.
 */
function isWebAddress(text) {
  try {
    const { protocol } = new URL(text);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Runs when the form is sent. Checks the name and URL, saves the link, then
 * sends the user to the dashboard. If the save fails, the error is shown under
 * the form and no redirect happens.
 */
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const label = form.label.value.trim();
  const url = form.url.value.trim();

  if (!label) {
    showError('Enter a name for the link.');
    return;
  }
  if (!url) {
    showError('Enter the URL the short link should go to.');
    return;
  }
  if (!isWebAddress(url)) {
    showError('Enter a full web address that starts with http:// or https://.');
    return;
  }

  showError('');
  setBusy(true);
  try {
    await createLink(label, url);
    window.location.href = '/dashboard.html';
  } catch (error) {
    showError(error.message);
  } finally {
    setBusy(false);
  }
});
