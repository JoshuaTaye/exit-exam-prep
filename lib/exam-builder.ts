import { prisma } from "./db";
import { getMasterySnapshot } from "./mastery";
import { getDueQuestionIds } from "./spaced-repetition";
import { MASTERY, type ExamMode } from "./constants";

export interface SafeQuestion {
  id: number;
  externalId: string;
  stem: string;
  options: { A: string; B: string; C: string; D: string };
  difficulty: string;
  questionType: string;
  courseId: number;
  courseName: string;
  topicId: number;
  topicName: string;
  topicSlug: string;
}

export interface BuiltSession {
  examId: number;
  mode: ExamMode;
  title: string;
  durationSec: number;
  questions: SafeQuestion[];
  config: Record<string, any>;
}

interface QMeta {
  id: number;
  courseId: number;
  topicId: number;
  difficulty: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Per-user signals used to prioritize which questions to serve.
async function getServeContext(userId: number) {
  const [attempts, due, mistakes] = await Promise.all([
    prisma.questionAttempt.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      select: { questionId: true, isCorrect: true, createdAt: true, timeMs: true },
    }),
    getDueQuestionIds(userId, 1000),
    prisma.mistake.findMany({
      where: { userId, resolved: false },
      select: { questionId: true },
    }),
  ]);

  const lastCorrect = new Map<number, boolean>();
  const seen = new Set<number>();
  const slow = new Set<number>();
  for (const a of attempts) {
    lastCorrect.set(a.questionId, a.isCorrect);
    seen.add(a.questionId);
    if (a.timeMs > 45000) slow.add(a.questionId);
  }
  return {
    lastCorrect,
    seen,
    slow,
    dueSet: new Set(due),
    unresolvedMistakes: new Set(mistakes.map((m) => m.questionId)),
  };
}

type ServeCtx = Awaited<ReturnType<typeof getServeContext>>;

// Higher score = should be served sooner (deliberate practice priority).
function priority(q: QMeta, ctx: ServeCtx): number {
  let s = Math.random() * 0.5; // tie-break jitter
  if (ctx.dueSet.has(q.id)) s += 5; // spaced-repetition due
  if (ctx.unresolvedMistakes.has(q.id)) s += 4; // unresolved mistakes
  if (!ctx.seen.has(q.id)) s += 3; // never attempted
  else if (ctx.lastCorrect.get(q.id) === false) s += 2; // last answered wrong
  if (ctx.slow.has(q.id)) s += 1; // answered slowly before
  return s;
}

function rankPick(pool: QMeta[], ctx: ServeCtx, n: number): QMeta[] {
  return [...pool].sort((a, b) => priority(b, ctx) - priority(a, ctx)).slice(0, n);
}

async function toSafe(ids: number[]): Promise<SafeQuestion[]> {
  if (ids.length === 0) return [];
  const rows = await prisma.question.findMany({
    where: { id: { in: ids } },
    include: { course: true, topic: true },
  });
  const byId = new Map(rows.map((r) => [r.id, r]));
  // Preserve requested order.
  return ids
    .map((id) => byId.get(id))
    .filter((r): r is NonNullable<typeof r> => !!r)
    .map((r) => ({
      id: r.id,
      externalId: r.externalId,
      stem: r.stem,
      options: { A: r.optionA, B: r.optionB, C: r.optionC, D: r.optionD },
      difficulty: r.difficulty,
      questionType: r.questionType,
      courseId: r.courseId,
      courseName: r.course.name,
      topicId: r.topicId,
      topicName: r.topic.name,
      topicSlug: r.topic.slug,
    }));
}

async function persist(
  userId: number, mode: ExamMode, title: string, ids: number[],
  durationSec: number, config: Record<string, any>,
): Promise<BuiltSession> {
  const exam = await prisma.exam.create({
    data: {
      userId, mode, title,
      config: JSON.stringify(config),
      questionIds: JSON.stringify(ids),
      durationSec,
    },
  });
  return { examId: exam.id, mode, title, durationSec, questions: await toSafe(ids), config };
}

// ----------------------------- Builders -----------------------------

export async function buildQuickQuiz(userId: number, n = 10): Promise<BuiltSession> {
  n = Math.max(5, Math.min(20, n));
  const ctx = await getServeContext(userId);
  const all = await prisma.question.findMany({
    select: { id: true, courseId: true, topicId: true, difficulty: true },
  });
  const picked = rankPick(all, ctx, n);
  return persist(userId, "quick", `Quick Quiz · ${n} questions`, shuffle(picked.map((q) => q.id)), 0, { n });
}

export async function buildTopicQuiz(userId: number, topicId: number, n = 12): Promise<BuiltSession> {
  const ctx = await getServeContext(userId);
  const topic = await prisma.topic.findUnique({ where: { id: topicId }, include: { course: true } });
  if (!topic) throw new Error("Topic not found");
  const pool = await prisma.question.findMany({
    where: { topicId }, select: { id: true, courseId: true, topicId: true, difficulty: true },
  });
  const picked = rankPick(pool, ctx, Math.min(n, pool.length));
  return persist(userId, "topic", `Topic Quiz · ${topic.name}`, shuffle(picked.map((q) => q.id)), 0, { topicId, courseId: topic.courseId });
}

export async function buildCourseQuiz(userId: number, courseId: number): Promise<BuiltSession> {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw new Error("Course not found");
  const pool = await prisma.question.findMany({
    where: { courseId }, select: { id: true },
  });
  const ids = shuffle(pool.map((q) => q.id));
  return persist(
    userId, "course", `Course Quiz · ${course.name} · ${ids.length} questions`,
    ids, 0, { courseId, totalItems: ids.length },
  );
}

