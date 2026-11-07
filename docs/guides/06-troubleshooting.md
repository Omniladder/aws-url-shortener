# 06: Troubleshooting

Common problems and what to do about them. If your problem is not here, ask the presenter and include the exact message on the screen.

## I forgot my password

Password reset is not part of this app (see [ADR 0019](../arch/0019-cognito-for-sign-in.md)). Log in with a different email address to create a new account.

## The dashboard is empty, but I made links before

Check that you are logged in with the same email address you used before. Each account sees only its own links.

If the dashboard shows **Welcome!** and your links do not appear, reload the page. See [03: Copy and delete links](03-copy-and-delete-links.md#when-the-list-does-not-load).

## A short link says "This short link does not exist"

The page shows **Link not found** and "This short link does not exist. Check the address and try again."

- The code may be mistyped. Copy the link again.
- The link may have been deleted by its owner.

## A copied link goes to the wrong place

Check the **Redirects to** column of the link on the dashboard. A short link always sends visitors to the address shown there. If that address is wrong, delete the link and create a new one. See [03: Copy and delete links](03-copy-and-delete-links.md).

## The Copy button says "Copied!" but nothing is on my clipboard

Your browser may block clipboard access. The app then shows an alert with the text. Select the text in the alert and copy it yourself.

## I see a red message under the login or create form

The message is written to tell you what to fix. Read it and follow the steps in the guide for that task:

- Login messages: [01: Register and log in](01-register-and-log-in.md#when-something-goes-wrong)
- Create messages: [02: Create a short link](02-create-a-short-link.md#when-something-goes-wrong)

## Delete failed, or the list does not load

If a delete fails, your browser shows an alert with the error message. Try again.

If the list does not load, the dashboard may show **Welcome!** instead of your links. Reload the page. If it still fails, check your internet connection and wait a minute. The database service may be down or still starting.

## Running the app on my own computer does not work

For problems running the app on your computer, see the setup steps in the [project README](../../README.md) and the troubleshooting section of [07: Set up the app from scratch](07-set-up-from-scratch.md#if-something-goes-wrong).
