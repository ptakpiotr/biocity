# ADR: Isometric maps with PixiJS

- Status: Accepted
- Date: 2026-11-14

## Context

The original grid of similar houses and text buttons did not convey a city. Buildings must recognizably reflect their functions, and each cell must have its own appearance, architecture, terrain, and road layout. A palette change alone does not satisfy this requirement.

## Decision

Draw the map directly in PixiJS using isometric geometry. Separate projection and solids, layouts and surroundings, individual buildings, and scene management. The plant cell has gardens and canals, the animal cell is an oval metropolis, and the bacterial cell is a desert citadel. Objects and numbers on the map select questions; the HTML legend provides equivalent keyboard access.

React creates the scene, passes updates, and destroys it on unmount. The PixiJS ticker animates vehicles without updating React state on every frame. Support reduced motion and horizontal map scrolling on phones.

## Consequences

- Custom shapes and details distinguish the power station, factory, warehouse, and other buildings.
- Downloaded map images are unnecessary, but geometry and depth-sorting code must be maintained.
- The renderer requires explicit cleanup of resources and listeners. Graphics depend on browser capabilities.
- PixiJS increases application size. When graphics are unavailable, questions can still be selected from the legend.

Implementation: [src/pixi](../../src/pixi), [CityMap.tsx](../../src/components/CityMap.tsx).
