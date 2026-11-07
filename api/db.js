// api/db.js
// The one DynamoDB client (ADR 0018). The table name comes from the TABLE_NAME
// environment variable, which the stack sets on each function.
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export const TABLE_NAME = process.env.TABLE_NAME;
export const db = DynamoDBDocumentClient.from(new DynamoDBClient({}));
