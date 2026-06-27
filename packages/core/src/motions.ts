export type BaseMotion = "breathe" | "wander" | "churn";

export type MotionLayerConfig = {
  spin?: { speed: number; reverse?: boolean };
  pulse?: { scale: number };
};

export type MotionConfig = {
  base: BaseMotion;
  layers: MotionLayerConfig;
};

export type MotionData = {
  id: BaseMotion;
  name: string;
  keyframes: string[];
  baseDuration: number;
};

const wanderKeyframes = [
  "60% 40% 30% 70% / 60% 30% 70% 40%",
  "30% 60% 70% 40% / 50% 60% 30% 60%",
  "50% 60% 30% 60% / 30% 60% 70% 40%",
  "60% 40% 60% 30% / 70% 30% 50% 60%"
];

const churnKeyframes = [
  "70% 30% 46% 54% / 30% 64% 36% 70%",
  "34% 66% 70% 30% / 60% 40% 60% 40%",
  "64% 36% 30% 70% / 36% 70% 30% 64%",
  "40% 60% 64% 36% / 70% 34% 66% 30%",
  "56% 44% 36% 64% / 44% 60% 40% 56%"
];

export const motions: Record<BaseMotion, MotionData> = {
  breathe: {
    id: "breathe",
    name: "Breathe",
    keyframes: [
      "58% 42% 44% 56% / 56% 44% 56% 44%",
      "46% 54% 56% 44% / 50% 56% 44% 50%"
    ],
    baseDuration: 6
  },
  wander: {
    id: "wander",
    name: "Wander",
    keyframes: wanderKeyframes,
    baseDuration: 8
  },
  churn: {
    id: "churn",
    name: "Churn",
    keyframes: churnKeyframes,
    baseDuration: 7
  }
};

export function isBaseMotion(id: string): id is BaseMotion {
  return id === "breathe" || id === "wander" || id === "churn";
}

export function getMotion(id: string): MotionData | undefined {
  return isBaseMotion(id) ? motions[id] : undefined;
}

export function listMotions(): MotionData[] {
  return Object.values(motions);
}
