<div align="center">

# Moyo （模様）

**Organic loading blobs. Choose motion, not shape.**

Motion-first, framework-agnostic SVG blobs that breathe, wander, and churn —
the kind of abstract, living shape you drop into empty space.

[![npm](https://img.shields.io/npm/v/@ikg-systems/moyo.svg)](https://www.npmjs.com/package/@ikg-systems/moyo)
[![license](https://img.shields.io/npm/l/@ikg-systems/moyo.svg)](./LICENSE)

</div>

---

## What is Moyo?

Most shape libraries give you *shapes*. Moyo gives you *motion*.

The object stays nameless and abstract. You don't pick "a kidney" or "a star" —
you pick **how it moves**, then tune a few essentials: color, size, complexity,
and the way its edge bends inward (`edge`) or pushes outward (`spike`).

It's built for the moment a screen feels a little empty: an avatar background,
an empty state, a loading indicator, a hero accent. Place it, and let it live.

> Moyo is Japanese for *pattern / motif* (模様), and Swahili for *heart / soul*.
> A fitting name for a shape whose whole point is to feel alive.

---

## Features

- **Motion-first** — three distinct living motions: `breathe`, `wander`, `churn`
- **Unopinionated** — single fill, no gradients, no baked-in meaning. You control color.
- **Two shape axes** — `edge` (carve inward) and `spike` (push outward), animated, never static
- **Single or Cluster** — one blob, or many that merge and split like metaballs
- **Tiny and dependency-free core** — pure SVG path generation, no animation library
- **Reproducible** — seed-based generation; the same seed always yields the same shape
- **Vue 3 ready** — drop-in component, or use the framework-agnostic core anywhere

---

## Installation

```bash
# Vue 3
npm install @ikg-systems/moyo-vue

# Framework-agnostic core only
npm install @ikg-systems/moyo
```

---

## Quick start (Vue 3)

```vue
<script setup>
import { MoyoBlob } from "@ikg-systems/moyo-vue";
</script>

<template>
  <MoyoBlob base="wander" color="#5436DA" :size="160" />
</template>
```

That's it. A purple blob, wandering in place.

---

## Usage

### Choose a motion

The base motion is the soul of the blob. Three are built in:

| motion | feel | what it does |
| --- | --- | --- |
| `breathe` | calm | the whole shape expands and contracts together |
| `wander` | flowing | dents and bulges travel around the rim |
| `churn` | alive | every point pushes and pulls out of sync |

```vue
<MoyoBlob base="breathe" />
<MoyoBlob base="wander" />
<MoyoBlob base="churn" />
```

### Shape the silhouette

`edge` carves the outline inward (dents, waists). `spike` pushes it outward
(bulges, points). Both animate over time and return to the base circle —
nothing stays dented forever.

```vue
<MoyoBlob base="wander" :complexity="9" :edge="0.5" :spike="0.3" />
```

| prop | range | meaning |
| --- | --- | --- |
| `complexity` | 3-64 | number of control points (low = smooth, high = ripples) |
| `edge` | 0-1 | how far the outline can carve inward |
| `spike` | 0-1 | how far the outline can push outward |

### Control the movement

```vue
<MoyoBlob
  base="churn"
  :morph-speed="1.4"
  :spin-speed="0.5"
  :reverse="false"
  :paused="false"
/>
```

| prop | range | meaning |
| --- | --- | --- |
| `morphSpeed` | 0.1-10 | how fast the shape shifts |
| `spinSpeed` | 0-10 | whole-blob rotation (0 = no spin) |
| `reverse` | boolean | reverse the spin |
| `paused` | boolean | freeze in place |

### Reproducible shapes with `seed`

Every blob is generated from a seed. Pass one to lock the exact shape;
omit it for the default. The same seed always produces the same blob.

```vue
<MoyoBlob base="wander" seed="moyo-1k8" />
```

---

## Cluster mode

Switch to a cluster of blobs that drift outward from the center and back,
merging and splitting through a gooey filter.

```vue
<script setup>
import { MoyoCluster } from "@ikg-systems/moyo-vue";
</script>

<template>
  <MoyoCluster
    base="wander"
    :count="6"
    :spread="0.5"
    :spin-speed="0.3"
    color="#5436DA"
  />
</template>
```

| prop | range | meaning |
| --- | --- | --- |
| `count` | 2-16 | number of blobs |
| `spread` | 0-1 | how far they travel from center |

Each blob breathes in and out along its own radial line. Add `spinSpeed`
to rotate the whole cluster for more complex motion.

---

## Framework-agnostic core

The core package has no framework dependency. It generates the SVG path data;
you render it however you like.

```js
import { generateBlobPoints, buildPath } from "@ikg-systems/moyo";

const points = generateBlobPoints(8, "moyo-1k8");
const d = buildPath(points, 0, { base: "wander", edge: 0.4, spike: 0.2 });
// -> "M 200 90 C ..." feed into any <path d="...">
```

---

## Philosophy

Moyo borrows its structure from [Material Design 3](https://m3.material.io/) —
design tokens, physics-style motion, morphing as a meaningful signal — but
inverts the purpose. M3 shapes carry meaning and communicate state. Moyo shapes
carry none. They are decorative by design: something to fill space, not to label it.

- **The motion is the product.** Names like "Mochi" or "Tide" would imply meaning the shape doesn't have. You choose a motion, and the object stays nameless.
- **Unopinionated.** No gradients, no shadows, no random theming. One fill color, supplied by you.
- **In place, always.** Blobs never translate across the screen. They breathe, bend, and rotate where they sit.

---

## Browser support

Modern evergreen browsers (Chrome, Firefox, Safari, Edge). Rendering uses
SVG paths and `requestAnimationFrame`; cluster mode uses SVG filters.

---

## License

[MIT](./LICENSE) © Yosei Ikegami / IKG Systems
