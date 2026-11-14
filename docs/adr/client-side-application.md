# ADR: Client-side application with React and TypeScript

- Status: Accepted
- Date: 2026-11-14

## Context

BioCity is an educational game with three cell maps, questions, and local team progress. The agreed scope does not require accounts, an application server, or sharing results between devices. The interface must respond to building selection, answers, team changes, and navigation without reloading the page.

Implementation assumption: the application can be deployed to static hosting without route rewrite rules. The target hosting configuration has not been decided; hash routing was not a separate user requirement.

## Decision

Use React and TypeScript, with Vite handling local development and builds. Routing uses `HashRouter`, with direct URLs for cells and the review quiz. React handles the interface, forms, and dialogs; the map renderer has a separate lifecycle. Domain types are defined in `src/Types.ts`.

Do not retain Chakra UI or `@pixi/react`, because the implementation uses custom CSS, native dialogs, and the PixiJS API directly.

## Consequences

- The application can be served as static files without configuring route redirects.
- TypeScript and shared types help keep data and components consistent.
- The URL fragment remains visible in routes. Moving to routing handled by the server requires a separate decision.
- An alternative is `BrowserRouter` with clean URLs and a hosting fallback to `index.html`. Choosing it does not require changes to the question or progress model.
- Data is local to the browser. Accounts, synchronization, and server-side result validation remain outside the current scope.

Implementation: [App.tsx](../../src/App.tsx), [AppRoutes.tsx](../../src/AppRoutes.tsx), [vite.config.ts](../../vite.config.ts).
