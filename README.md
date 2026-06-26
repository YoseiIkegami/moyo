# Blob Studio

Blob Studio is a lightweight SVG shape library for engineers who want organic,
hand-held forms without leaving their component workflow.

The MVP ships as a pnpm workspace with:

- `@blob-studio/js`: pure TypeScript shape data exports.
- `@blob-studio/vue`: Vue 3 component wrapper.
- `demo`: Vite demo site for testing every shape.

## Getting Started

```bash
pnpm install
pnpm dev
```

Build all packages and the demo:

```bash
pnpm build
pnpm typecheck
```

## Data Layer

Use `@blob-studio/js` when you only need SVG path data.

```ts
import { getShape, listShapes, searchShapes } from "@blob-studio/js";

const kidney = getShape("kidney");
const allShapes = listShapes();
const organicShapes = searchShapes("organic");
```

Each shape follows this structure:

```ts
type ShapeData = {
  id: string;
  name: string;
  nameJa: string;
  description: string;
  path: string;
  viewBox: string;
  tags: string[];
};
```

## Vue Component

Use `@blob-studio/vue` in Vue 3 apps.

```vue
<template>
  <BlobShape
    shape-id="kidney"
    color="#2563eb"
    :size="144"
    animated
    animation-type="float"
  />
</template>

<script setup lang="ts">
import { BlobShape } from "@blob-studio/vue";
</script>
```

### Props

- `shapeId`: shape ID such as `kidney`, `reuleaux`, `capsule`, or `squircle`.
- `color`: SVG fill color. Defaults to `#1f2937`.
- `size`: SVG width and height. Defaults to `100`.
- `opacity`: path opacity from `0` to `1`. Defaults to `1`.
- `animated`: enables CSS animation. Defaults to `false`.
- `animationType`: `float`, `spin`, `pulse`, or `wiggle`.

## Shape IDs

The MVP includes 18 shapes:

`kidney`, `reuleaux`, `capsule`, `squircle`, `pebble`, `leaf`, `droplet`,
`amoeba`, `wave`, `egg`, `cloud`, `petal`, `bean`, `shield`, `orbit`,
`softDiamond`, `bubble`, `manta`.

## Demo

The demo renders every shape in a responsive grid with:

- Global animation toggle.
- Animation type selector.
- Per-card color picker.
- Per-card size slider.

```bash
pnpm --filter demo dev
```

## Package Publishing

The workspace is prepared for package builds, but npm publishing is intentionally
out of scope until the v1.0 stable API is finalized.
