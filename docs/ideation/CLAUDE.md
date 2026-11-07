# docs/ideation: Ideas and planning

This folder holds planning notes for the project: product ideas, user flows, workshop plans, design direction, and features that are parked. Nothing here is a commitment. Decisions that are final belong in `docs/arch/` as ADRs.

## When to write an ideation doc

Write or update a doc here when:

- you want to explore an idea before deciding on it,
- you are describing how a user moves through the app (a flow),
- you are planning the workshop (order, objectives, demos, prerequisites),
- you are collecting features or improvements that are out of scope for now.

## When to move content to an ADR

Move an idea to `docs/arch/` as an ADR once the group decides to build it. Then:

1. Write the ADR, following `docs/arch/CLAUDE.md`.
2. In the ideation doc, link to the ADR and mark the idea as decided. Do not delete the idea, so the reasoning stays visible.

Do not write an ADR for an idea that is still being debated.

## When to read these docs

- Before starting a new feature, check `05-future-ideas.md` to see whether it was already discussed and parked.
- Before changing a user flow, read `02-user-flows.md`. Keep the flow and the code consistent.
- Before a workshop, read `03-workshop-plan.md` and its presenter checklist.

## Naming

- Use a two-digit number and a short kebab-case title: `06-short-title.md`.
- Keep `01` to `05` in their current order. Add new docs at the end.
- Write in plain language. Use tables for comparisons and short lists for steps.

## Keeping docs current

- When a decision in an ideation doc changes, update the doc in the same change as the code it affects.
- Remove a parked idea only when it has been built (link to its ADR) or the group has agreed to drop it.
