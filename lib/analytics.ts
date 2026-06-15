import { prisma } from "./db";
import { getMasterySnapshot } from "./mastery";

export interface MistakeEntry {
  id: number;
  questionId: number;
  externalId: string;
  stem: string;
  selectedAnswer: string;
  selectedText: string;
  correctAnswer: string;
  correctText: string;
  explanation: string;
  difficulty: string;
  questionType: string;
  courseId: number;
  courseName: string;
  topicId: number;
  topicName: string;
  topicSlug: string;
  attemptNumber: number;
  resolved: boolean;
  createdAt: string;
  noteHref: string;
}

function optText(q: any, letter: string): string {
  return ({ A: q.optionA, B: q.optionB, C: q.optionC, D: q.optionD } as any)[letter] ?? "";
}

export async function getMistakeJournal(userId: number): Promise<{
  entries: MistakeEntry[];
  byCourse: { name: string; count: number; courseId: number }[];
  byTopic: { name: string; count: number; topicId: number; courseId: number; topicSlug: number | string }[];
  byDifficulty: { name: string; count: number }[];
  frequentlyMissedTopics: { name: string; count: number; topicId: number }[];
  repeatMistakes: {
    questionId: number; externalId: string; stem: string; times: number;
    topicName: string; courseName: string; resolved: boolean; noteHref: string;
  }[];
  totalMistakes: number;
  resolvedCount: number;
}> {
  const mistakes = await prisma.mistake.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { question: { include: { course: true, topic: true } } },
  });

  const entries: MistakeEntry[] = mistakes.map((m) => {
    const q = m.question;
    return {
      id: m.id,
      questionId: m.questionId,
      externalId: q.externalId,
      stem: q.stem,
      selectedAnswer: m.selectedAnswer,
      selectedText: optText(q, m.selectedAnswer),
      correctAnswer: m.correctAnswer,
      correctText: optText(q, m.correctAnswer),
      explanation: q.explanation,
      difficulty: q.difficulty,
      questionType: q.questionType,
      courseId: q.courseId,
      courseName: q.course.name,
      topicId: q.topicId,
      topicName: q.topic.name,
      topicSlug: q.topic.slug,
      attemptNumber: m.attemptNumber,
      resolved: m.resolved,
      createdAt: m.createdAt.toISOString(),
      noteHref: `/notes/${q.courseId}?topic=${q.topic.slug}#${q.topic.slug}`,
    };
  });

  const count = <K extends string | number>(arr: any[], key: (e: any) => K) => {
    const m = new Map<K, number>();
    for (const e of arr) m.set(key(e), (m.get(key(e)) ?? 0) + 1);
    return m;
  };

  const courseMap = new Map<number, { name: string; count: number; courseId: number }>();
  const topicMap = new Map<number, { name: string; count: number; topicId: number; courseId: number; topicSlug: string }>();
  const diffMap = new Map<string, number>();
  for (const e of entries) {
    const c = courseMap.get(e.courseId) ?? { name: e.courseName, count: 0, courseId: e.courseId };
    c.count++; courseMap.set(e.courseId, c);
    const t = topicMap.get(e.topicId) ?? { name: e.topicName, count: 0, topicId: e.topicId, courseId: e.courseId, topicSlug: e.topicSlug };
    t.count++; topicMap.set(e.topicId, t);
    diffMap.set(e.difficulty, (diffMap.get(e.difficulty) ?? 0) + 1);
  }

  const byTopicArr = [...topicMap.values()].sort((a, b) => b.count - a.count);

  // Repeat mistakes: questions missed 2+ times.
  const perQuestion = new Map<number, { times: number; e: MistakeEntry; resolved: boolean }>();
  for (const e of entries) {
    const r = perQuestion.get(e.questionId) ?? { times: 0, e, resolved: e.resolved };
    r.times++; r.resolved = e.resolved; perQuestion.set(e.questionId, r);
  }
  const repeatMistakes = [...perQuestion.values()]
    .filter((r) => r.times >= 2)
    .sort((a, b) => b.times - a.times)
    .map((r) => ({
      questionId: r.e.questionId,
      externalId: r.e.externalId,
      stem: r.e.stem,
      times: r.times,
      topicName: r.e.topicName,
      courseName: r.e.courseName,
      resolved: r.resolved,
      noteHref: r.e.noteHref,
    }));

  return {
    entries,
    byCourse: [...courseMap.values()].sort((a, b) => b.count - a.count),
    byTopic: byTopicArr,
    byDifficulty: ["Easy", "Medium", "Hard", "Very Hard"]
      .map((name) => ({ name, count: diffMap.get(name) ?? 0 }))
      .filter((d) => d.count > 0),
    frequentlyMissedTopics: byTopicArr.slice(0, 10).map((t) => ({ name: t.name, count: t.count, topicId: t.topicId })),
    repeatMistakes,
    totalMistakes: entries.length,
    resolvedCount: entries.filter((e) => e.resolved).length,
  };
}

