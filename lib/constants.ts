export const DIFFICULTIES = ["Easy", "Medium", "Hard", "Very Hard"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export const QUESTION_TYPES = [
  "MCQ",
  "Scenario",
  "Case Study",
  "Problem Solving",
] as const;
export type QuestionType = (typeof QUESTION_TYPES)[number];

export const EXAM_MODES = [
  "quick",
  "topic",
  "course",
  "weakness",
  "mistake",
  "simulation",
  "diagnostic",
  "single",
] as const;
export type ExamMode = (typeof EXAM_MODES)[number];

export const BLOOM_LEVELS = [
  "Remembering",
  "Understanding",
  "Application",
  "Analysis",
  "Evaluation",
  "Creation",
] as const;

// Numeric position of each Bloom level (used to derive difficulty / importance).
export const BLOOM_WEIGHT: Record<string, number> = {
  Remembering: 0.1,
  Understanding: 0.3,
  Application: 0.5,
  Analysis: 0.7,
  Evaluation: 0.85,
  Creation: 0.95,
};

export const BLOOM_TO_DIFFICULTY: Record<string, Difficulty> = {
  Remembering: "Easy",
  Understanding: "Easy",
  Application: "Medium",
  Analysis: "Hard",
  Evaluation: "Very Hard",
  Creation: "Very Hard",
};

// Mastery thresholds used across analytics, planner and practice engine.
export const MASTERY = {
  weakThreshold: 60, // below this a topic/course is "weak" and prioritized
  moderateThreshold: 75,
  strongThreshold: 85,
  readinessPass: 70, // predicted readiness needed to be "exam ready"
};

export const DIFFICULTY_VALUE: Record<Difficulty, number> = {
  Easy: 1,
  Medium: 2,
  Hard: 3,
  "Very Hard": 4,
};

// A correct answer on a harder question is worth more mastery credit.
export const DIFFICULTY_MASTERY_WEIGHT: Record<Difficulty, number> = {
  Easy: 0.8,
  Medium: 1.0,
  Hard: 1.3,
  "Very Hard": 1.6,
};

export const DEFAULT_USER_EMAIL = "student@exitprep.local";
