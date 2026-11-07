# 01: Product overview

## The idea

A small web app where a signed-in user pastes a long URL and gets a short link they can copy and share. Anyone with the short link is sent to the original address.

## Why it fits a workshop

URL shortening is easy to understand. Every attendee knows what a short link is, so the focus can stay on how the parts work together:

- a browser loads a page,
- the page signs the user in,
- the page saves and reads data through an API,
- a visit to a short link triggers an HTTP redirect.

## Who it is for

- **Primary:** workshop attendees who are new to cloud services.
- **Secondary:** the presenter, who needs a demo that runs in a few minutes and can be read line by line.

## What success looks like

- An attendee can create a link, copy it, open it in a new tab, and see the redirect work, all within the first session.
- An attendee can point to the file that handles each step (sign-up, insert, select, redirect) and say what it does.
- The app is deployed to AWS with CDK during the workshop, so attendees see every resource the app uses, from the table to the API.

## Out of scope

See [ADR 0008](../arch/0008-scope-limited-to-core-crud.md) for the decision and [05-future-ideas.md](05-future-ideas.md) for the features that were considered and parked.
