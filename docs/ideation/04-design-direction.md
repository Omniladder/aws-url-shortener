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

- **Login:** a centered card with email, password, and two buttons (Log in, Register). Error text appears under the form.
- **Dashboard:** page title, Add URL button at the top right, and the list of links.
- **Create:** a single input with a Save button. The result card shows the short URL and a Copy button.
- **Redirect error:** a centered message with a link back to the home page.

## Out of scope for design

- Dark mode.
- Custom themes or brand colors.
- Icons beyond what is needed for copy and delete (text labels are fine).
