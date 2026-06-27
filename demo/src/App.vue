<template>
  <main class="app" :style="appStyle">
    <header class="header">
      <div class="logo">MOYO</div>
    </header>

    <section class="setup" aria-label="Setup parameters">
      <el-segmented v-model="mode" :options="modeOptions" block />
    </section>

    <section class="motion" aria-label="Motion parameters">
      <div class="motion-top">
        <div class="motion-group base-group">
          <div class="section-label">Base motion</div>
          <el-segmented v-model="base" :options="baseOptions" block />
        </div>

        <el-button class="pause-button" type="default" @click="togglePause">
          <el-icon>
            <VideoPause v-if="!paused" />
            <VideoPlay v-else />
          </el-icon>
          {{ paused ? "Play" : "Pause" }}
        </el-button>
      </div>

      <div class="motion-bottom">
        <div class="motion-group morph-group">
          <div class="section-label">Morph</div>
          <div class="speed-head">
            <span>Morph speed</span>
            <span class="v">{{ morphSpeed.toFixed(1) }}x</span>
          </div>
          <input v-model.number="morphSpeed" type="range" min="0.1" max="10" step="0.1" />
        </div>

        <div class="motion-group rotation-group">
          <div class="section-label">Rotation</div>
          <div class="rotation-controls">
            <div class="rotation-speed">
              <div class="speed-head">
                <span>Spin speed</span>
                <span class="v">{{ spinSpeed.toFixed(1) }}x</span>
              </div>
              <input v-model.number="spinSpeed" type="range" min="0" max="10" step="0.1" />
            </div>
            <div v-if="spinSpeed > 0" class="direction-row">
              <span class="direction-label">Direction</span>
              <el-segmented v-model="spinDir" :options="spinDirOptions" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="shape" aria-label="Shape parameters">
      <div class="shape-params">
        <div class="group-label">Shape</div>
        <label class="field grow">
          <div class="field-head">
            <span>{{ mode === "cluster" ? "Complexity（各塊）" : "Complexity" }}</span>
            <span class="v">{{ complexity }}</span>
          </div>
          <input v-model.number="complexity" type="range" min="3" max="64" step="1" />
        </label>

        <label class="field grow">
          <div class="field-head">
            <span>Edge</span>
            <span class="v">{{ edge.toFixed(2) }}</span>
          </div>
          <input v-model.number="edge" type="range" min="0" max="1" step="0.05" />
        </label>

        <label class="field grow">
          <div class="field-head">
            <span>Spike</span>
            <span class="v">{{ spike.toFixed(2) }}</span>
          </div>
          <input v-model.number="spike" type="range" min="0" max="1" step="0.05" />
        </label>

        <label v-if="mode === 'cluster'" class="field grow">
          <div class="field-head">
            <span>Blob count</span>
            <span class="v">{{ blobCount }}</span>
          </div>
          <input v-model.number="blobCount" type="range" min="2" max="16" step="1" />
        </label>

        <label v-if="mode === 'cluster'" class="field grow">
          <div class="field-head">
            <span>Spread</span>
            <span class="v">{{ spread.toFixed(2) }}</span>
          </div>
          <input v-model.number="spread" type="range" min="0" max="1" step="0.05" />
        </label>
      </div>

      <div class="bottom-fixed">
        <label class="field color-field">
          <div class="field-head"><span>Color</span></div>
          <div class="color-wrap">
            <input :value="color" type="color" @input="onColorInput" />
          </div>
          <div class="swatches" aria-label="Color presets">
            <button
              v-for="swatch in swatches"
              :key="swatch"
              class="swatch"
              type="button"
              :style="{ background: swatch }"
              :aria-label="`Use ${swatch}`"
              @click="applyColor(swatch)"
            />
          </div>
        </label>

        <div class="field seed-field seed-group">
          <div class="field-head">
            <span>Seed</span>
            <span class="seed-chip">{{ seed }}</span>
          </div>
          <button class="seed-btn" type="button" @click="reseed">↻ reseed</button>
        </div>
      </div>
    </section>

    <section class="preview" aria-label="Moyo preview">
      <div class="hint"><b>Choose motion, not shape.</b> The object stays nameless.</div>

      <MoyoBlob
        v-if="mode === 'single'"
        :base="base"
        :spin-speed="spinSpeed"
        :reverse="isSpinReverse"
        :color="color"
        :size="size"
        :morph-speed="morphSpeed"
        :complexity="complexity"
        :edge="edge"
        :spike="spike"
        :paused="paused"
        :seed="seed"
      />
      <MoyoCluster
        v-else
        :base="base"
        :color="color"
        :size="size"
        :morph-speed="morphSpeed"
        :spin-speed="spinSpeed"
        :reverse="isSpinReverse"
        :complexity="complexity"
        :edge="edge"
        :spike="spike"
        :paused="paused"
        :seed="seed"
        :count="blobCount"
        :spread="spread"
      />

      <div class="copy-row">
        <button class="copy-btn primary" type="button" @click="copyVue">Copy Vue</button>
        <button class="copy-btn" type="button" @click="copyOutput">Copy {{ outputLabel }}</button>
      </div>

      <p v-if="copiedLabel" class="copy-status" role="status">{{ copiedLabel }}</p>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { ElButton, ElIcon, ElSegmented } from "element-plus";
