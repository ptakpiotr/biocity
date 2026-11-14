# ADR: Independent questions for each cell

- Status: Accepted
- Date: 2026-11-14

## Context

The same structure appears in several cell types, but its questions and answers must be independent. A key based only on the building would cause content or completions to be shared. Legacy IndexedDB data also exists and must not be deleted by the migration.

## Decision

Identify a question with a `questionId` in the form `cityId:buildingId`. Store building definitions and initial question content in separate JSON files. IndexedDB, managed through Dexie, has a `cityPlaces` table keyed by `questionId`, with a unique `[cityId+id]` index.

The v1 → v2 migration copies legacy content into independent records and preserves the old table. Initialization adds missing records without overwriting existing ones. The review quiz stores and counts completions by `questionId`. The application does not provide a content editor; initial questions are maintained in the repository.

## Consequences

- Questions about the same structure in different cells do not affect one another.
- Changing the seed JSON does not automatically update existing browser content; distributing those changes requires an explicit migration.
- Dexie `liveQuery` and a shared `useSyncExternalStore` subscription update the interface when data changes.
- Renaming a building identifier requires accounting for saved questions and progress.

Implementation: [questions.ts](../../src/data/questions.ts), [database.ts](../../src/lib/database.ts), [placesStore.ts](../../src/store/placesStore.ts).
