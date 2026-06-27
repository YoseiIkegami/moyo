import type { BaseMotion } from "./motions";

export type BlobPoint = {
  x: number;
  y: number;
};

export type BlobFrame = {
  points: BlobPoint[];
  path: string;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const hashSeed = (seed: string | number) => {
  const source = String(seed);
  let hash = 2166136261;

  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
};

const createRandom = (seed: string | number) => {
  let state = hashSeed(seed);

  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);

    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
};

const round = (value: number) => Math.round(value * 1000) / 1000;

const motionDistortionScale: Record<BaseMotion, number> = {
  breathe: 0.55,
  wander: 1,
  churn: 1.25
};

export function pointsToPath(points: BlobPoint[]): string {
  const count = points.length;
  const smoothing = 0.28;
  const segments: string[] = [`M ${round(points[0].x)} ${round(points[0].y)}`];

  for (let index = 0; index < count; index += 1) {
    const current = points[index];
    const next = points[(index + 1) % count];
    const previous = points[(index - 1 + count) % count];
    const afterNext = points[(index + 2) % count];

    const cp1 = {
      x: current.x + (next.x - previous.x) * smoothing,
      y: current.y + (next.y - previous.y) * smoothing
    };
    const cp2 = {
      x: next.x - (afterNext.x - current.x) * smoothing,
      y: next.y - (afterNext.y - current.y) * smoothing
    };

    segments.push(
      `C ${round(cp1.x)} ${round(cp1.y)} ${round(cp2.x)} ${round(cp2.y)} ${round(next.x)} ${round(next.y)}`
    );
  }

  return `${segments.join(" ")} Z`;
}

export function generateBlobPoints(
  complexity: number,
  distortion: number,
  seed: string | number = "moyo",
  motion: BaseMotion = "wander"
): BlobPoint[] {
  const pointCount = Math.round(clamp(complexity, 3, 12));
  const amount = clamp(distortion * motionDistortionScale[motion], 0, 1);
  const random = createRandom(seed);
  const center = 50;
  const baseRadius = 34;

  return Array.from({ length: pointCount }, (_, index) => {
    const angle = (Math.PI * 2 * index) / pointCount - Math.PI / 2;
    const wobble = (random() * 2 - 1) * amount;
    const radius = baseRadius * (1 + wobble * 0.42);

    return {
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius
    };
  });
}

export function generateBlobPath(
  complexity: number,
  distortion: number,
  seed: string | number = "moyo",
  motion: BaseMotion = "wander"
): string {
  return pointsToPath(generateBlobPoints(complexity, distortion, seed, motion));
}

export function generateBlobFrameData(
  complexity: number,
  distortion: number,
  seed: string | number = "moyo",
  frames = 4,
  motion: BaseMotion = "wander"
): BlobFrame[] {
  const frameCount = Math.max(Math.round(frames), 2);

  return Array.from({ length: frameCount }, (_, index) => {
    const points = generateBlobPoints(complexity, distortion, `${seed}:${motion}:${index}`, motion);

    return {
      points,
      path: pointsToPath(points)
    };
  });
}

export function generateBlobFrames(
  complexity: number,
  distortion: number,
  seed: string | number = "moyo",
  frames = 4,
  motion: BaseMotion = "wander"
): string[] {
  return generateBlobFrameData(complexity, distortion, seed, frames, motion).map((frame) => frame.path);
}

export function interpolateBlobPoints(from: BlobPoint[], to: BlobPoint[], progress: number): BlobPoint[] {
  const amount = clamp(progress, 0, 1);

  return from.map((point, index) => {
    const target = to[index] ?? point;

    return {
      x: point.x + (target.x - point.x) * amount,
      y: point.y + (target.y - point.y) * amount
    };
  });
}
