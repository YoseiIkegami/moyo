# Moyo Philosophy

Moyo is not an illustration pack, SVG icon catalog, random blob generator, or
design system.

It is a tiny library for one organic blob that moves in place.

## Motion-First

The catalog unit is motion, not shape.

Users choose a base motion such as `breathe`, `wander`, or `churn`, then may add
layers such as `spin` or `pulse`. The visible shape is produced by motion.

## Unopinionated

Moyo does not assign personality, usage, emotion, or semantic labels to motions.

No motion is documented as friendly, heroic, calm, empty-state-specific, or
background-specific. The product decides the context.

## In-Place Only

The blob may distort, rotate, or scale.

It must not move position with `translate`, `top`, `left`, or layout animation.
Moyo is for loaders and decorative blobs that stay where they are placed.

## Hybrid Lightness

Moyo chooses the lightest renderer that can express the requested complexity.

- `complexity` 3 to 5: a single `div` with CSS `border-radius` keyframes.
- `complexity` 6 to 12: generated SVG path frames with dependency-free morphing.

Users do not need to know which renderer is active. The same `MoyoBlob` props
drive both.

## Minimal

Do not decorate around the blob unless the product needs it.

The Builder UI keeps one reserved blank area on purpose. The screen should make
the blob color stand out instead of competing with it through panels, gradients,
or decorative copy.

## M3 Borrow

Moyo borrows structure, not visuals, from Material 3 motion guidance:

- Reference token: radius strings and generated path points.
- System token: `MotionData` and path generation APIs.
- Component token: `MoyoBlob` props.

The component receives motion parameters. It does not own the concrete motion
tokens.

## Non-Goals

- Metaball or multi-blob animation.
- React package in v0.2.
- `feTurbulence` noise animation.
- Theme system.
- Personality, usage, or emotion metadata.
