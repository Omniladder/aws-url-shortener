// api/links/create.js
// POST /api/links: saves a new short link for the signed-in user (ADR 0018).
import { randomBytes } from 'node:crypto';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import { db, TABLE_NAME } from '../db.js';
import { bodyFrom, json, userIdFrom } from '../http.js';
import { toLink } from './to-link.js';

const CODE_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const CODE_LENGTH = 6;
const MAX_TRIES = 5;

/**
 * Makes a random short code from letters and digits (ADR 0005).
 *
 * @returns {string} A code such as `Qw7mZ2`.
 */
function randomCode() {
  const bytes = randomBytes(CODE_LENGTH);
  let code = '';
  for (const byte of bytes) {
    code += CODE_CHARACTERS[byte % CODE_CHARACTERS.length];
  }
  return code;
}

/**
 * Checks that the text is a web address that starts with http:// or https://.
 *
 * @param {unknown} text - The value from the request body.
 * @returns {boolean} `true` for a valid http or https address.
 */
function isWebAddress(text) {
  try {
    const { protocol } = new URL(text);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
}

export async function handler(event) {
  const userId = userIdFrom(event);
  const body = bodyFrom(event);
  if (!body) return json(400, { error: 'The request body must be JSON.' });

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const originalUrl = typeof body.originalUrl === 'string' ? body.originalUrl.trim() : '';
  if (!name) return json(400, { error: 'Enter a name for the link.' });
  if (!isWebAddress(originalUrl)) {
    return json(400, { error: 'Enter a full web address that starts with http:// or https://.' });
  }

  const item = { userId, name, originalUrl, createdAt: new Date().toISOString() };

  // The table key is shortCode, so a clash fails the write. Try again with a new code, up to five times.
  for (let attempt = 0; attempt < MAX_TRIES; attempt += 1) {
    const shortCode = randomCode();
    try {
      await db.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: { ...item, shortCode },
        ConditionExpression: 'attribute_not_exists(shortCode)',
      }));
      return json(201, toLink({ ...item, shortCode }));
    } catch (error) {
      if (!(error instanceof ConditionalCheckFailedException)) throw error;
    }
  }

  return json(500, { error: 'Could not make a free short code. Try again.' });
}
