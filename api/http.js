// api/http.js
// Response and user-id helpers for the Lambda handlers (ADR 0017).

/**
 * Builds an HTTP API response with a JSON body.
 *
 * @param {number} statusCode - The HTTP status, such as 200 or 404.
 * @param {object} body - The data to send. It is converted to JSON.
 * @returns {{ statusCode: number, headers: object, body: string }} The response for API Gateway.
 */
export function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  };
}

/**
 * Returns the signed-in user's id (the Cognito `sub`). API Gateway checks the
 * token before the Lambda runs, so the claims are already verified.
 *
 * @param {object} event - The API Gateway event.
 * @returns {string} The user id.
 */
export function userIdFrom(event) {
  return event.requestContext.authorizer.jwt.claims.sub;
}

/**
 * Reads the JSON body of a request.
 *
 * @param {object} event - The API Gateway event.
 * @returns {object | null} The parsed body, or `null` when it is not valid JSON.
 */
export function bodyFrom(event) {
  try {
    return JSON.parse(event.body ?? '{}');
  } catch {
    return null;
  }
}
