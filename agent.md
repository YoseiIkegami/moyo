# Moyo Agent Guide

Moyo is a motion-first organic blob library. Shape is only the vessel; motion is
the product.

Follow `.cursor/agent.md` as the canonical project guidance.

Key rules:

- Support `MoyoBlob` Single mode and `MoyoCluster` Cluster mode.
- Do not add personality, usage, emotion, or semantic labels.
- Keep `@ikg-systems/moyo` zero-dependency and framework-agnostic.
- Use SVG-only renderers with `viewBox="0 0 400 400"`.
- Do not reintroduce `pulse`, CSS `border-radius` rendering, or hybrid branching.
- Public shape controls are `edge` and `spike`; `distortion` is not a public prop.
- Use `morphSpeed` for shape/radial breathing and `spinSpeed` for parent rotation.
- Cluster balls breathe radially along fixed directions; do not make them orbit.
- Rebuild Single metadata only when `complexity` or `seed` changes.
- Rebuild Cluster metadata only when `count`, `complexity`, or `seed` changes.
- Keep blobs in place: no `translate`, `top`, `left`, or layout movement.
- Manual color picker input rebuilds swatches; swatch click applies color only.
- Keep the Builder UI minimal: setup is mode-only, motion controls movement, shape holds parameters/color/seed, and preview shows the result.
