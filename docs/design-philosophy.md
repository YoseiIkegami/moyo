# Design Philosophy

Blob Studio is a small shape system for developers who want organic SVG forms
with the ergonomics of a UI component library.

## Principles

### MDI-like DX

The library should feel direct and predictable:

- Import the shape data or component you need.
- Use stable IDs instead of memorizing path strings.
- Keep configuration close to the rendered shape.
- Avoid runtime dependencies in the data layer.

### Hand-held Organic Forms

Shapes should feel soft enough to hold, but structured enough to use in product
interfaces. A Blob Studio shape can be playful, but it should not become noisy.

Good shapes usually have:

- A clear silhouette at small sizes.
- Gentle imbalance instead of random distortion.
- A simple `0 0 100 100` viewBox.
- Tags that describe use, mood, and geometry.

### Framework Friendly

The first component package targets Vue, but the data layer is framework-agnostic
by design. React and Svelte packages should wrap the same `@blob-studio/js` shape
records rather than fork the source data.

## Shape Selection

New shapes should earn their place by covering a distinct use case:

- UI base forms: `capsule`, `squircle`, `bubble`.
- Organic accents: `kidney`, `pebble`, `amoeba`, `bean`.
- Natural metaphors: `leaf`, `droplet`, `petal`, `manta`.
- Symbolic forms: `shield`, `orbit`, `softDiamond`.

If two shapes feel interchangeable in a card grid, keep the calmer one.

## API Direction

The MVP keeps the surface area intentionally small:

- `getShape(id)` for direct lookup.
- `listShapes()` for galleries and pickers.
- `searchShapes(tag)` for simple tag filtering.
- `BlobShape` for Vue rendering and animation demos.

Animation is decorative and opt-in. The shape data remains static so it can be
used in any renderer, build pipeline, or design export workflow.
