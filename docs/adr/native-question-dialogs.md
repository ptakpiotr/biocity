# ADR: Questions in native dialogs

- Status: Accepted
- Date: 2026-11-14

## Context

A question should appear immediately after clicking a building, rather than below the map where scrolling would be required. The dialog must work on phones, support keyboard interaction, and allow players to return to the map without losing completion progress.

## Decision

Open questions in the native `dialog` element using `showModal()`. React stores the selected building identifier. Selecting the same number again closes the question; selecting a different number switches questions. Answer rendering and evaluation remain in the shared `Question` component, which is also used in the review quiz.

Provide close buttons, backdrop dismissal, Escape handling, focus restoration, and cleanup of the scroll lock. An open question stays above the map during fullscreen transitions.

## Consequences

- The browser's modal mechanism restricts background interaction without an additional dialog library.
- Focus and effect management remain the component's responsibility and require testing in a real browser.
- Closing a question clears the local selection of an incorrect answer; completion remains in Zustand.
- Dialog sizing and scrolling must accommodate small screens and longer questions.

Implementation: [QuestionDialog.tsx](../../src/components/QuestionDialog.tsx), [Question.tsx](../../src/components/Question.tsx), [CityPage.tsx](../../src/pages/CityPage.tsx).
