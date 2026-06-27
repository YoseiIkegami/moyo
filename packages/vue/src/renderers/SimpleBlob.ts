import type { MotionData, MotionLayerConfig } from "moyo";

const injectedKeyframes = new Set<string>();

export const sanitizeKeyframeId = (id: string) => id.replace(/[^a-zA-Z0-9_-]/g, "-");

export const seconds = (duration: number, speed: number) => `${duration / Math.max(speed, 0.1)}s`;

export function buildRadiusKeyframes(motion: MotionData, name: string): string {
  const steps = [`0%, 100% { border-radius: ${motion.keyframes[0]}; }`];
  const divisor = motion.keyframes.length;

  motion.keyframes.slice(1).forEach((radius, index) => {
    steps.push(`${Math.round(((index + 1) / divisor) * 100)}% { border-radius: ${radius}; }`);
  });

  return `@keyframes ${name} { ${steps.join(" ")} }`;
}

export function injectSimpleMotionStyle(motion: MotionData, name: string): void {
  if (typeof document === "undefined" || injectedKeyframes.has(name)) {
    return;
  }

  if (document.querySelector(`style[data-moyo-motion="${name}"]`)) {
    injectedKeyframes.add(name);
    return;
  }

  const style = document.createElement("style");
  style.dataset.moyoMotion = name;
  style.textContent = buildRadiusKeyframes(motion, name);
  document.head.appendChild(style);
  injectedKeyframes.add(name);
}

export function buildLayerAnimations(layers: MotionLayerConfig, speed: number): string[] {
  const animations: string[] = [];

  if (layers.spin) {
    const direction = layers.spin.reverse ? "reverse" : "normal";
    animations.push(`moyo-spin ${seconds(12 / Math.max(layers.spin.speed, 0.1), speed)} linear infinite ${direction}`);
  }

  if (layers.pulse) {
    animations.push(`moyo-pulse ${seconds(4, speed)} ease-in-out infinite`);
  }

  return animations;
}

export function buildSimpleAnimation(motion: MotionData, keyframeName: string, layers: MotionLayerConfig, speed: number) {
  return [
    `${keyframeName} ${seconds(motion.baseDuration, speed)} ease-in-out infinite`,
    ...buildLayerAnimations(layers, speed)
  ].join(", ");
}