import { VideoPause, VideoPlay } from "@element-plus/icons-vue";
import {
  blobEngineBounds,
  buildPath,
  buildPathAt,
  clusterPosition,
  generateBlobPoints,
  generateClusterBalls,
  type BaseMotion
} from "@ikg-systems/moyo";
import { MoyoBlob, MoyoCluster } from "@ikg-systems/moyo-vue";

const modeOptions = [
  { label: "Single", value: "single" },
  { label: "Cluster", value: "cluster" }
];
const baseOptions: Array<{ label: string; value: BaseMotion }> = [
  { label: "Breathe", value: "breathe" },
  { label: "Wander", value: "wander" },
  { label: "Churn", value: "churn" }
];
const spinDirOptions = [
  { label: "↻", value: "cw" },
  { label: "⟲", value: "ccw" }
];
const mode = ref<"single" | "cluster">("single");
const color = ref("#5436DA");
const size = ref(160);
const complexity = ref(6);
const edge = ref(0.3);
const spike = ref(0.2);
const blobCount = ref(4);
const spread = ref(0.5);
const morphSpeed = ref(1);
const spinSpeed = ref(0);
const paused = ref(false);
const base = ref<BaseMotion>("wander");
const spinDir = ref<"cw" | "ccw">("cw");
const seed = ref("builder");
const copiedLabel = ref("");
const swatches = ref<string[]>([]);

const outputLabel = "SVG";
const isSpinReverse = computed(() => spinDir.value === "ccw");

const togglePause = () => {
  paused.value = !paused.value;
};

type Rgb = {
  r: number;
  g: number;
  b: number;
};

type Hsl = {
  h: number;
  s: number;
  l: number;
};

type StaticBlobPoint = {
  ang: number;
  inAmt: number;
  outAmt: number;
  phase: number;
  phaseOut: number;
  freq: number;
  freqOut: number;
};

type StaticClusterBall = {
  dir: number;
  r: number;
  breathPhase: number;
  breathSpeed: number;
  pts: StaticBlobPoint[];
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const hexToRgb = (hex: string): Rgb => ({
  r: Number.parseInt(hex.slice(1, 3), 16),
  g: Number.parseInt(hex.slice(3, 5), 16),
  b: Number.parseInt(hex.slice(5, 7), 16)
});

const rgbToHex = (r: number, g: number, b: number) =>
  `#${[r, g, b]
    .map((value) => clamp(Math.round(value), 0, 255).toString(16).padStart(2, "0"))
    .join("")}`;

const luminance = (hex: string) => {
  const { r, g, b } = hexToRgb(hex);

  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
};

const rgbToHsl = (r: number, g: number, b: number): Hsl => {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case rn:
        h = (gn - bn) / d + (gn < bn ? 6 : 0);
        break;
      case gn:
        h = (bn - rn) / d + 2;
        break;
      default:
        h = (rn - gn) / d + 4;
        break;
    }

    h /= 6;
  }

  return { h: h * 360, s, l };
};

