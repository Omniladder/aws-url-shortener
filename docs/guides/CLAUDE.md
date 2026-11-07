# docs/guides: User guides

This folder holds the user guides for the Short Links app. Students and workshop attendees read them to learn how to use the app. The guides are linked from the root `README.md`.

Guides are for people who use the app, not for people who build it. Setup, running the app, and deployment belong in `README.md`. Design choices belong in `docs/arch/`. Ideas that are not built belong in `docs/ideation/`.

## Files

- `README.md` is the index. Add a row to its table when you add a guide.
- Numbered guides (`01-...`, `02-...`) cover one task each. Keep the existing order. Add new guides at the end, with the next number.
- `06-troubleshooting.md` collects common problems. Add a short entry when a problem keeps coming up.

Use the same naming as `docs/ideation/`: a two-digit number and a short kebab-case title, such as `07-short-title.md`.

## Source of truth

Write each guide from the app's real behavior, not from memory.

1. Read the matching flow in [`docs/ideation/02-user-flows.md`](../ideation/02-user-flows.md). The flow lists the steps, loading states, and errors.
2. Read the code that does the work: the page's script in `frontend/pages/`, and the service in `frontend/services/` if one exists.
3. Use the exact text on the screen for button labels and error messages. Copy it from the code, and put it in quotes or bold.
4. If the code and the flow disagree, follow the code, and tell the user about the difference. Do not guess which one is right.

## Status line

Every guide starts with a status line directly under the title:

- `> **Status:** Built.` when the feature works in the app.
- `> **Status:** Not built yet. The steps describe the planned ...` when it does not.
- `> **Status:** Login page is built. ...` for a guide that is partly built.

When you build a feature, update the status line of every guide that covers it, and remove the "Not built yet" wording from the steps if it no longer applies.

## Writing style

- Write for a beginner. Use short sentences and plain words.
- Number the steps of every task. Start each step with the action: "Click", "Type", "Open".
- Name the screen element the way the app labels it: **Add URL**, **Copy**, **Log out**.
- Explain a term the first time it appears. Short link is defined in guide 02.
- Do not explain code, database tables, or cloud setup in a guide. Link to the README or an ADR instead.
- Use a short "When something goes wrong" section for errors the user can see. Quote the exact message.
- Keep each guide to one page. If a guide grows past that, split it into two guides.
- Do not include secrets, real keys, or real user emails in examples. Use `go.dustintobrien.com` and `you@example.com`.

## When to update the guides

Update the guides in the same change as the code they describe when:

- a button, label, field, or message changes,
- a page is added, removed, or moved to a different route,
- a step in the flow changes, or the app asks for something new,
- a feature is built (update its status line),
- a feature is removed or moved out of scope under [ADR 0008](../arch/0008-scope-limited-to-core-crud.md).

Do not add guides for features that are out of scope.

## Links

- Link to other guides with relative paths, such as `[02: Create a short link](02-create-a-short-link.md)`.
- Link to the README for setup, and to ADRs for reasons. Do not copy their content.
- Every guide that mentions a term defined elsewhere should link to where it is defined.

## Checklist before you finish a guide change

- [ ] The status line matches what the app does today.
- [ ] Button labels and error messages match the code exactly.
- [ ] Every step is numbered and starts with an action.
- [ ] The guide is listed in `docs/guides/README.md`.
- [ ] Links point to files that exist.
- [ ] No keys, passwords, or real emails appear in the text.
