# Moyo for Vue 3 （模様）

**Organic loading blobs. Choose motion, not shape.**

Motion-first, framework-agnostic SVG blobs that breathe, wander, and churn —
the kind of abstract, living shape you drop into empty space. This package wraps
the [`@ikg-systems/moyo`](https://www.npmjs.com/package/@ikg-systems/moyo) core in
ready-to-use Vue 3 components.

[![npm](https://img.shields.io/npm/v/@ikg-systems/moyo-vue.svg)](https://www.npmjs.com/package/@ikg-systems/moyo-vue)
[![license](https://img.shields.io/npm/l/@ikg-systems/moyo-vue.svg)](https://github.com/YoseiIkegami/moyo/blob/main/LICENSE)

- **Live demo:** https://yoseiikegami.github.io/moyo/
- **Source & full docs:** https://github.com/YoseiIkegami/moyo
- **Framework-agnostic core:** [`@ikg-systems/moyo`](https://www.npmjs.com/package/@ikg-systems/moyo)

---

## Try it first

Open the **[live demo](https://yoseiikegami.github.io/moyo/)**, adjust the
controls, then click **Copy Vue**. The copied snippet uses the same props shown
below, so you can design visually and paste the result into your app.

## Installation

```bash
npm install @ikg-systems/moyo-vue
```

Requires Vue `^3.4.0` as a peer dependency.

## Quick start

```vue
<script setup>
import { MoyoBlob } from "@ikg-systems/moyo-vue";
</script>

<template>
  <MoyoBlob base="wander" color="#5436DA" :size="160" />
</template>
```

That's it. A purple blob, wandering in place.

## Common examples

### A subtle brand mark

```vue
<MoyoBlob
  base="breathe"
  color="#D94A1E"
  :size="32"
  :complexity="10"
  :edge="0.35"
  :spike="0.2"
  seed="site-logo"
/>
```

### A more active loading accent

```vue
<MoyoBlob
  base="churn"
  color="#5436DA"
  :size="96"
  :morph-speed="1.6"
  :spin-speed="0.4"
  :complexity="12"
/>
```

## Cluster mode

```vue
<script setup>
import { MoyoCluster } from "@ikg-systems/moyo-vue";
</script>

<template>
  <MoyoCluster base="wander" :count="6" :spread="0.5" :spin-speed="0.3" color="#5436DA" />
</template>
```

Use cluster mode when you want a gooey group of blobs that drift, merge, and
separate around the center.

## Props

| prop | range | meaning |
| --- | --- | --- |
| `base` | `breathe` \| `wander` \| `churn` | the base motion |
| `color` | CSS color | single fill color |
| `size` | px | rendered size |
| `complexity` | 3-64 | number of control points |
| `edge` | 0-1 | how far the outline can carve inward |
| `spike` | 0-1 | how far the outline can push outward |
| `morphSpeed` | 0.1-10 | how fast the shape shifts |
| `spinSpeed` | 0-10 | whole-blob rotation (0 = no spin) |
| `reverse` | boolean | reverse the spin |
| `paused` | boolean | freeze in place |
| `seed` | string | reproducible shape |
| `count` *(Cluster)* | 2-16 | number of blobs |
| `spread` *(Cluster)* | 0-1 | how far they travel from center |

## Which package do I need?

Most Vue users only need this package:

```bash
npm install @ikg-systems/moyo-vue
```

It uses [`@ikg-systems/moyo`](https://www.npmjs.com/package/@ikg-systems/moyo)
internally. Install the core package directly only if you want to generate SVG
paths yourself outside Vue components.

See the [full documentation](https://github.com/YoseiIkegami/moyo#readme) and the
[live demo](https://yoseiikegami.github.io/moyo/) for the complete API and examples.

## License

[MIT](https://github.com/YoseiIkegami/moyo/blob/main/LICENSE) © Yosei Ikegami / IKG Systems
