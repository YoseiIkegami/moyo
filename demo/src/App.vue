<template>
  <main class="app-shell">
    <section class="hero">
      <p class="eyebrow">Blob Studio v1.0 MVP</p>
      <h1>Organic SVG shapes for engineers.</h1>
      <p class="lead">
        Lightweight data exports and Vue components for soft, hand-held UI forms.
      </p>

      <div class="toolbar" aria-label="Demo controls">
        <label class="toggle">
          <input v-model="animated" type="checkbox" />
          <span>Animated</span>
        </label>

        <label class="field">
          <span>Animation</span>
          <select v-model="animationType" :disabled="!animated">
            <option v-for="type in animationTypes" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
        </label>
      </div>
    </section>

    <section class="shape-grid" aria-label="Blob Studio shapes">
      <article v-for="shape in shapes" :key="shape.id" class="shape-card">
        <div class="preview">
          <BlobShape
            :shape-id="shape.id"
            :color="controls[shape.id].color"
            :size="controls[shape.id].size"
            :animated="animated"
            :animation-type="animationType"
          />
        </div>

        <div class="card-copy">
          <div>
            <h2>{{ shape.name }}</h2>
            <p class="name-ja">{{ shape.nameJa }}</p>
          </div>
          <p>{{ shape.description }}</p>
        </div>

        <div class="tags" aria-label="Shape tags">
          <span v-for="tag in shape.tags" :key="tag">{{ tag }}</span>
        </div>

        <div class="controls">
          <label class="field">
            <span>Color</span>
            <input v-model="controls[shape.id].color" type="color" />
          </label>

          <label class="field">
            <span>Size {{ controls[shape.id].size }}px</span>
            <input
              v-model.number="controls[shape.id].size"
              type="range"
              min="64"
              max="180"
              step="4"
            />
          </label>
        </div>
      </article>
    </section>
  </main>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { listShapes } from "@blob-studio/js";
import { BlobShape } from "@blob-studio/vue";

type AnimationType = "float" | "spin" | "pulse" | "wiggle";
type ShapeControl = {
  color: string;
  size: number;
};

const shapes = listShapes();
const animationTypes: AnimationType[] = ["float", "spin", "pulse", "wiggle"];
const animated = ref(false);
const animationType = ref<AnimationType>("float");

const palette = ["#1f2937", "#2563eb", "#dc6bad", "#16a34a", "#f97316", "#7c3aed"];
const controls = reactive(
  Object.fromEntries(
    shapes.map((shape, index) => [
      shape.id,
      {
        color: palette[index % palette.length],
        size: 112
      }
    ])
  ) as Record<string, ShapeControl>
);
</script>

<style scoped>
:global(*) {
  box-sizing: border-box;
}

:global(body) {
  margin: 0;
  min-width: 320px;
  background: #f8fafc;
  color: #111827;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
}

.app-shell {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  padding: 56px 0;
}

.hero {
  display: grid;
  gap: 18px;
  margin-bottom: 36px;
}

.eyebrow {
  margin: 0;
  color: #6366f1;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

h1 {
  max-width: 760px;
  margin: 0;
  font-size: clamp(2.5rem, 7vw, 5.75rem);
  line-height: 0.92;
  letter-spacing: -0.08em;
}

.lead {
  max-width: 620px;
  margin: 0;
  color: #475569;
  font-size: 1.15rem;
  line-height: 1.7;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  align-items: center;
  padding: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  background: #ffffffcc;
  box-shadow: 0 18px 50px rgb(15 23 42 / 8%);
}

.toggle,
.field {
  display: inline-grid;
  gap: 6px;
  color: #334155;
  font-size: 0.86rem;
  font-weight: 700;
}

.toggle {
  grid-auto-flow: column;
  align-items: center;
  padding: 9px 12px;
  border-radius: 999px;
  background: #eef2ff;
}

.toggle input {
  width: 18px;
  height: 18px;
  accent-color: #6366f1;
}

.field input,
.field select {
  min-height: 36px;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  background: #fff;
  color: #0f172a;
  font: inherit;
}

.field input[type="color"] {
  width: 100%;
  padding: 3px;
}

.field input[type="range"] {
  width: 100%;
  accent-color: #6366f1;
}

.field select {
  padding: 0 36px 0 12px;
}

.shape-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 18px;
}

.shape-card {
  display: grid;
  gap: 18px;
  padding: 18px;
  border: 1px solid #e2e8f0;
  border-radius: 28px;
  background: #fff;
  box-shadow: 0 20px 60px rgb(15 23 42 / 7%);
}

.preview {
  display: grid;
  min-height: 190px;
  place-items: center;
  border-radius: 22px;
  background:
    radial-gradient(circle at 30% 20%, rgb(99 102 241 / 12%), transparent 32%),
    linear-gradient(135deg, #f8fafc, #eef2ff);
}

.card-copy {
  display: grid;
  gap: 8px;
}

.card-copy h2,
.card-copy p {
  margin: 0;
}

.card-copy h2 {
  font-size: 1.15rem;
}

.name-ja {
  color: #64748b;
  font-size: 0.88rem;
}

.card-copy > p {
  color: #475569;
  line-height: 1.6;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tags span {
  padding: 5px 9px;
  border-radius: 999px;
  background: #f1f5f9;
  color: #475569;
  font-size: 0.78rem;
  font-weight: 700;
}

.controls {
  display: grid;
  grid-template-columns: 88px 1fr;
  gap: 14px;
  align-items: end;
}
</style>
