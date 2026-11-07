import '../index.css';
import { logOut } from '../services/auth.js';
import { deleteLink, listLinks } from '../services/urls.js';

const dashboard = document.querySelector('#dashboard');
const logOutButton = dashboard.querySelector('[data-logout]');
const tbody = dashboard.querySelector('tbody');

/**
 * Logs the user out, then sends them to the login page.
 * If the log out fails, the button stays off and no redirect happens.
 */
async function logOutAndGoHome() {
  await logOut();
  window.location.href = '/';
}

/**
 * Copies text to the clipboard. The button says "Copied!" for a moment.
 * If the browser refuses, an alert shows the text so the user can copy it by hand.
 *
 * @param {HTMLElement} button - The button that was clicked.
 * @param {string} text - The text to copy.
 */
async function copyText(button, text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    window.alert(`Could not copy. Select this text and copy it yourself:\n${text}`);
    return;
  }

  const label = button.textContent;
  button.textContent = 'Copied!';
  setTimeout(() => {
    button.textContent = label;
  }, 1500);
}

/**
 * Replaces the rows in the links table with one row per link.
 * Each row is a copy of the `#link-row` template in `dashboard.html`.
 * With no links, the table is hidden and the welcome message shows instead.
 *
 * Short links show the full address, such as https://go.dustintobrien.com/r/Qw7mZ2,
 * so the user can copy it. The host comes from the browser.
 *
 * @param {{ name: string, short_code: string, original_url: string }[]} links - The rows from `listLinks`.
 */
function renderLinks(links) {
  const template = dashboard.querySelector('#link-row');
  const table = dashboard.querySelector('.links-table');
  const emptyState = dashboard.querySelector('[data-empty]');

  table.hidden = links.length === 0;
  emptyState.hidden = links.length > 0;

  const rows = links.map((link) => {
    const row = template.content.firstElementChild.cloneNode(true);
    const shortUrl = new URL(`/r/${link.short_code}`, window.location.origin).href;

    row.dataset.linkId = link.short_code;
    row.querySelector('[data-name]').textContent = link.name;
    row.querySelector('[data-destination]').textContent = link.original_url;
    row.querySelector('[data-visit]').href = link.original_url;

    const shortLink = row.querySelector('[data-short-path]');
    shortLink.href = shortUrl;
    shortLink.textContent = shortUrl;

    return row;
  });

  tbody.replaceChildren(...rows);
}

/**
 * Loads the user's links and shows them in the table.
 */
async function showMyLinks() {
  renderLinks(await listLinks());
}

/**
 * Runs when the log out button is clicked. Turns the button off while the
 * log out runs, so it cannot be clicked twice.
 */
logOutButton.addEventListener('click', async () => {
  logOutButton.disabled = true;
  await logOutAndGoHome();
});

/**
 * Runs when a button in the links table is clicked. The click is handled on the
 * table body because the rows are added later, by renderLinks.
 * The copy buttons put the matching text on the clipboard. Delete asks the user
 * to confirm, then deletes the link and reloads the page. If the delete fails,
 * the error is shown in an alert.
 */
tbody.addEventListener('click', async (event) => {
  const row = event.target.closest('tr');
  if (!row) return;

  const copyUrlButton = event.target.closest('[data-copy-url]');
  if (copyUrlButton) {
    await copyText(copyUrlButton, row.querySelector('[data-destination]').textContent);
    return;
  }

  const copyShortButton = event.target.closest('[data-copy-short]');
  if (copyShortButton) {
    await copyText(copyShortButton, row.querySelector('[data-short-path]').textContent);
    return;
  }

  if (!event.target.closest('[data-delete]')) return;
  if (!window.confirm('Delete this short link? Anyone who opens it will see "Link not found".')) return;

  try {
    await deleteLink(row.dataset.linkId);
    window.location.reload();
  } catch (error) {
    window.alert(error.message);
  }
});

/**
 * Starts the dashboard by loading the links.
 */
showMyLinks();
