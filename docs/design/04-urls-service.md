# 04: URLs service (`frontend/services/urls.js`)

`frontend/services/urls.js` is the only code that calls the links API. The pages do not call the API themselves. They call the functions in this file. The API does the real work and the access checks, in the Lambda files under `api/links/` ([ADR 0017](../arch/0017-api-gateway-with-one-lambda-per-route.md)).

## The functions

### `callApi(path, options)` (inside the file, not exported)

Sends a request to the API with the signed-in user's ID token in the `Authorization` header. If there is no token, it throws "Log in first." If the API answers with an error, it throws the `error` message from the JSON body, or a general message when there is none.

### `createLink(name, originalUrl)`

Saves a new short link for the signed-in user. It sends a `POST /api/links` request. The API makes the random short code, checks the name and the address, and saves the link. Returns the new link, with `name`, `short_code`, and `original_url`.

The API does not save a link without a name, and it refuses an address that does not start with `http://` or `https://`. See [ADR 0018](../arch/0018-store-links-in-dynamodb.md).

### `listLinks()`

Returns the signed-in user's links, newest first. It sends `GET /api/links`. If nobody is logged in, it returns an empty list without calling the API, so the dashboard shows its welcome message.

### `deleteLink(shortCode)`

Deletes one of the signed-in user's links. It sends `DELETE /api/links/{shortCode}`. The API deletes the link only when the user owns it. For any other link it answers "Link not found." ([ADR 0018](../arch/0018-store-links-in-dynamodb.md)).

### Visiting a short link

Visiting `/r/{code}` does not use this file. The API redirects the browser to the original address, or returns the "Link not found" page for an unknown code. No sign-in is needed ([ADR 0020](../arch/0020-redirect-short-links-in-lambda.md), [ADR 0023](../arch/0023-return-not-found-page-from-redirect-lambda.md)).

## Related

- [03: Auth service](03-auth-service.md), which provides the ID token.
- [05: Dashboard page](05-dashboard-page.md) and [06: Create page](06-create-page.md), which call these functions.