const hslToHex = (h: number, s: number, l: number) => {
  const hn = (((h % 360) + 360) % 360) / 360;
  let r = l;
  let g = l;
  let b = l;

  if (s !== 0) {
    const hueToRgb = (p: number, q: number, t: number) => {
      let tn = t;

      if (tn < 0) tn += 1;
      if (tn > 1) tn -= 1;
      if (tn < 1 / 6) return p + (q - p) * 6 * tn;
      if (tn < 1 / 2) return q;
      if (tn < 2 / 3) return p + (q - p) * (2 / 3 - tn) * 6;

      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hueToRgb(p, q, hn + 1 / 3);
    g = hueToRgb(p, q, hn);
    b = hueToRgb(p, q, hn - 1 / 3);
  }

  return rgbToHex(r * 255, g * 255, b * 255);
};

const similarPalette = (hex: string) => {
  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(r, g, b);

  return [
    hslToHex((h + 330) % 360, s, Math.min(0.85, l + 0.12)),
    hslToHex((h + 345) % 360, s, l),
    hex,
    hslToHex((h + 15) % 360, s, l),
    hslToHex((h + 30) % 360, Math.min(1, s * 1.05), Math.max(0.25, l - 0.1)),
    hslToHex(h, Math.max(0.2, s * 0.5), Math.min(0.9, l + 0.2))
  ];
};

const buildSwatches = (hex: string) => {
  swatches.value = similarPalette(hex);
};

const applyColor = (hex: string) => {
  color.value = hex;
};

const onColorInput = (event: Event) => {
  const nextColor = (event.target as HTMLInputElement).value;
  applyColor(nextColor);
  buildSwatches(nextColor);
};

buildSwatches(color.value);

const contrast = (hexA: string, hexB: string) => {
  const a = luminance(hexA) + 0.05;
  const b = luminance(hexB) + 0.05;

  return a > b ? a / b : b / a;
};

const onPrimary = (primary: string) => {
  const { r, g, b } = hexToRgb(primary);
  const { h, s } = rgbToHsl(r, g, b);
  const primaryL = luminance(primary);
  const candidate = hslToHex((h + 180) % 360, Math.min(s, 0.5) * 0.6, primaryL > 0.5 ? 0.12 : 0.95);

  if (contrast(primary, candidate) < 3.2) {
    return primaryL > 0.5 ? "#111111" : "#ffffff";
  }

  return candidate;
};

const previewBg = (primary: string) => {
  const primaryL = luminance(primary);

  if (primaryL > 0.82) return "#dcdbe4";
  if (primaryL < 0.18) return "#f7f7fa";

  const { r, g, b } = hexToRgb(primary);
  const { h, s } = rgbToHsl(r, g, b);

  return hslToHex(h, Math.min(s, 0.4) * 0.5, 0.95);
};

const colorTokens = computed(() => {
  const primary = color.value;
  const { r, g, b } = hexToRgb(primary);
  const { h, s } = rgbToHsl(r, g, b);
  const primaryL = luminance(primary);
  const ringL = primaryL > 0.7 ? 0.42 : Math.max(0.18, primaryL - 0.2);
  const glowA = primaryL > 0.8 ? 0.18 : 0.28;

  return {
    primary,
    onPrimary: onPrimary(primary),
    btnRing: hslToHex(h, Math.min(1, s * 0.9), ringL),
    btnShadow: `rgba(${r}, ${g}, ${b}, 0.45)`,
    previewBg: previewBg(primary),
    blobShadow: `drop-shadow(0 18px 32px rgba(${r}, ${g}, ${b}, ${glowA}))`
  };
});

const appStyle = computed(() => ({
  "--primary": colorTokens.value.primary,
  "--accent": colorTokens.value.primary,
  "--on-primary": colorTokens.value.onPrimary,
  "--btn-ring": colorTokens.value.btnRing,
  "--btn-shadow": colorTokens.value.btnShadow,
  "--preview-bg": colorTokens.value.previewBg,
  "--blob-shadow": colorTokens.value.blobShadow
}));

const buildSvgSnippet = () => {
  if (mode.value === "cluster") {
    const balls = generateClusterBalls(blobCount.value, complexity.value, seed.value);
    const paths = balls
      .map((ball: StaticClusterBall) => {
        const d = buildPathAt(
          ball.pts,
          0,
          {
            base: base.value,
            edge: edge.value,
            spike: spike.value
          },
          clusterPosition(ball, 0, morphSpeed.value, spread.value),
          ball.r
        );

        return `    <path fill="${color.value}" d="${d}" />`;
      })
      .join("\n");

    return `<svg viewBox="${blobEngineBounds.viewBox}" width="${size.value}" height="${size.value}" aria-hidden="true">
  <defs>
    <filter id="goo">
      <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
      <feColorMatrix
        in="blur"
        mode="matrix"
        values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"
        result="goo"
      />
      <feComposite in="SourceGraphic" in2="goo" operator="atop" />
    </filter>
  </defs>
  <g filter="url(#goo)">
${paths}
  </g>
</svg>`;
  }

  const points = generateBlobPoints(complexity.value, seed.value);
  const d = buildPath(points, 0, {
    base: base.value,
    edge: edge.value,
    spike: spike.value
  });

  return `<svg viewBox="${blobEngineBounds.viewBox}" width="${size.value}" height="${size.value}" aria-hidden="true">
  <path fill="${color.value}" d="${d}" />
</svg>`;
};

const reseed = () => {
  seed.value = `moyo-${Math.random().toString(36).slice(2, 8)}`;
};

const copyText = async (label: string, value: string) => {
  await navigator.clipboard.writeText(value);
  copiedLabel.value = `${label} copied`;
  window.setTimeout(() => {
    copiedLabel.value = "";
  }, 1600);
};

const copyVue = () =>
  copyText(
    "Vue",
    mode.value === "cluster"
      ? `<MoyoCluster base="${base.value}" color="${color.value}" :size="${size.value}" :morph-speed="${morphSpeed.value}" :spin-speed="${spinSpeed.value}"${isSpinReverse.value ? " reverse" : ""} :complexity="${complexity.value}" :edge="${edge.value}" :spike="${spike.value}" seed="${seed.value}" :count="${blobCount.value}" :spread="${spread.value}"${paused.value ? " paused" : ""} />`
      : `<MoyoBlob base="${base.value}" color="${color.value}" :size="${size.value}" :morph-speed="${morphSpeed.value}" :spin-speed="${spinSpeed.value}"${isSpinReverse.value ? " reverse" : ""} :complexity="${complexity.value}" :edge="${edge.value}" :spike="${spike.value}" seed="${seed.value}"${paused.value ? " paused" : ""} />`
  );

const copyOutput = () => copyText(outputLabel, buildSvgSnippet());
</script>

<style scoped>
:global(*) {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:global(html),
:global(body) {
  height: 100%;
}

:global(body) {
  min-width: 320px;
  overflow: hidden;
  background: #ffffff;
  color: #1a1c22;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", "Hiragino Sans", Roboto,
    sans-serif;
}

.app {
  --primary: #5436da;
  --accent: #5436da;
  --on-primary: #ffffff;
  --btn-ring: #3d2699;
  --btn-shadow: rgba(84, 54, 218, 0.45);
  --preview-bg: #f4f3f7;
  --blob-shadow: drop-shadow(0 18px 32px rgba(84, 54, 218, 0.28));
  --ink: #1a1c22;
  --sub: #9a9ba3;
  --line: #e7e6ec;
  --panel: #ffffff;

  display: grid;
  grid-template-areas:
    "header header"
    "setup motion"
    "shape preview";
  grid-template-columns: 220px 1fr;
  grid-template-rows: 56px 116px 1fr;
  height: 100vh;
  overflow: hidden;
  transition: background 400ms ease;
}

.header {
  grid-area: header;
  display: flex;
  align-items: center;
  padding: 0 24px;
  border-bottom: 1px solid var(--line);
}

.logo {
  color: var(--ink);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.28em;
}

.setup {
  grid-area: setup;
  display: flex;
  align-items: center;
  padding: 20px;
  border-right: 1px solid var(--line);
  overflow: hidden;
}

.shape {
  grid-area: shape;
  display: flex;
  flex-direction: column;
  padding: 24px 20px;
  border-right: 1px solid var(--line);
  overflow: hidden;
}

.shape-params {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.bottom-fixed {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-top: auto;
}

.seed-group {
  padding-top: 18px;
  border-top: 1px solid var(--line);
}

.group-label,
.section-label {
  color: var(--sub);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.group-label {
  margin-bottom: 14px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 7px;
  min-width: 150px;
}

.color-field {
  min-width: 0;
}

.field.grow {
  min-width: 0;
}

.seed-field {
  min-width: 0;
}

.seed-btn {
  height: 34px;
  padding: 0 14px;
  border: 1px solid var(--line);
  border-radius: 9px;
  background: var(--panel);
  color: var(--ink);
  cursor: pointer;
  font: inherit;
  font-size: 12.5px;
  font-weight: 600;
  transition:
    border-color 150ms ease,
    color 150ms ease;
}

.seed-chip {
  max-width: 112px;
  overflow: hidden;
  padding: 2px 6px;
  border-radius: 6px;
  background: var(--preview-bg);
  color: var(--ink);
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  font-size: 11px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.seed-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.field-head,
.speed-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  color: var(--sub);
  font-size: 12px;
}

.field-head .v,
.speed-head .v {
  color: var(--ink);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.motion {
  position: relative;
  grid-area: motion;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 7px;
  overflow: hidden;
  padding: 10px 32px 10px;
  border-bottom: 1px solid var(--line);
}

.motion-top,
.motion-bottom {
  display: flex;
  width: 100%;
  gap: 28px;
  align-items: flex-end;
}

.motion-bottom {
  padding-top: 7px;
  border-top: 1px solid rgba(231, 230, 236, 0.75);
}

.motion-group {
  min-width: 180px;
}

.base-group {
  flex: 0 1 360px;
  padding-right: 132px;
}

.morph-group {
  flex: 1 1 220px;
}

.rotation-group {
  display: flex;
  flex-direction: column;
  flex: 1.2 1 280px;
}

.rotation-controls {
  display: flex;
  gap: 14px;
  align-items: end;
}

.rotation-speed {
  flex: 1;
  min-width: 160px;
}

.section-label {
  margin-bottom: 6px;
}

.pause-button {
  position: absolute;
  top: 10px;
  right: 32px;
  width: 104px;
  min-height: 28px;
}

.direction-row {
  display: flex;
  align-items: center;
  flex: 0 0 104px;
  gap: 6px;
}

.direction-label {
  color: var(--sub);
  font-size: 11px;
}

.muted {
  opacity: 0.55;
}

.app :deep(.el-segmented) {
  --el-segmented-bg-color: color-mix(in srgb, var(--primary) 8%, var(--panel));
  --el-segmented-item-selected-bg-color: var(--panel);
  --el-segmented-item-selected-color: var(--primary);
  --el-segmented-item-hover-color: var(--primary);
  --el-segmented-item-active-bg-color: color-mix(in srgb, var(--primary) 12%, var(--panel));
  --el-border-radius-base: 10px;
  width: 100%;
}

.app :deep(.el-segmented__item) {
  color: var(--sub);
  font-weight: 700;
}

.app :deep(.el-segmented__item-selected) {
  border: 1px solid color-mix(in srgb, var(--primary) 24%, transparent);
  color: var(--primary);
  box-shadow: 0 2px 8px -5px var(--btn-shadow);
}

.direction-row :deep(.el-segmented) {
  width: 72px;
  min-width: 72px;
}

.direction-row :deep(.el-segmented__item) {
  min-width: 32px;
  padding: 0 6px;
  font-size: 13px;
}

.app :deep(.el-button) {
  --el-button-bg-color: var(--panel);
  --el-button-border-color: var(--line);
  --el-button-text-color: var(--ink);
  --el-button-hover-border-color: var(--accent);
  --el-button-hover-text-color: var(--accent);
  --el-button-hover-bg-color: color-mix(in srgb, var(--primary) 6%, var(--panel));
  --el-button-active-border-color: var(--accent);
  --el-button-active-text-color: var(--accent);
  font-weight: 700;
}

.app :deep(.el-segmented.is-disabled) {
  opacity: 0.5;
}

.speed-head {
  margin-bottom: 7px;
}

input[type="range"] {
  display: block;
  width: 100%;
  height: 16px;
  outline: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

input[type="range"]::-webkit-slider-runnable-track {
  height: 5px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--primary) 18%, var(--line));
}

input[type="range"]::-webkit-slider-thumb {
  width: 16px;
  height: 16px;
  margin-top: -5.5px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  appearance: none;
  background: var(--accent);
  box-shadow: 0 0 0 1px var(--line);
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 1px var(--line);
  cursor: pointer;
}

input[type="range"]::-moz-range-track {
  height: 5px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--primary) 18%, var(--line));
}

input[type="color"] {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
}

.color-wrap {
  position: relative;
  height: 34px;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 8px;
  background-image:
    linear-gradient(45deg, #dddddd 25%, transparent 25%),
    linear-gradient(-45deg, #dddddd 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #dddddd 75%),
    linear-gradient(-45deg, transparent 75%, #dddddd 75%);
  background-position:
    0 0,
    0 6px,
    6px -6px,
    -6px 0;
  background-size: 12px 12px;
}

.swatches {
  display: flex;
  gap: 6px;
  margin-top: 1px;
}

.swatch {
  width: 22px;
  height: 22px;
  border: 1px solid var(--line);
  border-radius: 6px;
  cursor: pointer;
}

.preview {
  position: relative;
  grid-area: preview;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--preview-bg);
  transition: background 400ms ease;
}

.preview :deep(.moyo-blob),
.preview :deep(.moyo-cluster) {
  filter: var(--blob-shadow);
  width: min(560px, 72vmin) !important;
  height: min(560px, 72vmin) !important;
  transition:
    filter 400ms ease,
    background 400ms ease;
}

.hint {
  position: absolute;
  top: 18px;
  left: 24px;
  color: var(--sub);
  font-size: 12px;
}

.hint b {
  color: var(--ink);
  font-weight: 600;
}

.copy-row {
  position: absolute;
  right: 24px;
  bottom: 20px;
  display: flex;
  gap: 10px;
}

.copy-btn {
  padding: 8px 16px;
  border: 1px solid var(--line);
  border-radius: 9px;
  background: var(--panel);
  color: var(--ink);
  cursor: pointer;
  font: inherit;
  font-size: 12.5px;
  font-weight: 600;
  box-shadow: 0 2px 8px -2px rgba(0, 0, 0, 0.18);
  transition:
    border-color 150ms ease,
    color 150ms ease,
    background-color 150ms ease;
}

.copy-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.copy-btn.primary {
  border-color: var(--btn-ring);
  background: var(--primary);
  color: var(--on-primary);
  box-shadow: 0 4px 12px -3px var(--btn-shadow);
}

.copy-status {
  position: absolute;
  right: 24px;
  bottom: 62px;
  color: var(--sub);
  font-size: 12px;
  font-weight: 600;
}

@media (max-width: 959px) {
  :global(body) {
    overflow: auto;
  }

  .app {
    grid-template-areas:
      "header"
      "setup"
      "motion"
      "shape"
      "preview";
    grid-template-columns: 1fr;
    grid-template-rows: 56px auto auto auto minmax(420px, 1fr);
    min-height: 100vh;
    height: auto;
    overflow: visible;
  }

  .setup,
  .shape,
  .motion {
    border-right: 0;
    border-bottom: 1px solid var(--line);
    overflow: visible;
  }

  .motion {
    gap: 16px;
    overflow: visible;
  }

  .motion-top,
  .motion-bottom,
  .rotation-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .motion-bottom {
    padding-top: 14px;
  }

  .setup {
    align-items: stretch;
  }

  .bottom-fixed {
    margin-top: 28px;
  }

  .base-group,
  .morph-group,
  .rotation-group {
    flex-basis: 100%;
  }

  .base-group {
    padding-right: 0;
  }

  .pause-button {
    position: static;
    width: 100%;
  }

  .direction-row {
    flex-basis: auto;
  }

  .preview {
    min-height: 420px;
  }
}
</style>
