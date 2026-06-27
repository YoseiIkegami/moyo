export type BaseMotion = "breathe" | "wander" | "churn";

export type MotionData = {
  id: BaseMotion;
  name: string;
  baseDuration: number;
};

export const motions: Record<BaseMotion, MotionData> = {
  breathe: {
    id: "breathe",
    name: "Breathe",
    baseDuration: 6
  },
  wander: {
    id: "wander",
    name: "Wander",
    baseDuration: 8
  },
  churn: {
    id: "churn",
    name: "Churn",
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
