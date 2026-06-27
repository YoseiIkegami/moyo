# Moyo Agent Guide

## Core Philosophy

Moyo is a motion-first organic blob library. The shape is only the vessel; motion
is the product.

- Catalog base motions and optional layers, not named shapes.
- Do not add personality, usage, emotion, or semantic labels.
- Keep the core package `moyo` zero-dependency and framework-agnostic.
- Keep blobs in place: no `translate`, `top`, `left`, or layout movement.
- Keep the UI minimal; blank space is part of the design.
- Borrow the M3-style token structure: reference values -> system types -> props.

## Hybrid Renderer

Renderer selection is automatic:

- `complexity <= 5`: simple renderer, one `div`, CSS `border-radius` keyframes.
- `complexity >= 6`: complex renderer, generated SVG path frames and morphing.

Users should not pass a renderer prop. They choose `complexity` and `distortion`.

## Package Direction

- `moyo`: base motion data and blob path generation.
- `@moyo/vue`: Vue hybrid renderer.
- `@moyo/react`: out of scope for v0.2.

## Component API

```vue
<MoyoBlob
  base="wander"
  spin
  pulse
  color="#5436DA"
  :size="160"
  :speed="1"
  :complexity="8"
  :distortion="0.4"
/>
```

Expose only motion/building parameters: `base`, `color`, `size`, `speed`,
`complexity`, `distortion`, `spin`, `pulse`, `paused`, and deterministic `seed`.

Prefer the public prop name `base`, not `motion`, for the base motion selector.

## Builder UI

Use the five-area grid: `header`, intentionally blank `blank`, `shape`,
`motion`, and `preview`. Do not place controls inside the blank area.

## Non-Goals

- Multi-blob metaballs.
- `feTurbulence`.
- anime.js or other animation dependencies.
- Theme system.
- Meaning labels such as friendly, hero, avatar, empty state, or background.
