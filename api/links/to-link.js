// api/links/to-link.js
// Turns a DynamoDB item into the link shape the browser uses (snake_case, as in frontend/services/urls.js).

/**
 * @param {{ shortCode: string, name: string, originalUrl: string, createdAt: string }} item - A row from the table.
 * @returns {{ short_code: string, name: string, original_url: string, created_at: string }} The link for the browser.
 */
export function toLink(item) {
  return {
    short_code: item.shortCode,
    name: item.name,
    original_url: item.originalUrl,
    created_at: item.createdAt,
  };
}
