# 02: Create a short link

> **Status:** Built.

A short link is a second address that sends visitors to a long web address. You create one by giving the app a name and the long address.

## Steps

1. On the dashboard, click **+ Create new**. The page **Create a short link** opens.
2. Click in the **Name** box and type a name, for example `Workshop slides`. The name is required. It is a label that helps you find the link on the dashboard.
3. Click in the **Destination URL** box and paste or type the address. It must start with `http://` or `https://`, for example `https://example.com/a-very-long-page-name`.
4. Click **Create short link**. The button is greyed out while the app saves.
5. The dashboard opens, and your new link is at the top of the table. To copy it, see [03: Copy and delete links](03-copy-and-delete-links.md).

To leave without saving, click **Cancel**. The dashboard opens.

## What the short link looks like

The short link has your app's address followed by `/r/` and a short code, for example `https://go.dustintobrien.com/r/Qw7mZ2`. The code is 6 random letters and digits, so each link is different even when two people shorten the same address.

## When something goes wrong

The message appears in a red box under the form. Your typed text stays in the boxes, so you can fix it and click **Create short link** again.

- **"Enter a name for the link."** The **Name** box is empty. Type a name.
- **"Enter the URL the short link should go to."** The **Destination URL** box is empty. Paste an address.
- **"Enter a full web address that starts with http:// or https://."** The address is missing its start, or it is not a web address. Check the text and try again.
- **"Could not make a free short code. Try again."** The app tried five random codes and each one was already taken. Click **Create short link** again.
- **"Log in first."** Your session has ended. Log in again, then create the link.
- **Any other message in red.** The API returned it. Read it and try again.

## Next steps

- Copy and delete links: [03: Copy and delete links](03-copy-and-delete-links.md)
- Test the link: [04: Visit a short link](04-visit-a-short-link.md)
