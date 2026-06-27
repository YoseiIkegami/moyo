# Moyo Philosophy

Moyo is not an illustration pack, SVG icon catalog, random blob generator, or
design system.

It is a tiny library for organic blobs that move in place.

## Motion-First

The catalog unit is motion, not shape.

Users choose a base motion such as `breathe`, `wander`, or `churn`, then tune
`morphSpeed` and `spinSpeed`. The visible shape is produced by motion over
seeded point metadata.

## Unopinionated

Moyo does not assign personality, usage, emotion, or semantic labels to motions.

No motion is documented as friendly, heroic, calm, empty-state-specific, or
background-specific. The product decides the context.

## In-Place Only

The blob may distort, breathe radially, and rotate.

It must not move position with `translate`, `top`, `left`, or layout animation.
Moyo is for loaders and decorative blobs that stay where they are placed.

## SVG-Only Lightness

Moyo uses SVG renderers in `viewBox="0 0 400 400"`.

There is no `border-radius` renderer, hybrid switch, or pulse layer in the active
design. Vue components own one `requestAnimationFrame` loop, update path `d`
values, and rotate an SVG group when `spinSpeed` is greater than zero.

## Modes

`Single` renders one blob path. `Cluster` renders multiple blob paths through an
SVG gooey filter so they fuse near the center and split as they breathe outward.

Cluster movement is radial breathing, not orbit. Each ball has a fixed direction
from the center; `spinSpeed` rotates the parent group as a separate layer.

## Shape Axes

Shape is controlled by two independent public axes:

- `edge`: inward pulls for notches and waists.
- `spike`: outward extensions.

Generated radii are clamped inside `minR=40` and `maxR=175` around `cx=200` and
`cy=200`. Spikes should never clip at the edge of the canvas.

## Seed Rules

`complexity` and `seed` define Single point metadata. In Cluster mode, `count`,
`complexity`, and `seed` define the ball metadata. Changing motion, speeds, edge,
spike, or spread changes how the same metadata is rendered, but does not reseed
the object.

The Builder UI should expose a visible seed and a reseed action. Copied Vue code
must include the current seed so the result is reproducible.

## Minimal

Do not decorate around the blob unless the product needs it.

The Builder UI gives every grid area a job: `setup` chooses the mode, `motion`
controls movement, `shape` holds shape parameters plus color and seed, and
`preview` shows the result. The screen should make the blob color stand out
instead of competing with it through panels, gradients, or decorative copy.

When UI color follows the blob color, derived tokens must preserve readability:
primary-filled controls need a readable `on-primary`, visible button ring, and a
preview background that prevents white or black blobs from disappearing.

Color palette generation is intentionally split from color application. Manual
picker changes rebuild similar-color swatches; swatch clicks only apply a color
so the palette stays stable.

## M3 Borrow

Moyo borrows structure, not visuals, from Material 3 motion guidance:

- Reference token: engine constants and generated point metadata.
- System token: `MotionData`, `BlobPoint`, `ClusterBall`, and path generation APIs.
- Component token: `MoyoBlob` and `MoyoCluster` props.

The component receives motion parameters. It does not own the concrete motion
tokens.

## Non-Goals

- React package in the current MVP.
- `feTurbulence` noise animation.
- Theme system.
- Personality, usage, or emotion metadata.
