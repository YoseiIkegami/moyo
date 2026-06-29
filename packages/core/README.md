# Moyo （模様）

**Organic loading blobs. Choose motion, not shape.**

Motion-first, framework-agnostic SVG blobs that breathe, wander, and churn —
the kind of abstract, living shape you drop into empty space.

[![npm](https://img.shields.io/npm/v/@ikg-systems/moyo.svg)](https://www.npmjs.com/package/@ikg-systems/moyo)
[![license](https://img.shields.io/npm/l/@ikg-systems/moyo.svg)](https://github.com/YoseiIkegami/moyo/blob/main/LICENSE)

- **Live demo:** https://yoseiikegami.github.io/moyo/
- **Source & full docs:** https://github.com/YoseiIkegami/moyo
- **Vue 3 components:** [`@ikg-systems/moyo-vue`](https://www.npmjs.com/package/@ikg-systems/moyo-vue)

---

This is `@ikg-systems/moyo`: the **zero-dependency, framework-agnostic core**.
It generates SVG path data. You decide where to render it.

Use this package when you are building with React, Svelte, vanilla JS, Canvas,
Web Components, or your own renderer. If you use Vue 3, install
[`@ikg-systems/moyo-vue`](https://www.npmjs.com/package/@ikg-systems/moyo-vue)
instead for ready-made components.

## Try it first

Open the **[live demo](https://yoseiikegami.github.io/moyo/)** to tune the
motion, shape, color, and seed visually. The demo can copy SVG/path output you
can use as a reference when wiring the core package into your own renderer.

## Installation

```bash
npm install @ikg-systems/moyo
```

## Quick Start

```js
import { generateBlobPoints, buildPath } from "@ikg-systems/moyo";

const points = generateBlobPoints(8, "moyo-1k8");
const d = buildPath(points, 0, { base: "wander", edge: 0.4, spike: 0.2 });
// -> "M 200 90 C ..." feed into any <path d="...">
```

Render the path inside an SVG with `viewBox="0 0 400 400"`, and advance the time
argument (`buildPath(points, t, ...)`) on each `requestAnimationFrame` to animate.

```js
import { generateBlobPoints, buildPath } from "@ikg-systems/moyo";

const svg = document.querySelector("svg");
const path = document.querySelector("path");
const points = generateBlobPoints(8, "hero-mark");

let startedAt = performance.now();

function frame(now) {
  const t = (now - startedAt) / 1000;

  path.setAttribute(
    "d",
    buildPath(points, t, {
      base: "wander",
      edge: 0.4,
      spike: 0.2
    })
  );

  requestAnimationFrame(frame);
}

svg.setAttribute("viewBox", "0 0 400 400");
requestAnimationFrame(frame);
```

```html
<svg width="160" height="160" aria-hidden="true">
  <path fill="#5436DA"></path>
</svg>
```

### Motions

| motion | feel | what it does |
| --- | --- | --- |
| `breathe` | calm | the whole shape expands and contracts together |
| `wander` | flowing | dents and bulges travel around the rim |
| `churn` | alive | every point pushes and pulls out of sync |

### Shape axes

| prop | range | meaning |
| --- | --- | --- |
| `complexity` | 3-64 | number of control points (low = smooth, high = ripples) |
| `edge` | 0-1 | how far the outline can carve inward |
| `spike` | 0-1 | how far the outline can push outward |

## When to use the core

- Use `@ikg-systems/moyo` when you want full control over rendering.
- Use `@ikg-systems/moyo-vue` when you want Vue components.
- Use the **[live demo](https://yoseiikegami.github.io/moyo/)** when you want to
  design a blob visually and copy the result.

See the [full documentation](https://github.com/YoseiIkegami/moyo#readme) and the
[live demo](https://yoseiikegami.github.io/moyo/) for the complete API.

## License

[MIT](https://github.com/YoseiIkegami/moyo/blob/main/LICENSE) © Yosei Ikegami / IKG Systems
