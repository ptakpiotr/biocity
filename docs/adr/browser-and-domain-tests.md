# ADR: Verifying logic and behavior in a real browser

- Status: Superseded by [Business logic tests with Vitest](business-logic-tests-vitest.md)
- Date: 2026-11-14

## Context

Historical note: this strategy was replaced at the user's request. The Chrome/CDP scripts and `node:test` tests were removed; the linked Vitest ADR describes the current choice.

The game combines React state, IndexedDB, localStorage, native dialogs, and PixiJS graphics. Tests of individual functions do not detect problems with focus, selecting buildings on the canvas, database migrations, or fullscreen transitions.

## Decision

Use the `node:test` runner to verify logic and subscriptions, and headless Chrome controlled through the Chrome DevTools Protocol to verify integration. Browser tests use separate temporary profiles and a local Vite server. They cover maps, canvas selection, dialogs, teams, progress persistence, IndexedDB migrations, shortcuts, and small screens. The TypeScript/Vite build and oxlint remain separate checks.

Screenshots are generated test output rather than application assets; the `artifacts/maps` directory is ignored by the repository.

## Consequences

- Tests use the browser's real IndexedDB implementation, renderer, and focus behavior.
- The scripts assume the standard Chrome installation path on Windows and a specific server port. Running them on another system requires adjusting the path.
- Test profiles do not modify data in the user's regular browser profile.
- Native fullscreen may be rejected in headless mode; tests then cover the window-filling fallback. Phone emulation does not replace testing on a physical device.

Implementation: [tests](../../tests), [package.json](../../package.json).
