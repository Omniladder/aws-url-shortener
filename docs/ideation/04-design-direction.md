# 04: Design direction

The interface should look like a clean, minimal SaaS tool. Attendees should be able to focus on how the pieces connect, not on visual effects.

## Principles

- **Neutral background.** White or very light gray, with dark text.
- **Simple navigation.** One header with the app name, the main page link, and Log out. No menus.
- **Clear typography.** One sans-serif font from the system stack. Two or three text sizes.
- **One accent color.** Used for primary buttons, links, and the copy confirmation. Nothing else is colored.
- **Responsive layout.** The URL list stacks into cards on narrow screens. The forms fill the width on mobile.
- **Clean URL listing.** A table on wide screens with columns for original URL, short URL, date, and actions.
- **Minimal animation.** Only a short fade or color change on button states. No page transitions.

## States every screen needs

| State | What the user sees |
|-------|--------------------|
| Loading | Text or a small spinner. Buttons disabled. |
| Empty | A short message and a call to action. |
| Success | A confirmation message, such as "Link created" or "Copied". |
| Error | A readable message near the cause, with a way to retry when it makes sense. |

## Screens

The first version is built with these screens. Where it differs from the first plan, the built version is noted.

- **Login:** a centered card with email, password, and one **Log in** button. Logging in also creates an account for a new email. Error text appears under the form. (The plan had a separate **Register** button. It was dropped, because one form covers both.)
- **Dashboard:** page title, **+ Create new** button at the top right, and the list of links. The table shows Name, Redirects to, and Short link, with the actions on each row. (The plan had a date column. It is not built.)
- **Create:** a form with a **Name** box, a **Destination URL** box, and a **Create short link** button. After a save, the app opens the dashboard. (The plan had a result card. It is not built, because the new link appears in the table.)
- **Redirect error:** a centered "Link not found" message. The API returns it for an unknown code (see [ADR 0023](../arch/0023-return-not-found-page-from-redirect-lambda.md)).

## Out of scope for design

- Dark mode.
- Custom themes or brand colors.
- Icons beyond what is needed for copy and delete (text labels are fine).
