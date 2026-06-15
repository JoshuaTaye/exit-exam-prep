import type { Difficulty } from "./constants";

export function masteryColor(m: number): string {
  if (m >= 85) return "hsl(var(--success))";
  if (m >= 75) return "hsl(160 70% 42%)";
  if (m >= 60) return "hsl(var(--warning))";
  if (m > 0) return "hsl(var(--destructive))";
  return "hsl(var(--muted-foreground))";
}

export function masteryBg(m: number, attempted = 1): string {
  if (attempted === 0) return "bg-muted text-muted-foreground";
  if (m >= 85) return "bg-success/15 text-success";
  if (m >= 75) return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400";
  if (m >= 60) return "bg-warning/15 text-[hsl(38_92%_38%)]";
  return "bg-destructive/10 text-destructive";
}

export const difficultyVariant: Record<Difficulty, "success" | "default" | "warning" | "destructive"> = {
  Easy: "success",
  Medium: "default",
  Hard: "warning",
  "Very Hard": "destructive",
};

export const bandLabel: Record<string, string> = {
  strong: "Strong",
  moderate: "Moderate",
  weak: "Weak",
  untested: "Untested",
};
export const bandVariant: Record<string, "success" | "warning" | "destructive" | "muted"> = {
  strong: "success",
  moderate: "warning",
  weak: "destructive",
  untested: "muted",
};
