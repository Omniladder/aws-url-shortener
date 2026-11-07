import { getIdToken } from './auth.js';

/**
 * Calls the Short Links API. Adds the signed-in user's ID token, which
 * API Gateway checks before the Lambda runs. See docs/arch/0017.
 *
 * @param {string} path - The API path, such as `/api/links`.
 * @param {RequestInit} [options] - Method and body for `fetch`.
 * @returns {Promise<Response>} The response. Throws if it is not ok.
 * @throws {Error} The message from the API, or a generic message.
 */
async function callApi(path, options = {}) {
  const token = await getIdToken();
  if (!token) throw new Error('Log in first.');

  const response = await fetch(path, {
    ...options,
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error ?? 'Something went wrong. Try again.');
  }
  return response;
}

/**
 * Saves a new short link for the signed-in user. The API makes a random code
 * and the table refuses a code that is already used. See docs/arch/0018.
 *
 * @param {string} name - The name for the link. Required.
 * @param {string} originalUrl - The address the short link redirects to.
 * @returns {Promise<object>} The new link, with `name`, `short_code`, and `original_url`.
 * @throws {Error} If the API refuses the link.
 */
export async function createLink(name, originalUrl) {
  const response = await callApi('/api/links', {
    method: 'POST',
    body: JSON.stringify({ name, originalUrl }),
  });
  return response.json();
}

/**
 * Returns the signed-in user's links, newest first. A visitor who is not
 * logged in gets an empty list, so the dashboard shows its welcome message.
 *
 * @returns {Promise<object[]>} The links, with `name`, `short_code`, and `original_url`.
 * @throws {Error} If the API returns an error.
 */
export async function listLinks() {
  if (!(await getIdToken())) return [];
  const response = await callApi('/api/links');
  return response.json();
}

/**
 * Deletes one of the signed-in user's links. The API only deletes a row the
 * user owns (see docs/arch/0018).
 *
 * @param {string} shortCode - The short code of the link to delete, from `listLinks`.
 * @throws {Error} If the API returns an error.
 */
export async function deleteLink(shortCode) {
  await callApi(`/api/links/${encodeURIComponent(shortCode)}`, { method: 'DELETE' });
}
