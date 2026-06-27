# Moyo Agent Guide

Moyo is a motion-first organic blob library. The shape is only the vessel; motion
is the product.

Follow `.cursor/agent.md` as the canonical project guidance.

Key rules:

- Catalog base motions and optional layers, not named shapes.
- Do not add personality, usage, emotion, or semantic labels.
- Keep `moyo` zero-dependency and framework-agnostic.
- Select the renderer automatically from `complexity`.
- Use CSS `border-radius` for simple blobs and generated SVG paths for complex blobs.
- Public Vue API uses `base`, `spin`, and `pulse` rather than `motion`/`layers`.
- Keep blobs in place: no `translate`, `top`, `left`, or layout movement.
- Keep the Builder UI minimal with the five-area grid and intentionally blank space.
