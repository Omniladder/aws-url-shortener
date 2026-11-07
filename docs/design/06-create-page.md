# 06: Create page (`frontend/pages/create.js`)

`frontend/pages/create.js` runs on `create.html`. It checks the name and the address the user types, saves the link, and then opens the dashboard.

## The functions

### `showError(message)`

Shows a message in the red box under the form. An empty message hides the box.

### `setBusy(isBusy)`

Turns the buttons off while the save runs, so the user cannot send the form twice.

### `isWebAddress(text)`

Returns `true` when the text is an address that starts with `http://` or `https://`.

### Submit handler

Runs when the form is sent.

- It stops the browser from reloading the page.
- If the **Name** box is empty, it shows "Enter a name for the link." and stops.
- If the **Destination URL** box is empty, it shows "Enter the URL the short link should go to." and stops.
- If the address is not a web address, it shows "Enter a full web address that starts with http:// or https://." and stops.
- Otherwise it calls `createLink` from `frontend/services/urls.js`. On success, it opens `/dashboard.html`. If the save fails, the error is shown under the form and the typed text stays in the boxes.

## Related

- [04: URLs service](04-urls-service.md), which saves the link.
- [Guide 02: Create a short link](../guides/02-create-a-short-link.md), which describes what the user sees.
