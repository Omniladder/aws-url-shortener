// api/links/delete.js
// DELETE /api/links/{shortCode}: deletes one of the signed-in user's links (ADR 0018).
import { DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import { db, TABLE_NAME } from '../db.js';
import { json, userIdFrom } from '../http.js';

export async function handler(event) {
  const userId = userIdFrom(event);
  const shortCode = event.pathParameters?.shortCode;
  if (!shortCode) return json(400, { error: 'Missing short code.' });

  try {
    // Deletes only when the row belongs to this user. Any other case answers 404, so the API does not reveal other users' links.
    await db.send(new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { shortCode },
      ConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: { ':userId': userId },
    }));
  } catch (error) {
    if (error instanceof ConditionalCheckFailedException) {
      return json(404, { error: 'Link not found.' });
    }
    throw error;
  }

  return { statusCode: 204, body: '' };
}
