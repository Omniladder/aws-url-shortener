# 02: Login page (`frontend/pages/login.js`)

The login form's HTML lives in `index.html`. `frontend/pages/login.js` holds the behavior for that form: what happens when the user presses **Log in**, and what messages appear. The page calls the auth service to sign in. It does not build any HTML.

## The flow in plain words

1. The user types an email and password and presses **Log in**.
2. The script checks that both boxes are filled in.
3. The buttons are turned off while the request runs.
4. If the request succeeds, the browser opens the dashboard.
5. If the request fails, the error message appears in the red box under the form.
6. The buttons are turned back on when the request finishes.

## The functions

### `showError(message)`

Shows a message in the red box under the form. An empty message hides the box.

### `setBusy(isBusy)`

Turns the buttons off while a request is running, so the user cannot send the same request twice. It also marks the form as busy for screen readers. Pass `true` to turn the buttons off and `false` to turn them back on.

### Submit handler

Runs when the user presses Enter or clicks **Log in**.

- It stops the browser from reloading the page.
- If the email or password is empty, it shows "Enter your email and password." and stops.
- Otherwise it clears the old error, turns the buttons off, and calls `logInOrRegister`.
- On success, it sends the user to `/dashboard.html`.
- If the call throws an error, the error message is shown.
- The buttons are always turned back on at the end, whether the sign-in worked or not.

## Related

- [01: Entry point](01-entry-point.md), which runs this script and the session check.
- [03: Auth service](03-auth-service.md), which handles the sign-in.
- [Guide 01: Register and log in](../guides/01-register-and-log-in.md), which describes what the user sees.
