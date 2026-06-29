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

This is `@ikg-systems/moyo` — the **zero-dependency, framework-agnostic core**.
It generates SVG path data; you render it however you like. If you use Vue 3,
install [`@ikg-systems/moyo-vue`](https://www.npmjs.com/package/@ikg-systems/moyo-vue)
for drop-in components instead.

## Installation

```bash
npm install @ikg-systems/moyo
```

## Usage

```js
import { generateBlobPoints, buildPath } from "@ikg-systems/moyo";

const points = generateBlobPoints(8, "moyo-1k8");
const d = buildPath(points, 0, { base: "wander", edge: 0.4, spike: 0.2 });
// -> "M 200 90 C ..." feed into any <path d="...">
```

Render the path inside an SVG with `viewBox="0 0 400 400"`, and advance the time
argument (`buildPath(points, t, ...)`) on each `requestAnimationFrame` to animate.

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

See the [full documentation](https://github.com/YoseiIkegami/moyo#readme) and the
[live demo](https://yoseiikegami.github.io/moyo/) for the complete API.

## License

[MIT](https://github.com/YoseiIkegami/moyo/blob/main/LICENSE) © Yosei Ikegami / IKG Systems
