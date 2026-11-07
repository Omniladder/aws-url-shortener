# 02: User flows

Each flow lists what the user does, what the app does, and what the user sees. Error and loading states are part of each flow, not an afterthought.

## Flow 1: Register and log in

1. User opens `/` and enters an email and password.
2. User clicks **Log in**. A new email creates an account on the same click (see [ADR 0019](../arch/0019-cognito-for-sign-in.md)).
3. App calls Cognito through Amplify.
4. On success, the app opens `/dashboard`.
5. On failure, the app shows the message from Cognito (for example, "That password is wrong for this email.") next to the form.

**Loading:** the submit button is disabled and shows a spinner while the request runs.

**Returning visitor:** if a session already exists, `/` redirects straight to `/dashboard`.

## Flow 2: See my links

1. User opens `/dashboard`.
2. App calls `GET /api/links` with the user's ID token.
3. API Gateway checks the token. The Lambda reads only that user's links, newest first (see [ADR 0018](../arch/0018-store-links-in-dynamodb.md)).
4. Each row shows the name, the original URL, and the short URL.

**Loading:** a skeleton row or "Loading your links..." message.
**Empty:** "Welcome!" with a button to make the first link.
**Error:** a message with a retry button.

## Flow 3: Create a short link

1. User clicks **+ Create new** and opens `/create.html`.
2. User enters a name and a destination URL. The page checks that the URL starts with `http://` or `https://`.
3. App calls `POST /api/links`. The Lambda checks the name and the URL, makes a 6-character random short code, and writes the row. A code that is already used is refused, and the Lambda tries again, up to five times (see [ADR 0005](../arch/0005-random-short-codes-with-unique-constraint.md) and [ADR 0018](../arch/0018-store-links-in-dynamodb.md)).
4. App opens the dashboard, where the new link appears with its short URL.

**Loading:** the button is disabled while saving.
**Error:** invalid input is shown in the red box under the form. A failed save shows the message and keeps the typed text.

## Flow 4: Copy a short link

1. User clicks **Copy short link** (or **Copy URL** for the original address) on a row in the dashboard.
2. App writes that text to the clipboard.
3. Button text changes to **Copied!** for a short time, then returns to its label.

**Error:** if the clipboard is blocked, an alert shows the text so the user can copy it by hand.

## Flow 5: Delete a link

1. User clicks **Delete** on a row.
2. App asks for confirmation.
3. On confirm, the app calls `DELETE /api/links/{shortCode}`. The Lambda deletes the row only if the signed-in user owns it. Another user's code gets "Link not found" (see [ADR 0018](../arch/0018-store-links-in-dynamodb.md)).
4. The page reloads and the row is gone.

## Flow 6: Visit a short link

1. Anyone opens `/r/:code`, signed in or not.
2. API Gateway sends the request to the redirect Lambda, which reads only the destination (see [ADR 0020](../arch/0020-redirect-short-links-in-lambda.md)).
3. If found, the browser gets a `302` and goes to the original URL.
4. If not found, the API returns the "Link not found" page with status `404` (see [ADR 0023](../arch/0023-return-not-found-page-from-redirect-lambda.md)).

The redirect happens in the API, so the app's pages never load for a short link.

## Flow 7: Log out

1. User clicks **Log out** in the header.
2. App ends the Cognito session in this browser.
3. User lands on `/`.
4. If the user presses Back to the dashboard, it shows no links, because there is no session.
