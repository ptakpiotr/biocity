# ADR: A readable interface for 11-year-olds

- Status: Accepted
- Date: 2026-11-14

## Context

The game is intended for children around 11 years old. The user rejected identical objects, decorative slogans, gradients, and city names unrelated to biology. Additional descriptions without functionality took up space needed by the map. Question and answer content must remain unchanged.

## Decision

Use the Polish labels “Komórka roślinna” (“Plant cell”), “Komórka zwierzęca” (“Animal cell”), and “Komórka bakteryjna” (“Bacterial cell”), short instructions, and clear numbers and buttons. Remove the cell comparison section and decorative header. Retain distinct styles for the three maps, based on solid colors without gradients.

Import Roboto through the official Google Fonts CSS API, with a local fallback font. Use React Icons; the bacterium has a custom SVG showing a rod-shaped cell with a flagellum. The favicon is a simple DNA SVG matching the symbol beside the BioCity name.

## Consequences

- More space is devoted to the map, questions, and functional controls, with labels that refer to biology.
- Maps are distinguished by buildings and surroundings as well as color.
- Downloading Roboto requires a connection to Google Fonts. Without it, the application uses a fallback font; questions and maps remain local.
- Readability for the target audience requires further observation while children use the game; technical tests alone cannot establish it.

Implementation: [pl.json](../../src/i18n/locales/pl.json), [app.css](../../src/styles/app.css), [AppIcon.tsx](../../src/components/AppIcon.tsx), [favicon.svg](../../public/favicon.svg).
