# ADR: Map tabs and keyboard shortcuts

- Status: Accepted
- Date: 2026-11-14

## Context

Switching between the three cell types must be available at the top of the screen. Shortcuts have been agreed for fullscreen, questions, and cell navigation. At the same time, entering a team name and navigating a dialog must preserve normal keyboard behavior.

## Decision

Switch cells using tabs connected to React Router routes. Tabs have ARIA roles, selection state, and support for the arrow keys, Home, and End.

Register shortcuts through TanStack Hotkeys only while the map view is mounted. `F` toggles fullscreen, `1-9` open or close their assigned questions, and numbers without a question are ignored. `Tab` and `Shift+Tab` retain normal focus navigation throughout the page. The arrow keys, Home, and End handle cell selection when focus is on the tabs.

When the Fullscreen API rejects a request, the map fills the browser window. In this mode, mark background controls as `inert` and restore their previous state on exit.

## Consequences

- Mouse and keyboard interactions lead to the same questions and progress.
- The code review on 2026-11-14 removed the original interception of Tab because it prevented keyboard access to the legend and other page buttons.
- Native fullscreen depends on browser support and user activation. The window-filling fallback does not hide the browser interface.
- Shortcuts and transitions require tests for switching, held keys, and cleanup after changing views.

Implementation: [CityTabs.tsx](../../src/components/CityTabs.tsx), [CityPage.tsx](../../src/pages/CityPage.tsx), [CityMap.tsx](../../src/components/CityMap.tsx).