export async function buildWeaknessQuiz(userId: number, n = 15): Promise<BuiltSession> {
  const ctx = await getServeContext(userId);
  const snap = await getMasterySnapshot(userId);
  // Weak or untested topics, worst first; weight how many to pull from each.
  const weakTopics = snap.courses
    .flatMap((c) => c.topics)
    .filter((t) => t.band === "weak" || t.band === "untested" || t.mastery < MASTERY.weakThreshold)
    .sort((a, b) => a.mastery - b.mastery);

  const target = weakTopics.length ? weakTopics : snap.courses.flatMap((c) => c.topics);
  const topicIds = target.slice(0, Math.max(6, n)).map((t) => t.id);

  const pool = await prisma.question.findMany({
    where: { topicId: { in: topicIds } },
    select: { id: true, courseId: true, topicId: true, difficulty: true },
  });
  const picked = rankPick(pool, ctx, Math.min(n, pool.length));
  return persist(userId, "weakness", `Weakness Quiz · ${n} questions`, shuffle(picked.map((q) => q.id)), 0, {
    n, weakTopicIds: topicIds,
  });
}

export async function buildMistakeQuiz(
  userId: number, n = 15, only?: number[],
): Promise<BuiltSession> {
  // Distinct questions from the mistake journal, unresolved first.
  const mistakes = await prisma.mistake.findMany({
    where: { userId },
    orderBy: [{ resolved: "asc" }, { createdAt: "desc" }],
    select: { questionId: true, resolved: true },
  });
  const seen = new Set<number>();
  const ordered: number[] = [];
  for (const m of mistakes) {
    if (!seen.has(m.questionId)) { seen.add(m.questionId); ordered.push(m.questionId); }
  }
  // `only` restricts to a caller-supplied subset (e.g. retry all mistakes for one
  // course). Always intersected with the user's real mistakes for safety.
  let ids = ordered;
  if (only && only.length) {
    const allow = new Set(only);
    ids = ordered.filter((id) => allow.has(id));
  } else {
    ids = ordered.slice(0, n);
  }
  return persist(userId, "mistake", `Mistake Quiz · ${ids.length} questions`, ids, 0, { n });
}

// Single-question session: open one specific question on its own.
export async function buildSingleQuiz(userId: number, questionId: number): Promise<BuiltSession> {
  const q = await prisma.question.findUnique({
    where: { id: questionId }, select: { id: true, topic: { select: { name: true } } },
  });
  if (!q) throw new Error("Question not found");
  return persist(userId, "single", `Question · ${q.topic.name}`, [q.id], 0, { questionId });
}

// Full exit-exam simulation that EXACTLY matches the blueprint distribution:
// course item counts and per-topic counts (which encode the difficulty mix).
export async function buildSimulation(userId: number): Promise<BuiltSession> {
  const ctx = await getServeContext(userId);
  const courses = await prisma.course.findMany({ include: { topics: true } });

  const chosen: number[] = [];
  for (const c of courses) {
    for (const t of c.topics) {
      const pool = await prisma.question.findMany({
        where: { topicId: t.id },
        select: { id: true, courseId: true, topicId: true, difficulty: true },
      });
      const need = t.items;
      let pick = rankPick(pool, ctx, Math.min(need, pool.length)).map((q) => q.id);
      // Fallback: if a topic is short on questions, top up from the course.
      if (pick.length < need) {
        const extra = await prisma.question.findMany({
          where: { courseId: c.id, id: { notIn: pick } },
          select: { id: true, courseId: true, topicId: true, difficulty: true },
        });
        pick = pick.concat(rankPick(extra, ctx, need - pick.length).map((q) => q.id));
      }
      chosen.push(...pick);
    }
  }

  const blueprint = await prisma.course.findMany({
    select: { name: true, items: true },
  });
  return persist(
    userId, "simulation", "Exit Exam Simulation · 100 questions",
    shuffle(chosen), 150 * 60,
    { totalItems: chosen.length, blueprint },
  );
}

// Diagnostic baseline: ~24 questions sampling every course (weighted by the
// blueprint) and spreading across each course's topics, to establish strengths
// and weaknesses on first use.
export async function buildDiagnostic(userId: number, target = 24): Promise<BuiltSession> {
  const ctx = await getServeContext(userId);
  const courses = await prisma.course.findMany({ include: { topics: true } });
  const totalItems = courses.reduce((s, c) => s + c.items, 0) || 100;

  const chosen: number[] = [];
  for (const c of courses) {
    const nCourse = Math.max(1, Math.round((c.items / totalItems) * target));
    const topics = c.topics;
    // Round-robin across topics, one question per topic per pass.
    const perTopicPicked: number[][] = topics.map(() => []);
    const pools = await Promise.all(
      topics.map((t) =>
        prisma.question.findMany({
          where: { topicId: t.id },
          select: { id: true, courseId: true, topicId: true, difficulty: true },
        }),
      ),
    );
    const ranked = pools.map((p) => rankPick(p, ctx, p.length).map((q) => q.id));
    let added = 0;
    let round = 0;
    while (added < nCourse) {
      let progressed = false;
      for (let i = 0; i < topics.length && added < nCourse; i++) {
        if (ranked[i].length > round) {
          chosen.push(ranked[i][round]);
          added++;
          progressed = true;
        }
      }
      if (!progressed) break;
      round++;
    }
  }

  return persist(
    userId, "diagnostic", "Diagnostic Assessment",
    shuffle(chosen), 0, { totalItems: chosen.length },
  );
}

// Re-fetch the questions for an existing session (resume / regrade view).
export async function getSessionQuestions(examId: number): Promise<SafeQuestion[]> {
  const exam = await prisma.exam.findUnique({ where: { id: examId } });
  if (!exam) throw new Error("Session not found");
  const ids: number[] = JSON.parse(exam.questionIds);
  return toSafe(ids);
}
