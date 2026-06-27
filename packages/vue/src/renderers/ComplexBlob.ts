import {
  generateBlobFrameData,
  interpolateBlobPoints,
  pointsToPath,
  type BaseMotion,
  type BlobFrame,
  type MotionData
} from "moyo";

export type ComplexAnimatorOptions = {
  complexity: number;
  distortion: number;
  seed: string | number;
  base: BaseMotion;
  speed: number;
  motion: MotionData;
  paused: () => boolean;
  onPath: (path: string) => void;
};

export function createComplexFrames(
  complexity: number,
  distortion: number,
  seed: string | number,
  base: BaseMotion = "wander"
): BlobFrame[] {
  return generateBlobFrameData(complexity, distortion, seed, 4, base);
}

export function startComplexPathAnimation(options: ComplexAnimatorOptions): () => void {
  const frames = createComplexFrames(options.complexity, options.distortion, options.seed, options.base);
  const duration = (options.motion.baseDuration / Math.max(options.speed, 0.1)) * 1000;
  let frameId = 0;
  let startedAt = performance.now();

  options.onPath(frames[0].path);

  const tick = (time: number) => {
    if (!options.paused()) {
      const elapsed = (time - startedAt) % duration;
      const frameProgress = elapsed / duration;
      const segment = frameProgress * frames.length;
      const currentIndex = Math.floor(segment) % frames.length;
      const nextIndex = (currentIndex + 1) % frames.length;
      const localProgress = segment - Math.floor(segment);
      const points = interpolateBlobPoints(frames[currentIndex].points, frames[nextIndex].points, localProgress);

      options.onPath(pointsToPath(points));
    } else {
      startedAt += 16;
    }

    frameId = requestAnimationFrame(tick);
  };

  frameId = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(frameId);
  };
}
