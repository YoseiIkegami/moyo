# Moyo Agent Guide

## Core Philosophy

Moyo is a motion-first organic blob library. Shape is only the vessel; motion is
the product.

- Catalog base motions and motion parameters, not named shapes.
- Do not add personality, usage, emotion, or semantic labels.
- Keep the core package `@ikg-systems/moyo` zero-dependency and framework-agnostic.
- Keep blobs in place: no `translate`, `top`, `left`, or layout movement.
- Keep the UI minimal; every grid area should have a clear role.
- Borrow the M3-style token structure: reference values -> system types -> props.

## SVG Engine

Moyo uses SVG-only renderers:

- `viewBox="0 0 400 400"`.
- Path data generated from seeded point metadata.
- One `requestAnimationFrame` loop per Vue renderer component.
- `morphSpeed` drives path/radial breathing time.
- `spinSpeed` drives parent group rotation at `40deg/s * spinSpeed`.
- `paused` freezes accumulated time and resumes without a phase jump.

Do not reintroduce `pulse`, CSS `border-radius` rendering, or hybrid
simple/complex branching.

## Modes

- `MoyoBlob`: Single mode, one blob path.
- `MoyoCluster`: Cluster mode, multiple blob paths through an SVG gooey filter.

Cluster balls move radially in and out along fixed directions. They must not
orbit individually. Whole-cluster spin is a separate parent `<g>` rotation.

## Shape Generation

Engine constants:

```ts
blobEngineBounds = {
  viewBox: "0 0 400 400",
  cx: 200,
  cy: 200,
  baseR: 110,
  minR: 40,
  maxR: 175
};
```

Public shape axes:

- `edge`: inward notches and waists.
- `spike`: outward extensions.

`complexity` is a point count from `3` to `64`. Single point metadata rebuilds
only when `complexity` or `seed` changes. Cluster metadata rebuilds only when
`count`, `complexity`, or `seed` changes.

For Cluster performance, use `clusterPointCount(count, complexity)`:
`count > 10 ? cap 10 : cap 14`, then clamp `round(complexity * 0.6)` to `5..cap`.

Path generation uses Catmull-Rom to cubic Beziers with fixed `1/6` handles.
Always clamp generated radii to `[40, 175]`; spikes must never clip the SVG
viewport.

## Component API

```vue
<MoyoBlob
  base="wander"
  color="#5436DA"
  :size="160"
  :morph-speed="1"
  :spin-speed="0"
  :complexity="8"
  :edge="0.3"
  :spike="0.2"
  seed="demo"
/>

<MoyoCluster
  base="churn"
  color="#5436DA"
  :size="240"
  :morph-speed="1"
  :spin-speed="0.5"
  :count="6"
  :spread="0.6"
  seed="demo"
/>
```

Expose only motion/building parameters: `base`, `color`, `size`, `morphSpeed`,
`spinSpeed`, `reverse`, `complexity`, `edge`, `spike`, `paused`, deterministic
`seed`, and Cluster-only `count`/`spread`.

Prefer the public prop name `base`, not `motion`, for the base motion selector.

## Builder UI

Use the five-area grid: `header`, `setup`, `motion`, `shape`, and `preview`.
Rows are `56px / 116px / remaining` on desktop. `setup` is mode-only. `motion`
is for how the blob moves. `shape` is for numeric shape parameters plus color
and seed pinned to the bottom. `preview` is the result.

The Builder must expose Single/Cluster mode, seed display, and reseed. Copied Vue
snippets must include the current seed. Copy output is SVG-oriented; do not add
CSS `border-radius` snippets.

Color palette generation and color application are separate:

- Manual color picker input rebuilds the similar-color palette.
- Swatch click applies color only and must not rebuild the palette.

## Non-Goals

- `feTurbulence`.
- anime.js or other animation dependencies.
- Theme system.
- Meaning labels such as friendly, hero, avatar, empty state, or background.
