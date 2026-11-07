# docs: Project documentation

This folder holds every document about the project. Each subfolder has its own `CLAUDE.md` with details.

| Folder | What it holds | Guide |
|--------|---------------|-------|
| `arch/` | Architecture Decision Records: why the app is built the way it is | [arch/CLAUDE.md](arch/CLAUDE.md) |
| `ideation/` | Ideas, user flows, and workshop plans that are not decided yet | [ideation/CLAUDE.md](ideation/CLAUDE.md) |
| `guides/` | User guides for people who use the app | [guides/CLAUDE.md](guides/CLAUDE.md) |
| `design/` | Plain-language explanations of what each function does, for new developers | [design/README.md](design/README.md) |

## Which folder to use

- Explaining how to run or set up the project: `README.md` at the root.
- Recording a technical decision: `arch/`.
- Explaining how to use the app: `guides/`.
- Explaining what a function is for: `design/`, and the JSDoc comment above the function.
- Exploring an idea that is not decided yet: `ideation/`.

## Keeping design docs in step with the code

Every function in `frontend/` has a JSDoc comment. The design pages in `design/` describe the same functions in simpler words. When you change a function:

1. Update its JSDoc comment in the code.
2. Update its section in the matching `design/` page.
3. If the change affects what the user sees, update the matching guide in `guides/`.

Write for a new developer. Explain what a function is for and what it returns, not how each line works.