// Daily / weekly / monthly performance from attempts.
export async function getProgressSeries(userId: number) {
  const attempts = await prisma.questionAttempt.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    select: { isCorrect: true, createdAt: true },
  });

  const bucket = (fmt: (d: Date) => string) => {
    const m = new Map<string, { correct: number; total: number }>();
    for (const a of attempts) {
      const k = fmt(a.createdAt);
      const t = m.get(k) ?? { correct: 0, total: 0 };
      t.total++; if (a.isCorrect) t.correct++; m.set(k, t);
    }
    return [...m.entries()].map(([label, t]) => ({
      label, total: t.total, accuracy: Math.round((t.correct / t.total) * 100),
    }));
  };

  const day = (d: Date) => d.toISOString().slice(0, 10);
  const month = (d: Date) => d.toISOString().slice(0, 7);
  const week = (d: Date) => {
    const onejan = new Date(d.getFullYear(), 0, 1);
    const wk = Math.ceil((((d.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
    return `${d.getFullYear()}-W${String(wk).padStart(2, "0")}`;
  };

  // Cumulative accuracy curve (rate of improvement).
  let runCorrect = 0;
  const cumulative = attempts.map((a, i) => {
    if (a.isCorrect) runCorrect++;
    return { n: i + 1, accuracy: Math.round((runCorrect / (i + 1)) * 100) };
  });

  return {
    daily: bucket(day),
    weekly: bucket(week),
    monthly: bucket(month),
    cumulative,
    totalAttempts: attempts.length,
  };
}

// Exam-score history + first/current/rate-of-improvement.
export async function getImprovementCurve(userId: number) {
  const results = await prisma.examResult.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    include: { exam: true },
  });
  const series = results.map((r) => ({
    date: r.createdAt.toISOString().slice(0, 10),
    score: r.score,
    mode: r.exam.mode,
    title: r.exam.title,
  }));
  const initial = series.length ? series[0].score : 0;
  const current = series.length ? series[series.length - 1].score : 0;
  const rate = series.length > 1 ? Math.round((current - initial) / (series.length - 1)) : 0;
  return { series, initial, current, rate, count: series.length };
}

// Topic heatmap derived from the mastery snapshot.
export async function getHeatmap(userId: number) {
  const snap = await getMasterySnapshot(userId);
  const topics = snap.courses.flatMap((c) =>
    c.topics.map((t) => ({
      topicId: t.id, name: t.name, courseName: c.name, courseId: c.id,
      slug: t.slug, mastery: Math.round(t.mastery), attempted: t.attempted,
      total: t.total, band: t.band,
    })),
  );
  return {
    strong: topics.filter((t) => t.band === "strong"),
    moderate: topics.filter((t) => t.band === "moderate"),
    weak: topics.filter((t) => t.band === "weak"),
    untested: topics.filter((t) => t.band === "untested"),
    all: topics,
  };
}
