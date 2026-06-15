import { prisma } from "./db";
import {
  DIFFICULTY_MASTERY_WEIGHT,
  MASTERY,
  type Difficulty,
} from "./constants";
import { clamp } from "./utils";

// A single in-memory snapshot powers every mastery view (course/topic/difficulty/type)
// plus readiness. Computed from the LATEST attempt per question so mastery reflects
// current ability, weighted by question difficulty.

export interface MasteryNode {
  id: number;
  name: string;
  mastery: number; // 0..100
  attempted: number; // distinct questions attempted
  total: number; // questions available in scope
  correct: number;
  coverage: number; // 0..1
  confidence: number; // 0..1 (how trustworthy the mastery estimate is)
  band: "strong" | "moderate" | "weak" | "untested";
}

export interface CourseMastery extends MasteryNode {
  no: number;
  themeName: string;
  weight: number; // exam item share %
  topics: TopicMastery[];
}
export interface TopicMastery extends MasteryNode {
  courseId: number;
  courseName: string;
  slug: string;
}

function band(mastery: number, attempted: number): MasteryNode["band"] {
  if (attempted === 0) return "untested";
  if (mastery >= MASTERY.strongThreshold) return "strong";
  if (mastery >= MASTERY.moderateThreshold) return "moderate";
  if (mastery >= MASTERY.weakThreshold) return "moderate";
  return "weak";
}

function confidenceFor(attempted: number, total: number): number {
  // Need ~30% coverage or 8 questions (whichever smaller) for full confidence.
  const target = Math.max(4, Math.min(8, total * 0.3));
  return clamp(attempted / target, 0, 1);
}

interface Acc {
  weighted: number;
  weight: number;
  correct: number;
  questionIds: Set<number>;
}
const newAcc = (): Acc => ({ weighted: 0, weight: 0, correct: 0, questionIds: new Set() });

function masteryOf(a: Acc): number {
  return a.weight > 0 ? (a.weighted / a.weight) * 100 : 0;
}

export interface MasterySnapshot {
  courses: CourseMastery[];
  byDifficulty: Record<Difficulty, MasteryNode>;
  byType: Record<string, MasteryNode>;
  overall: {
    readiness: number; // blueprint-weighted, coverage-adjusted 0..100
    rawMastery: number; // blueprint-weighted mastery ignoring coverage
    totalAttempted: number;
    totalQuestions: number;
    passLikely: boolean;
  };
}

export async function getMasterySnapshot(userId: number): Promise<MasterySnapshot> {
  const [courses, questions, attempts] = await Promise.all([
    prisma.course.findMany({ include: { theme: true, topics: true } }),
    prisma.question.findMany({
      select: { id: true, courseId: true, topicId: true, difficulty: true, questionType: true },
    }),
    prisma.questionAttempt.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      select: { questionId: true, isCorrect: true, createdAt: true },
    }),
  ]);

  const qMeta = new Map(questions.map((q) => [q.id, q]));

  // Latest attempt per question.
  const latest = new Map<number, boolean>();
  for (const a of attempts) latest.set(a.questionId, a.isCorrect); // asc order → last wins

  // Accumulators.
  const courseAcc = new Map<number, Acc>();
  const topicAcc = new Map<number, Acc>();
  const diffAcc = new Map<string, Acc>();
  const typeAcc = new Map<string, Acc>();

  for (const [qid, isCorrect] of latest) {
    const q = qMeta.get(qid);
    if (!q) continue;
    const w = DIFFICULTY_MASTERY_WEIGHT[q.difficulty as Difficulty] ?? 1;
    for (const [map, key] of [
      [courseAcc, q.courseId],
      [topicAcc, q.topicId],
      [diffAcc, q.difficulty],
      [typeAcc, q.questionType],
    ] as [Map<any, Acc>, any][]) {
      let acc = map.get(key);
      if (!acc) { acc = newAcc(); map.set(key, acc); }
      acc.weight += w;
      if (isCorrect) { acc.weighted += w; acc.correct += 1; }
      acc.questionIds.add(qid);
    }
  }

  // Totals available per scope.
  const totalByCourse = new Map<number, number>();
  const totalByTopic = new Map<number, number>();
  const totalByDiff = new Map<string, number>();
  const totalByType = new Map<string, number>();
  for (const q of questions) {
    totalByCourse.set(q.courseId, (totalByCourse.get(q.courseId) ?? 0) + 1);
    totalByTopic.set(q.topicId, (totalByTopic.get(q.topicId) ?? 0) + 1);
    totalByDiff.set(q.difficulty, (totalByDiff.get(q.difficulty) ?? 0) + 1);
    totalByType.set(q.questionType, (totalByType.get(q.questionType) ?? 0) + 1);
  }

  const node = (
    id: number, name: string, acc: Acc | undefined, total: number,
  ): MasteryNode => {
    const a = acc ?? newAcc();
    const attempted = a.questionIds.size;
    const mastery = masteryOf(a);
    return {
      id, name, total,
      attempted,
      correct: a.correct,
      mastery,
      coverage: total ? attempted / total : 0,
      confidence: confidenceFor(attempted, total),
      band: band(mastery, attempted),
    };
  };

  const courseMastery: CourseMastery[] = courses.map((c) => {
    const topics: TopicMastery[] = c.topics.map((t) => ({
      ...node(t.id, t.name, topicAcc.get(t.id), totalByTopic.get(t.id) ?? 0),
      courseId: c.id,
      courseName: c.name,
      slug: t.slug,
    }));
    const base = node(c.id, c.name, courseAcc.get(c.id), totalByCourse.get(c.id) ?? 0);
    return {
      ...base,
      no: c.no,
      themeName: c.theme.name,
      weight: c.items, // exam item share (out of 100)
      topics,
    };
  });

  const mkRecord = (
    keys: string[], accs: Map<string, Acc>, totals: Map<string, number>,
  ) => {
    const out: Record<string, MasteryNode> = {};
    for (const k of keys) out[k] = node(0, k, accs.get(k), totals.get(k) ?? 0);
    return out;
  };

  const byDifficulty = mkRecord(
    ["Easy", "Medium", "Hard", "Very Hard"], diffAcc, totalByDiff,
  ) as Record<Difficulty, MasteryNode>;
  const byType = mkRecord(
    ["MCQ", "Scenario", "Case Study", "Problem Solving"], typeAcc, totalByType,
  );

  // Readiness: blueprint-weighted course mastery shrunk by confidence (coverage).
  let readiness = 0;
  let rawMastery = 0;
  for (const c of courseMastery) {
    const wt = c.weight / 100;
    rawMastery += c.mastery * wt;
    readiness += c.mastery * c.confidence * wt;
  }
  const totalAttempted = latest.size;
  const totalQuestions = questions.length;

  return {
    courses: courseMastery,
    byDifficulty,
    byType,
    overall: {
      readiness: Math.round(readiness),
      rawMastery: Math.round(rawMastery),
      totalAttempted,
      totalQuestions,
      passLikely: readiness >= MASTERY.readinessPass,
    },
  };
}
