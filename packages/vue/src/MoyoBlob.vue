<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import { getMotion, type BaseMotion, type MotionData, type MotionLayerConfig } from "moyo";
import {
  buildLayerAnimations,
  buildSimpleAnimation,
  injectSimpleMotionStyle,
  sanitizeKeyframeId
} from "./renderers/SimpleBlob";
import { createComplexFrames, startComplexPathAnimation } from "./renderers/ComplexBlob";

const props = withDefaults(
  defineProps<{
    base?: string;
    spin?: { speed: number; reverse?: boolean } | boolean;
    pulse?: { scale: number } | boolean;
    color?: string;
    size?: number | string;
    speed?: number;
    complexity?: number;
    distortion?: number;
    paused?: boolean;
    seed?: string | number;
  }>(),
  {
    base: "wander",
    spin: false,
    pulse: false,
    color: "#5436DA",
    size: 160,
    speed: 1,
    complexity: 4,
    distortion: 0.4,
    paused: false,
    seed: "moyo"
  }
);

const shouldWarn = () =>
  typeof process === "undefined" || process.env?.NODE_ENV !== "production";

const resolveMotion = (id: string): MotionData => {
  const motion = getMotion(id);

  if (motion) {
    return motion;
  }

  if (shouldWarn()) {
    console.warn(`[moyo] Unknown motion "${id}". Falling back to "wander".`);
  }

  return getMotion("wander") as MotionData;
};

const motionData = computed(() => resolveMotion(props.base));
const isSimple = computed(() => props.complexity <= 5);
const keyframeName = computed(() => `moyo-${sanitizeKeyframeId(motionData.value.id)}`);
const sizeValue = computed(() => (typeof props.size === "number" ? `${props.size}px` : props.size));
const normalizedLayers = computed<MotionLayerConfig>(() => ({
  ...(props.spin
    ? {
        spin:
          typeof props.spin === "boolean"
            ? { speed: 1 }
            : { speed: props.spin.speed, reverse: props.spin.reverse }
      }
    : {}),
  ...(props.pulse
    ? {
        pulse: typeof props.pulse === "boolean" ? { scale: 1.14 } : { scale: props.pulse.scale }
      }
    : {})
}));
const layerAnimation = computed(() => buildLayerAnimations(normalizedLayers.value, props.speed).join(", "));
const complexPath = ref("");

const simpleStyle = computed(() => ({
  width: sizeValue.value,
  height: sizeValue.value,
  background: props.color,
  borderRadius: motionData.value.keyframes[0],
  animation: buildSimpleAnimation(motionData.value, keyframeName.value, normalizedLayers.value, props.speed),
  animationPlayState: props.paused ? "paused" : "running",
  "--moyo-pulse-scale": normalizedLayers.value.pulse?.scale ?? 1.14
}));

const complexStyle = computed(() => ({
  width: sizeValue.value,
  height: sizeValue.value,
  animation: layerAnimation.value || undefined,
  animationPlayState: props.paused ? "paused" : "running",
  "--moyo-pulse-scale": normalizedLayers.value.pulse?.scale ?? 1.14
}));

watchEffect(() => {
  if (!isSimple.value) {
    return;
  }

  injectSimpleMotionStyle(motionData.value, keyframeName.value);
});

watchEffect((onCleanup) => {
  if (isSimple.value) {
    return;
  }

  const frames = createComplexFrames(props.complexity, props.distortion, props.seed, motionData.value.id as BaseMotion);
  complexPath.value = frames[0].path;

  const stop = startComplexPathAnimation({
    complexity: props.complexity,
    distortion: props.distortion,
    seed: props.seed,
    base: motionData.value.id as BaseMotion,
    speed: props.speed,
    motion: motionData.value,
    paused: () => props.paused,
    onPath: (path) => {
      complexPath.value = path;
    }
  });

  onCleanup(stop);
});
</script>

<template>
  <div
    v-if="isSimple"
    class="moyo-blob moyo-blob--simple"
    :style="simpleStyle"
    aria-hidden="true"
    data-moyo-renderer="simple"
  />
  <svg
    v-else
    class="moyo-blob moyo-blob--complex"
    :style="complexStyle"
    viewBox="0 0 100 100"
    aria-hidden="true"
    data-moyo-renderer="complex"
  >
    <path :d="complexPath" :fill="color" />
  </svg>
</template>

<style>
.moyo-blob {
  display: inline-block;
  flex: 0 0 auto;
  transform-origin: center;
  will-change: border-radius, rotate, scale;
}

.moyo-blob--complex {
  overflow: visible;
}

@media (prefers-reduced-motion: reduce) {
  .moyo-blob {
    animation: none !important;
  }
}

@keyframes moyo-spin {
  to {
    rotate: 360deg;
  }
}

@keyframes moyo-pulse {
  0%,
  100% {
    scale: 1;
  }

  50% {
    scale: var(--moyo-pulse-scale, 1.14);
  }
}
</style>
