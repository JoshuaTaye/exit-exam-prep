import { prisma } from "./db";
import { recordReview } from "./spaced-repetition";
import { MASTERY } from "./constants";

export interface SubmittedAnswer {
  questionId: number;
  selected: string | null; // "A".."D" or null (skipped)
  timeMs?: number;
}

export interface GradedQuestion {
  questionId: number;
  externalId: string;
  selected: string | null;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
  stem: string;
  options: { A: string; B: string; C: string; D: string };
  difficulty: string;
  questionType: string;
  courseName: string;
  topicName: string;
  topicSlug: string;
  courseId: number;
  topicId: number;
  noteHref: string; // deep link to the related note section
}

export interface GradeResult {
  examResultId: number;
  examId: number;
  mode: string;
  score: number;
  correct: number;
  total: number;
  passed: boolean;
  durationMs: number;
  breakdown: {
    byCourse: { name: string; correct: number; total: number; pct: number }[];
    byDifficulty: { name: string; correct: number; total: number; pct: number }[];
    byType: { name: string; correct: number; total: number; pct: number }[];
  };
  questions: GradedQuestion[];
}

export async function gradeSession(
  userId: number,
  examId: number,
  answers: SubmittedAnswer[],
  durationMs = 0,
): Promise<GradeResult> {
  const exam = await prisma.exam.findUnique({ where: { id: examId } });
  if (!exam || exam.userId !== userId) throw new Error("Session not found");

  const ids: number[] = JSON.parse(exam.questionIds);
  const questions = await prisma.question.findMany({
    where: { id: { in: ids } },
    include: { course: true, topic: true },
  });
  const qById = new Map(questions.map((q) => [q.id, q]));
  const answerById = new Map(answers.map((a) => [a.questionId, a]));

  // Prior attempt counts (for attemptNumber).
  const priorCounts = await prisma.questionAttempt.groupBy({
    by: ["questionId"],
    where: { userId, questionId: { in: ids } },
    _count: { questionId: true },
  });
  const priorBy = new Map(priorCounts.map((p) => [p.questionId, p._count.questionId]));

  let correct = 0;
  const graded: GradedQuestion[] = [];

  // Tallies for breakdown.
  const tally = () => ({ correct: 0, total: 0 });
  const byCourse = new Map<string, { correct: number; total: number }>();
  const byDifficulty = new Map<string, { correct: number; total: number }>();
  const byType = new Map<string, { correct: number; total: number }>();
  const bump = (m: Map<string, any>, k: string, ok: boolean) => {
    const t = m.get(k) ?? tally();
    t.total++; if (ok) t.correct++; m.set(k, t);
  };

  const score = (ids.length ? 0 : 0);

  // First create the ExamResult shell so attempts can link to it.
  const result = await prisma.examResult.create({
    data: {
      examId, userId, score: 0, totalItems: ids.length, correct: 0,
      durationMs, breakdown: "{}", passed: false,
    },
  });

  for (const qid of ids) {
    const q = qById.get(qid);
    if (!q) continue;
    const sub = answerById.get(qid);
    const selected = sub?.selected ?? null;
    const isCorrect = selected !== null && selected === q.answer;
    if (isCorrect) correct++;
    const attemptNumber = (priorBy.get(qid) ?? 0) + 1;

    await prisma.questionAttempt.create({
      data: {
        userId, questionId: qid, selectedAnswer: selected, isCorrect,
        timeMs: sub?.timeMs ?? 0, mode: exam.mode, attemptNumber,
        examResultId: result.id,
      },
    });

    // Permanent mistake journal — only for actual wrong selections (not skips).
    if (selected !== null && !isCorrect) {
      await prisma.mistake.create({
        data: {
          userId, questionId: qid, selectedAnswer: selected,
          correctAnswer: q.answer, attemptNumber,
        },
      });
    }
    // Resolve any earlier unresolved mistakes once answered correctly.
    if (isCorrect) {
      await prisma.mistake.updateMany({
        where: { userId, questionId: qid, resolved: false },
        data: { resolved: true },
      });
    }

    // Spaced repetition: schedule next review (skip counts as not-known).
    await recordReview(userId, qid, isCorrect);

    bump(byCourse, q.course.name, isCorrect);
    bump(byDifficulty, q.difficulty, isCorrect);
    bump(byType, q.questionType, isCorrect);

    graded.push({
      questionId: qid,
      externalId: q.externalId,
      selected,
      correctAnswer: q.answer,
      isCorrect,
      explanation: q.explanation,
      stem: q.stem,
      options: { A: q.optionA, B: q.optionB, C: q.optionC, D: q.optionD },
      difficulty: q.difficulty,
      questionType: q.questionType,
      courseName: q.course.name,
      topicName: q.topic.name,
      topicSlug: q.topic.slug,
      courseId: q.courseId,
      topicId: q.topicId,
      noteHref: `/notes/${q.courseId}?topic=${q.topic.slug}#${q.topic.slug}`,
    });
  }
  void score;

  const total = ids.length;
  const pct = total ? Math.round((correct / total) * 100) : 0;
  const passed = pct >= MASTERY.readinessPass;

  const toArr = (m: Map<string, { correct: number; total: number }>) =>
    [...m.entries()].map(([name, t]) => ({
      name, correct: t.correct, total: t.total,
      pct: t.total ? Math.round((t.correct / t.total) * 100) : 0,
    }));

  const breakdown = {
    byCourse: toArr(byCourse),
    byDifficulty: toArr(byDifficulty),
    byType: toArr(byType),
  };

  await prisma.examResult.update({
    where: { id: result.id },
    data: { score: pct, correct, passed, breakdown: JSON.stringify(breakdown) },
  });

  return {
    examResultId: result.id,
    examId,
    mode: exam.mode,
    score: pct,
    correct,
    total,
    passed,
    durationMs,
    breakdown,
    questions: graded,
  };
}
