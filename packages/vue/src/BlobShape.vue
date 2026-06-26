<template>
  <svg
    :viewBox="viewBox"
    :width="size"
    :height="size"
    :class="['blob-shape', animationClass, { 'blob-animated': animated }]"
    role="img"
    aria-hidden="true"
  >
    <path :d="pathData" :fill="color" :opacity="opacity" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { getShape } from "@blob-studio/js";

interface Props {
  shapeId: string;
  color?: string;
  size?: number | string;
  opacity?: number;
  animated?: boolean;
  animationType?: "float" | "spin" | "pulse" | "wiggle";
}

const props = withDefaults(defineProps<Props>(), {
  color: "#1f2937",
  size: 100,
  opacity: 1,
  animated: false,
  animationType: "float"
});

const shape = computed(() => getShape(props.shapeId));
const pathData = computed(() => shape.value?.path ?? "");
const viewBox = computed(() => shape.value?.viewBox ?? "0 0 100 100");
const animationClass = computed(() =>
  props.animated ? `blob-animated--${props.animationType}` : ""
);
</script>

<style scoped>
.blob-shape {
  display: block;
  transform-origin: center;
  transition:
    opacity 0.2s ease,
    transform 0.2s ease,
    fill 0.2s ease;
}

.blob-animated {
  will-change: transform, opacity;
}

.blob-animated--float {
  animation: blob-float 3.8s ease-in-out infinite;
}

.blob-animated--spin {
  animation: blob-spin 8s linear infinite;
}

.blob-animated--pulse {
  animation: blob-pulse 2.4s ease-in-out infinite;
}

.blob-animated--wiggle {
  animation: blob-wiggle 1.8s ease-in-out infinite;
}

@keyframes blob-float {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-8%);
  }
}

@keyframes blob-spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@keyframes blob-pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }

  50% {
    transform: scale(1.08);
    opacity: 0.82;
  }
}

@keyframes blob-wiggle {
  0%,
  100% {
    transform: rotate(0deg) scale(1);
  }

  25% {
    transform: rotate(-4deg) scale(1.02);
  }

  75% {
    transform: rotate(4deg) scale(0.98);
  }
}
</style>
