# ADR: Local team and progress storage

- Status: Accepted
- Date: 2026-11-14

## Context

On first launch, children enter a team name and choose one of four React Icons. The team must appear in the upper-right corner and persist with progress after a reload. Changing the name or icon must not delete answers. Resetting progress must preserve the team.

## Decision

Store the team, cell completions, review progress, and last route in a single Zustand persist state under the localStorage key `biocity-progress-v2`. Team editing and answer reset actions update only their respective fields.

When loading data, validate its structure, the trimmed name and its 32-character limit, and an icon from the fixed set: rocket, cat, flame, or turtle. Older saves without a team retain progress and open the welcome form. Render the name as React text.

## Consequences

- Returning to the game does not require an account or sending the team name to a server.
- The team form and header respond to the same state, and a single mechanism validates saved data.
- Team details and results belong to a particular browser and application origin; they are not synchronized between devices.
- Clearing browser data deletes the save. localStorage can be edited manually, so it is not suitable for a trustworthy competitive leaderboard.

Implementation: [progressStore.ts](../../src/store/progressStore.ts), [progressPersistence.ts](../../src/lib/progressPersistence.ts), [TeamSetup.tsx](../../src/components/TeamSetup.tsx).
