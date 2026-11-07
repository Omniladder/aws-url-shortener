# 05: Dashboard page (`frontend/pages/dashboard.js`)

`frontend/pages/dashboard.js` runs on `dashboard.html`. It loads the user's links, shows them in a table, and handles the copy, delete, and log out buttons. The table rows come from a `<template>` in `dashboard.html`. The script does not build HTML strings.

## The functions

### `showMyLinks()`

Runs when the page starts. It calls `listLinks` and passes the result to `renderLinks`.

### `renderLinks(links)`

Replaces the rows in the table with one row per link. With no links, it hides the table and shows the **Welcome!** message. Each short link is shown as the full address, such as `https://go.dustintobrien.com/r/Qw7mZ2`, using the host of the page the user is on.

### `copyText(button, text)`

Copies text to the clipboard. The button says **Copied!** for a moment. If the browser refuses, an alert shows the text so the user can copy it by hand.

### `logOutAndGoHome()`

Calls `logOut` from `frontend/services/auth.js`, then sends the user to the login page. The **Log out** button is turned off while this runs.

### Table clicks

One click handler on the table body handles every row button, because the rows are added later:

- **Copy URL** copies the original address. **Copy short link** copies the short link.
- **Delete** asks the user to confirm. If they confirm, it calls `deleteLink` and reloads the page. If the delete fails, an alert shows the error.

## Related

- [04: URLs service](04-urls-service.md), which the page uses to list and delete links.
- [03: Auth service](03-auth-service.md), which provides `logOut`.
- [Guide 03: Copy and delete links](../guides/03-copy-and-delete-links.md), which describes what the user sees.
