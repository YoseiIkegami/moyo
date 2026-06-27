# Moyo

Organic loading blobs for Vue and React.

Moyo is motion-first: one abstract blob, many in-place motions. Simple blobs use
CSS `border-radius`; complex blobs use generated SVG paths and dependency-free
path interpolation.

```vue
<script setup lang="ts">
import { MoyoBlob } from "@moyo/vue";
</script>

<template>
  <MoyoBlob base="wander" color="#5436DA" :size="160" :complexity="8" />
</template>
```

## Packages

- `moyo`: framework-agnostic motion data and blob path generation.
- `@moyo/vue`: Vue component with hybrid rendering.
- `demo`: minimal five-area Builder UI with live preview and copy outputs.

React is part of the product direction, but `@moyo/react` is out of scope for
v0.2.

## Install

```bash
pnpm add moyo @moyo/vue
```

## Hybrid Renderer

Moyo switches renderer automatically from `complexity`.

- `3-5`: simple renderer, a single `div` with CSS `border-radius` animation.
- `6-12`: complex renderer, generated SVG path frames with morphing.

Users do not choose the renderer directly.

## Builder UI

The demo is a focused builder for tuning the blob without changing its meaning.

- `shape`: color, size, complexity, and distortion.
- `motion`: base motion, spin, pulse, speed, and pause.
- `preview`: the live blob, with `Copy Vue` and `Copy CSS/SVG` outputs.

On desktop, the UI uses a fixed five-area grid: `header`, intentionally blank
space, `shape`, `motion`, and `preview`.

## Vue API

```vue
<MoyoBlob
  base="wander"
  :spin="{ speed: 1, reverse: false }"
  pulse
  color="#5436DA"
  :size="160"
  :speed="1"
  :complexity="8"
  :distortion="0.4"
  :paused="false"
/>
```

Props:

- `base`: `breathe`, `wander`, or `churn`. Defaults to `wander`.
- `spin`: boolean or `{ speed, reverse }`.
- `pulse`: boolean or `{ scale }`.
- `color`: CSS color. Defaults to `#5436DA`.
- `size`: number or CSS length. Defaults to `160`.
- `speed`: multiplier from `0.3` to `2.5`. Larger means faster.
- `complexity`: bump count from `3` to `12`. Defaults to `4`.
- `distortion`: bump depth from `0` to `1`. Defaults to `0.4`.
- `paused`: pauses CSS layers and complex path morphing.

## Core API

```ts
import {
  generateBlobFrames,
  generateBlobPath,
  getMotion,
  listMotions,
  type MotionConfig
} from "moyo";
```

`generateBlobPath(complexity, distortion, seed)` and
`generateBlobFrames(complexity, distortion, seed, n)` are deterministic for the
same parameters.

## Development

```bash
pnpm install
pnpm dev
pnpm build
pnpm typecheck
```

## Philosophy

Moyo is unopinionated. Motions do not carry personality, usage, emotion, or
semantic labels. The product using Moyo decides what the blob means.

The Builder UI uses a minimal five-area grid: `header`, intentionally blank
space, `shape`, `motion`, and `preview`. The blob color is the main accent.

See `docs/philosophy.md`.
