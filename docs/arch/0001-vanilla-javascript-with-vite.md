# ADR 0001: Use vanilla JavaScript with Vite

- **Status:** Accepted
- **Date:** 2026-11-06

## Context

This project is a teaching example for an introductory cloud computing workshop. Attendees need to read the code and see how the browser, the API, and the database connect. The project also has a short hackathon timeline.

A frontend framework (React, Vue, Svelte) adds concepts such as components, state management, and build-time transforms. Those concepts would compete with the workshop's focus on cloud services.

## Decision

Build the frontend with plain HTML, CSS, and JavaScript modules. Use Vite for the development server and production build. Use npm for package management.

## Consequences

- Attendees can trace a page load from `index.html` through `main.js` to a Supabase call without learning a framework.
- Vite gives hot reload and a production build with almost no configuration.
- Page rendering is done by hand (template strings and DOM APIs). This is more code per page than a framework would need, so the page files must stay small and readable.
- Switching to a framework later would mean rewriting the page modules.
