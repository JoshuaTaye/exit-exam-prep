import { prisma } from "./db";

// Spaced repetition aligned to the blueprint spec:
//   missed today -> review tomorrow -> +2d -> +4d -> +7d -> +14d (escalating)
//   answered correctly -> intervals grow 1 -> 3 -> 7 -> 16 -> 35 days
const MISS_INTERVALS = [1, 2, 4, 7, 14, 21];
const HIT_INTERVALS = [1, 3, 7, 16, 35, 60];

function nextInterval(table: number[], current: number): number {
  const idx = table.findIndex((v) => v > current);
  return idx === -1 ? table[table.length - 1] : table[idx];
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

// Update (or create) the spaced-repetition state for a question after an attempt.
export async function recordReview(userId: number, questionId: number, correct: boolean) {
  const existing = await prisma.reviewState.findUnique({
    where: { userId_questionId: { userId, questionId } },
  });
  const now = new Date();
  const current = existing?.intervalDays ?? 0;

  let intervalDays: number;
  let streak: number;
  let ease = existing?.ease ?? 2.5;

  if (correct) {
    intervalDays = nextInterval(HIT_INTERVALS, current);
    streak = (existing?.streak ?? 0) + 1;
    ease = Math.min(3.0, ease + 0.05);
  } else {
    intervalDays = nextInterval(MISS_INTERVALS, current);
    streak = 0;
    ease = Math.max(1.3, ease - 0.2);
  }

  const dueAt = addDays(now, intervalDays);
  const data = { intervalDays, streak, ease, dueAt, lastReviewed: now };

  if (existing) {
    await prisma.reviewState.update({ where: { id: existing.id }, data });
  } else {
    await prisma.reviewState.create({ data: { userId, questionId, ...data } });
  }
}

// Questions currently due for review (dueAt <= now), most overdue first.
export async function getDueQuestionIds(userId: number, limit = 100): Promise<number[]> {
  const due = await prisma.reviewState.findMany({
    where: { userId, dueAt: { lte: new Date() } },
    orderBy: { dueAt: "asc" },
    take: limit,
    select: { questionId: true },
  });
  return due.map((d) => d.questionId);
}

export async function countDue(userId: number): Promise<number> {
  return prisma.reviewState.count({ where: { userId, dueAt: { lte: new Date() } } });
}
