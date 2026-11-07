// api/links/list.js
// GET /api/links: returns the signed-in user's links, newest first (ADR 0018).
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { db, TABLE_NAME } from '../db.js';
import { json, userIdFrom } from '../http.js';
import { toLink } from './to-link.js';

export async function handler(event) {
  const userId = userIdFrom(event);

  // Reads only this user's rows, through the byUser index. The sort key is createdAt, so newest comes last; reverse it.
  const result = await db.send(new QueryCommand({
    TableName: TABLE_NAME,
    IndexName: 'byUser',
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: { ':userId': userId },
    ScanIndexForward: false,
  }));

  return json(200, result.Items.map(toLink));
}
