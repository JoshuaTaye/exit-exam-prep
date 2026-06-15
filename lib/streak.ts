import { prisma } from "./db";

// Consecutive days (ending today or yesterday) with at least one attempt.
export async function getStudyStreak(userId: number): Promise<{ current: number; activeToday: boolean }> {
  const attempts = await prisma.questionAttempt.findMany({
    where: { userId },
    select: { createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  if (attempts.length === 0) return { current: 0, activeToday: false };

  const days = new Set(attempts.map((a) => a.createdAt.toISOString().slice(0, 10)));
  const today = new Date();
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const todayStr = fmt(today);
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);

  const activeToday = days.has(todayStr);
  // Streak may end today or (if not yet studied today) yesterday.
  let cursor = new Date(activeToday ? today : yesterday);
  if (!days.has(fmt(cursor))) return { current: 0, activeToday };

  let streak = 0;
  while (days.has(fmt(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return { current: streak, activeToday };
}
