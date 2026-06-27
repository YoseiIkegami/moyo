<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from "vue";
import {
  blobEngineBounds,
  buildPathAt,
  clusterPosition,
  generateClusterBalls,
  getMotion,
  type BaseMotion,
  type ClusterBall,
  type MotionData
} from "@ikg-systems/moyo";

const props = withDefaults(
  defineProps<{
    base?: string;
    color?: string;
    size?: number | string;
    morphSpeed?: number;
    spinSpeed?: number;
    reverse?: boolean;
    complexity?: number;
    edge?: number;
    spike?: number;
    paused?: boolean;
    seed?: string | number;
    count?: number;
    spread?: number;
  }>(),
  {
    base: "wander",
    color: "#5436DA",
    size: 160,
    morphSpeed: 1,
    spinSpeed: 0,
    reverse: false,
    complexity: 6,
    edge: 0.3,
    spike: 0.2,
    paused: false,
    seed: "moyo",
    count: 4,
    spread: 0.5
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
    console.warn(`[moyo] Unknown base motion "${id}". Falling back to "wander".`);
  }

  return getMotion("wander") as MotionData;
};

const uid = `moyo-goo-${Math.random().toString(36).slice(2)}`;
const balls = shallowRef<ClusterBall[]>([]);
const paths = ref<string[]>([]);
const rotation = ref("");
const motionData = computed(() => resolveMotion(props.base));
const sizeValue = computed(() => (typeof props.size === "number" ? `${props.size}px` : props.size));

let frameId = 0;
let startedAt = 0;
let pausedAt = 0;
let pausedAcc = 0;
let wasPaused = false;

const rebuildBalls = () => {
  balls.value = generateClusterBalls(props.count, props.complexity, props.seed);
  paths.value = balls.value.map(() => "");
};

const renderFrame = (now: number) => {
  if (props.paused && !wasPaused) {
    pausedAt = now;
    wasPaused = true;
  } else if (!props.paused && wasPaused) {
    pausedAcc += now - pausedAt;
    wasPaused = false;
  }

  const activeNow = props.paused ? pausedAt : now;
  const elapsedSeconds = Math.max((activeNow - startedAt - pausedAcc) / 1000, 0);
  const morphSpeed = Math.max(props.morphSpeed, 0.1);
  const spinSpeed = Math.max(props.spinSpeed, 0);
  const t = elapsedSeconds * morphSpeed;
  const base = motionData.value.id as BaseMotion;

  paths.value = balls.value.map((ball) =>
    buildPathAt(
      ball.pts,
      t,
      {
        base,
        edge: props.edge,
        spike: props.spike
      },
      clusterPosition(ball, elapsedSeconds, morphSpeed, props.spread),
      ball.r
    )
  );

  if (spinSpeed > 0) {
    const direction = props.reverse ? -1 : 1;
    const degrees = elapsedSeconds * spinSpeed * 40 * direction;
    rotation.value = `rotate(${degrees} ${blobEngineBounds.cx} ${blobEngineBounds.cy})`;
  } else {
    rotation.value = "";
  }

  frameId = requestAnimationFrame(renderFrame);
};

watch(
  () => [props.count, props.complexity, props.seed],
  () => {
    rebuildBalls();
  }
);

onMounted(() => {
  rebuildBalls();
  startedAt = performance.now();
  frameId = requestAnimationFrame(renderFrame);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(frameId);
});
</script>

<template>
  <svg
    class="moyo-cluster"
    :style="{ width: sizeValue, height: sizeValue }"
    :viewBox="blobEngineBounds.viewBox"
    aria-hidden="true"
    data-moyo-renderer="cluster"
  >
    <defs>
      <filter :id="uid">
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
    <g :filter="`url(#${uid})`" :transform="rotation || undefined">
      <path v-for="(d, index) in paths" :key="index" :d="d" :fill="color" />
    </g>
  </svg>
</template>

<style>
.moyo-cluster {
  display: inline-block;
  flex: 0 0 auto;
  overflow: visible;
  transform-origin: center;
  will-change: filter;
}
</style>
