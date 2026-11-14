# ADR: Business logic tests with Vitest

- Status: Accepted
- Date: 2026-11-14

## Context

The previous strategy used the `node:test` runner, dynamic TypeScript loading through VM modules, and Chrome tests driven through the Chrome DevTools Protocol. The user requested removing those tests and replacing them with business logic tests in Vitest.

Rules for cell completion, review question selection, content independence, team validation, and progress preservation can be verified without rendering the interface. The configuration should support TypeScript and the same aliases as the application.

## Decision

Use Vitest in a Node environment with TypeScript tests in `tests/*.test.ts`. The test configuration shares the Vite configuration. `npm test` runs tests once, `npm run test:watch` watches for changes, and `npm run test:typecheck` checks types.

Test the real domain functions, Zustand store actions, and persist middleware. For persistence scenarios, substitute an in-memory localStorage backend without mocking game rules or middleware. Progress calculation and selection of the next review question use shared functions that are also called by the interface.

Remove the previous tests and browser scripts. The build and linter remain separate checks.

## Consequences

- Tests do not need Chrome, a server port, browser profiles, or experimental VM module flags.
- Regressions involving shared question content, duplicate completions, resets, and lost team details can be tested directly against data.
- Tests do not verify PixiJS rendering, native IndexedDB, focus, or the Fullscreen API. Those areas require manual checks or a separate future integration testing strategy.
- Vitest is a development dependency and is not imported by the production application.

Supersedes: [Verifying logic and behavior in a real browser](browser-and-domain-tests.md).

Implementation: [tests](../../tests), [vitest.config.ts](../../vitest.config.ts), [progress.ts](../../src/lib/progress.ts), [package.json](../../package.json).
