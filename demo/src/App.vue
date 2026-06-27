<template>
  <main class="app">
    <header class="header">
      <div class="logo">MOYO</div>
    </header>

    <section class="blank" aria-hidden="true">
      <!-- reserved: intentionally blank -->
    </section>

    <section class="shape" aria-label="Shape parameters">
      <div class="group-label">Shape</div>
      <div class="shape-row">
        <label class="field color-field">
          <div class="field-head"><span>Color</span></div>
          <input v-model="color" type="color" />
        </label>

        <label class="field grow">
          <div class="field-head">
            <span>Size</span>
            <span class="v">{{ size }}px</span>
          </div>
          <input v-model.number="size" type="range" min="40" max="240" step="4" />
        </label>

        <label class="field grow">
          <div class="field-head">
            <span>Complexity</span>
            <span class="v">{{ complexity }}</span>
          </div>
          <input v-model.number="complexity" type="range" min="3" max="12" step="1" />
        </label>

        <label class="field grow">
          <div class="field-head">
            <span>Distortion</span>
            <span class="v">{{ distortion.toFixed(2) }}</span>
          </div>
          <input v-model.number="distortion" type="range" min="0" max="1" step="0.05" />
        </label>
      </div>
    </section>

    <section class="motion" aria-label="Motion parameters">
      <div>
        <div class="section-label">Base motion</div>
        <div class="base-options" role="radiogroup" aria-label="Base motion">
          <label v-for="motion in baseMotions" :key="motion.id" class="base-option">
            <input v-model="base" type="radio" name="base-motion" :value="motion.id" />
            <span class="base-btn">{{ motion.name }}</span>
          </label>
        </div>
      </div>

      <div>
        <div class="section-label">Layers</div>
        <label class="check">
          <input v-model="spinEnabled" type="checkbox" />
          <span>spin</span>
        </label>
        <label class="check sub" :class="{ muted: !spinEnabled }">
          <input v-model="spinReverse" type="checkbox" :disabled="!spinEnabled" />
          <span>reverse</span>
        </label>
        <label class="check">
          <input v-model="pulseEnabled" type="checkbox" />
          <span>pulse</span>
        </label>
      </div>

      <div>
        <div class="speed-head">
          <span>Speed</span>
          <span class="v">{{ speed.toFixed(1) }}x</span>
        </div>
        <input v-model.number="speed" type="range" min="0.3" max="2.5" step="0.1" />
      </div>

      <label class="check">
        <input v-model="paused" type="checkbox" />
        <span>paused</span>
      </label>
    </section>

    <section class="preview" aria-label="Moyo preview">
      <div class="hint"><b>Choose motion, not shape.</b> The object stays nameless.</div>

      <MoyoBlob
        :base="base"
        :spin="spinProp"
        :pulse="pulseProp"
        :color="color"
        :size="size"
        :speed="speed"
        :complexity="complexity"
        :distortion="distortion"
        :paused="paused"
        seed="builder"
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
import { generateBlobFrames, getMotion, listMotions, type BaseMotion, type MotionData } from "moyo";
import { MoyoBlob } from "@moyo/vue";

const baseMotions = listMotions();
const color = ref("#5436DA");
const size = ref(160);
const complexity = ref(4);
const distortion = ref(0.4);
const speed = ref(1);
const paused = ref(false);
const base = ref<BaseMotion>("wander");
const spinEnabled = ref(false);
const spinReverse = ref(false);
const pulseEnabled = ref(false);
const copiedLabel = ref("");

const motion = computed(() => getMotion(base.value) ?? (getMotion("wander") as MotionData));
const isSimple = computed(() => complexity.value <= 5);
const outputLabel = computed(() => (isSimple.value ? "CSS" : "SVG"));
const spinProp = computed(() => (spinEnabled.value ? { speed: 1, reverse: spinReverse.value } : false));
const pulseProp = computed(() => (pulseEnabled.value ? { scale: 1.14 } : false));

const buildRadiusKeyframes = (motionData: MotionData, name: string) => {
  const steps = [`0%, 100% { border-radius: ${motionData.keyframes[0]}; }`];
  const divisor = motionData.keyframes.length;

  motionData.keyframes.slice(1).forEach((radius, index) => {
    steps.push(`${Math.round(((index + 1) / divisor) * 100)}% { border-radius: ${radius}; }`);
  });

  return `@keyframes ${name} {\n  ${steps.join("\n  ")}\n}`;
};

const layerAnimations = () => {
  const animations: string[] = [];

  if (spinEnabled.value) {
    const direction = spinReverse.value ? " reverse" : "";
    animations.push(`moyo-spin ${12 / speed.value}s linear infinite${direction}`);
  }

  if (pulseEnabled.value) {
    animations.push(`moyo-pulse ${4 / speed.value}s ease-in-out infinite`);
  }

  return animations;
};

const layerKeyframes = () => {
  const parts: string[] = [];

  if (spinEnabled.value) {
    parts.push("@keyframes moyo-spin {\n  to { rotate: 360deg; }\n}");
  }

  if (pulseEnabled.value) {
    parts.push("@keyframes moyo-pulse {\n  0%, 100% { scale: 1; }\n  50% { scale: 1.14; }\n}");
  }

  return parts.join("\n\n");
};

