# 04: URLs service (`frontend/services/urls.js`)

`frontend/services/urls.js` is the only code that saves short links. The create page does not call the API itself. It calls the one function in this file.

## The functions

### `createLink(name, originalUrl)`

Saves a new short link for the signed-in user. The database fills in the owner.

The function makes a random short code, such as `k3Xp9aQ`, and tries to save the row. If that code is already used, the database refuses the save. The function then makes a new code and tries again, up to five times. Only the database can say for sure that a code is unused, which is why the check happens there. See [ADR 0005](../arch/0005-random-short-codes-with-unique-constraint.md).

The name is required, and the database refuses a link without one. The function returns the new row.

### `listLinks()`

The API only returns rows that belong to the signed-in user, checked against the Cognito ID token (see [ADR 0018](../arch/0018-store-links-in-dynamodb.md)).

### `getOriginalUrl(code)`

Looks up where a short code redirects. It works without signing in, because the database gives anonymous visitors one narrow lookup and nothing else. It returns the address, or `null` when no link has that code. See [ADR 0006](../arch/0006-public-redirect-lookup-without-private-data.md).

### `makeShortCode()` (inside the file, not exported)

Makes the random code from letters and digits, seven characters long.

## Related

- [03: Auth service](03-auth-service.md), which handles the sign-in the link belongs to.
- [ADR 0018](../arch/0018-store-links-in-dynamodb.md) and [ADR 0010](../arch/0010-add-name-to-urls.md), which describe the stored link and its name.
