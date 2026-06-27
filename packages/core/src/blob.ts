import type { BaseMotion } from "./motions";

export type BlobPoint = {
  ang: number;
  inAmt: number;
  outAmt: number;
  phase: number;
  phaseOut: number;
  freq: number;
  freqOut: number;
};

export type BlobRenderParams = {
  base: BaseMotion;
  edge: number;
  spike: number;
};

export type CartesianPoint = {
  x: number;
  y: number;
};

export type ClusterBall = {
  dir: number;
  r: number;
  breathPhase: number;
  breathSpeed: number;
  pts: BlobPoint[];
};

export const blobEngineBounds = {
  viewBox: "0 0 400 400",
  cx: 200,
  cy: 200,
  baseR: 110,
  minR: 40,
  maxR: 175
} as const;

const tau = Math.PI * 2;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function hashSeed(seed: string | number): number {
  const source = String(seed);
  let hash = 2166136261;

  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

export function createSeededRandom(seed: string | number): () => number {
  let state = hashSeed(seed);

  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);

    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

const round = (value: number) => Math.round(value * 10) / 10;

export function generateBlobPoints(complexity: number, seed: string | number = "moyo"): BlobPoint[] {
  const count = Math.round(clamp(complexity, 3, 64));
  const random = createSeededRandom(seed);

  return Array.from({ length: count }, (_, index) => ({
    ang: (index / count) * tau,
    inAmt: random(),
    outAmt: random(),
    phase: random() * tau,
    phaseOut: random() * tau,
    freq: 0.7 + random() * 0.9,
    freqOut: 0.7 + random() * 0.9
  }));
}

export function radiusAt(point: BlobPoint, t: number, params: BlobRenderParams): number {
  const edge = clamp(params.edge, 0, 1);
  const spike = clamp(params.spike, 0, 1);
  let cycleIn: number;
  let cycleOut: number;

  if (params.base === "breathe") {
    const g = (Math.sin(t) + 1) / 2;
    cycleIn = g;
    cycleOut = g;
  } else if (params.base === "wander") {
    const travel = point.ang * 2 - t * 1.2;
    cycleIn = (Math.sin(travel) + 1) / 2;
    cycleOut = (Math.sin(travel + point.ang * 1.5 + 1.7) + 1) / 2;
  } else {
    cycleIn = (Math.sin(t * point.freq + point.phase) + 1) / 2;
    cycleOut = (Math.sin(t * point.freqOut + point.phaseOut) + 1) / 2;
  }

  const inner = blobEngineBounds.baseR * edge * point.inAmt * cycleIn;
  const outer = blobEngineBounds.baseR * spike * point.outAmt * cycleOut;
  const radius = blobEngineBounds.baseR - inner + outer;

  return clamp(radius, blobEngineBounds.minR, blobEngineBounds.maxR);
}

export function pointAt(point: BlobPoint, t: number, params: BlobRenderParams): CartesianPoint {
  const radius = radiusAt(point, t, params);

  return {
    x: blobEngineBounds.cx + Math.cos(point.ang) * radius,
    y: blobEngineBounds.cy + Math.sin(point.ang) * radius
  };
}

export function pointAtPosition(
  point: BlobPoint,
  t: number,
  params: BlobRenderParams,
  center: CartesianPoint,
  scale = 1
): CartesianPoint {
  const radius = radiusAt(point, t, params) * scale;

  return {
    x: center.x + Math.cos(point.ang) * radius,
    y: center.y + Math.sin(point.ang) * radius
  };
}

export function buildPathAt(
  points: BlobPoint[],
  t: number,
  params: BlobRenderParams,
  center: CartesianPoint = { x: blobEngineBounds.cx, y: blobEngineBounds.cy },
  scale = 1
): string {
  const count = points.length;

  if (count === 0) {
    return "";
  }

  const coords = points.map((point) => pointAtPosition(point, t, params, center, scale));
  const k = 1 / 6;
  const segments = [`M ${round(coords[0].x)} ${round(coords[0].y)}`];

  for (let index = 0; index < count; index += 1) {
    const p0 = coords[(index - 1 + count) % count];
    const p1 = coords[index];
    const p2 = coords[(index + 1) % count];
    const p3 = coords[(index + 2) % count];
    const c1 = {
      x: p1.x + (p2.x - p0.x) * k,
      y: p1.y + (p2.y - p0.y) * k
    };
    const c2 = {
      x: p2.x - (p3.x - p1.x) * k,
      y: p2.y - (p3.y - p1.y) * k
    };

    segments.push(
      `C ${round(c1.x)} ${round(c1.y)} ${round(c2.x)} ${round(c2.y)} ${round(p2.x)} ${round(p2.y)}`
    );
  }

  return `${segments.join(" ")} Z`;
}

export function buildPath(points: BlobPoint[], t: number, params: BlobRenderParams): string {
  return buildPathAt(points, t, params);
}

export function clusterPointCount(count: number, complexity: number): number {
  const ballCount = Math.round(clamp(count, 2, 16));
  const perBallCap = ballCount > 10 ? 10 : 14;

  return Math.round(clamp(Math.round(complexity * 0.6), 5, perBallCap));
}

export function generateClusterBalls(
  count: number,
  complexity: number,
  seed: string | number = "moyo"
): ClusterBall[] {
  const ballCount = Math.round(clamp(count, 2, 16));
  const random = createSeededRandom(seed);
  const pointCount = clusterPointCount(ballCount, complexity);

  return Array.from({ length: ballCount }, (_, index) => ({
    dir: (index / ballCount) * tau + random() * 0.5,
    r: 0.4 + random() * 0.35,
    breathPhase: random() * tau,
    breathSpeed: 0.6 + random() * 0.8,
    pts: Array.from({ length: pointCount }, (__, pointIndex) => ({
      ang: (pointIndex / pointCount) * tau,
      inAmt: random(),
      outAmt: random(),
      phase: random() * tau,
      phaseOut: random() * tau,
      freq: 0.7 + random() * 0.9,
      freqOut: 0.7 + random() * 0.9
    }))
  }));
}

export function clusterPosition(
  ball: ClusterBall,
  elapsedSeconds: number,
  morphSpeed: number,
  spread: number
): CartesianPoint {
  const maxDist = 40 + clamp(spread, 0, 1) * 120;
  const breath = (Math.sin(elapsedSeconds * ball.breathSpeed * morphSpeed + ball.breathPhase) + 1) / 2;
  const dist = maxDist * breath;

  return {
    x: blobEngineBounds.cx + Math.cos(ball.dir) * dist,
    y: blobEngineBounds.cy + Math.sin(ball.dir) * dist
  };
}
