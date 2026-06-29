# Moyo Agent Guide

Project guidance lives in `.cursor/agent.md` (canonical) and `agent.md`. Read those for
product/coding rules. This file adds environment/run notes for Cursor Cloud agents.

## Cursor Cloud specific instructions

Moyo is a pnpm (v9) monorepo for a Vue 3 / TypeScript SVG "blob" library. There is no
backend, database, or external service — only a client-side library plus a Vite demo app.

- **Workspaces:** `packages/core` (`@ikg-systems/moyo`, framework-agnostic engine),
  `packages/vue` (`@ikg-systems/moyo-vue`), and `demo` (private Vite playground).
- **`.npmrc` gotcha:** the committed `.npmrc` sets `virtual-store-dir` to a hardcoded
  Windows path (`C:/Users/...`) that is invalid on Linux. Always install with an override,
  e.g. `pnpm install --virtual-store-dir=node_modules/.pnpm` (the startup update script
  already does this). A bare `pnpm install` may create a stray `C:` directory.
- **Standard commands** (see root `package.json`): `pnpm dev` (Vite demo), `pnpm build`
  (builds the two `packages/*`), `pnpm typecheck` (recursive). There is no ESLint config —
  `pnpm typecheck` is the lint/static-check step.
- **Dev server URL:** `pnpm dev` serves the demo at `http://localhost:5173/moyo/`. The
  Vite `base` is `/moyo/` (see `demo/vite.config.ts`), so the bare `/` path 404s — use
  `/moyo/`.
- **No prior build needed for the demo:** `demo/vite.config.ts` aliases the package names
  directly to `packages/*/src`, so the demo runs against source without building first.
