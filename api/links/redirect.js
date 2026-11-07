// api/links/redirect.js
// GET /r/{code}: sends the visitor on to the link's destination (ADR 0020).
// Anyone can call it, so there is no sign-in. The read asks only for originalUrl,
// so the owner and the dates are never read.
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { db, TABLE_NAME } from '../db.js';

// The "Link not found" page, returned by the API for unknown codes (ADR 0023).
// It is inline because this Lambda cannot read the built site files.
const NOT_FOUND_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Short Links</title>
    <style>
      body { font-family: system-ui, sans-serif; margin: 0; min-height: 100vh; display: grid; place-items: center; }
      main { max-width: 28rem; padding: 1rem; text-align: center; }
    </style>
  </head>
  <body>
    <main>
      <h1>Link not found</h1>
      <p>This short link does not exist. Check the address and try again.</p>
    </main>
  </body>
</html>`;

export async function handler(event) {
  const shortCode = event.pathParameters.code;

  const result = await db.send(new GetCommand({
    TableName: TABLE_NAME,
    Key: { shortCode },
    ProjectionExpression: 'originalUrl',
  }));

  // An unknown code gets the "Link not found" page directly, with a 404 status (ADR 0023).
  if (!result.Item) {
    return {
      statusCode: 404,
      headers: { 'content-type': 'text/html; charset=utf-8' },
      body: NOT_FOUND_HTML,
    };
  }

  return { statusCode: 302, headers: { location: result.Item.originalUrl }, body: '' };
}