const buildCssSnippet = () => {
  const animation = [
    `moyo-${base.value} ${motion.value.baseDuration / speed.value}s ease-in-out infinite`,
    ...layerAnimations()
  ].join(", ");
  const extra = layerKeyframes();

  return `${buildRadiusKeyframes(motion.value, `moyo-${base.value}`)}${extra ? `\n\n${extra}` : ""}

.moyo-blob {
  width: ${size.value}px;
  height: ${size.value}px;
  background: ${color.value};
  border-radius: ${motion.value.keyframes[0]};
  animation: ${animation};
  animation-play-state: ${paused.value ? "paused" : "running"};
}`;
};

const buildSvgSnippet = () => {
  const frames = generateBlobFrames(complexity.value, distortion.value, "builder", 4, base.value);
  const layerCss = layerKeyframes();
  const animation = layerAnimations().join(", ");

  return `<svg class="moyo-blob" viewBox="0 0 100 100" width="${size.value}" height="${size.value}">
  <path fill="${color.value}" d="${frames[0]}">
    <animate
      attributeName="d"
      dur="${motion.value.baseDuration / speed.value}s"
      repeatCount="indefinite"
      values="${frames.join(";")}"
    />
  </path>
</svg>
<style>
.moyo-blob {
  animation: ${animation || "none"};
  animation-play-state: ${paused.value ? "paused" : "running"};
}
${layerCss}
</style>`;
};

const spinSnippet = () => {
  if (!spinEnabled.value) {
    return "";
  }

  return spinReverse.value ? ' :spin="{ speed: 1, reverse: true }"' : " spin";
};

const pulseSnippet = () => (pulseEnabled.value ? " pulse" : "");

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
    `<MoyoBlob base="${base.value}"${spinSnippet()}${pulseSnippet()} color="${color.value}" :size="${size.value}" :speed="${speed.value}" :complexity="${complexity.value}" :distortion="${distortion.value}"${paused.value ? " paused" : ""} />`
  );

const copyOutput = () => copyText(outputLabel.value, isSimple.value ? buildCssSnippet() : buildSvgSnippet());
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
  --preview-bg: #f4f3f7;
  --ink: #1a1c22;
  --sub: #9a9ba3;
  --line: #ecebef;
  --accent: v-bind(color);

  display: grid;
  grid-template-areas:
    "header header"
    "blank shape"
    "motion preview";
  grid-template-columns: 220px 1fr;
  grid-template-rows: 56px auto 1fr;
  height: 100vh;
  overflow: hidden;
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

.blank {
  grid-area: blank;
}

.shape {
  grid-area: shape;
  padding: 20px 32px 22px;
  border-bottom: 1px solid var(--line);
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

.shape-row {
  display: flex;
  flex-wrap: wrap;
  gap: 36px;
  align-items: flex-end;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 7px;
  min-width: 150px;
}

.color-field {
  min-width: 120px;
}

.field.grow {
  flex: 1;
  min-width: 180px;
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
  grid-area: motion;
  display: flex;
  flex-direction: column;
  gap: 26px;
  overflow-y: auto;
  padding: 26px 20px;
  border-right: 1px solid var(--line);
}

.section-label {
  margin-bottom: 11px;
}

.base-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.base-option input {
  position: absolute;
  opacity: 0;
}

.base-btn {
  display: block;
  width: 100%;
  padding: 11px 14px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: #ffffff;
  color: var(--ink);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  transition:
    border-color 150ms ease,
    background-color 150ms ease,
    box-shadow 150ms ease,
    color 150ms ease;
}

.base-btn:hover {
  border-color: #d9d7e4;
}

.base-option input:checked + .base-btn {
  border-color: var(--accent);
  background: var(--accent);
  color: #ffffff;
  font-weight: 600;
  box-shadow: 0 4px 12px -4px color-mix(in srgb, var(--accent) 50%, transparent);
}

.check {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 3px 0;
  color: var(--ink);
  cursor: pointer;
  font-size: 13px;
}

.check input {
  width: 15px;
  height: 15px;
  accent-color: var(--accent);
}

.check.sub {
  margin-left: 24px;
  color: var(--sub);
  font-size: 12px;
}

.muted {
  opacity: 0.55;
}

.speed-head {
  margin-bottom: 8px;
}

input[type="range"] {
  width: 100%;
  height: 4px;
  border-radius: 4px;
  outline: none;
  appearance: none;
  background: var(--line);
}

input[type="range"]::-webkit-slider-thumb {
  width: 16px;
  height: 16px;
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

input[type="color"] {
  width: 100%;
  height: 34px;
  padding: 3px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: none;
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
}

.preview :deep(.moyo-blob) {
  filter: drop-shadow(0 18px 30px color-mix(in srgb, var(--accent) 25%, transparent));
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
  background: #ffffff;
  color: var(--ink);
  cursor: pointer;
  font: inherit;
  font-size: 12.5px;
  font-weight: 500;
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
  border-color: var(--accent);
  background: var(--accent);
  color: #ffffff;
}

.copy-status {
  position: absolute;
  right: 24px;
  bottom: 62px;
  color: var(--sub);
  font-size: 12px;
  font-weight: 600;
}

@media (max-width: 860px) {
  :global(body) {
    overflow: auto;
  }

  .app {
    grid-template-areas:
      "header"
      "shape"
      "motion"
      "preview";
    grid-template-columns: 1fr;
    grid-template-rows: 56px auto auto minmax(420px, 1fr);
    min-height: 100vh;
    height: auto;
    overflow: visible;
  }

  .blank {
    display: none;
  }

  .shape-row {
    gap: 18px;
  }

  .motion {
    border-right: 0;
    border-bottom: 1px solid var(--line);
  }
}
</style>
