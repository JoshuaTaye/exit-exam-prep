import { prisma } from "./db";
import { getMasterySnapshot } from "./mastery";

export interface PlanFocus {
  courseId: number;
  courseName: string;
  topicId: number;
  topicName: string;
  topicSlug: string;
  mastery: number;
  examWeight: number;
  mistakes: number;
  priority: number;
  reason: string;
  questionTarget: number;
}
export interface PlanWeek {
  week: number;
  focus: PlanFocus[];
}

// Build a prioritized study plan:
//   1. High blueprint weight   2. Low mastery   3. Frequent mistakes
export async function generatePlan(userId: number, weeks = 4, perWeek = 5): Promise<PlanWeek[]> {
  const [snap, mistakes] = await Promise.all([
    getMasterySnapshot(userId),
    prisma.mistake.groupBy({
      by: ["questionId"],
      where: { userId, resolved: false },
      _count: { questionId: true },
    }),
  ]);

  // Map mistakes -> topic via question lookup.
  const qids = mistakes.map((m) => m.questionId);
  const qrows = qids.length
    ? await prisma.question.findMany({ where: { id: { in: qids } }, select: { id: true, topicId: true } })
    : [];
  const topicOfQ = new Map(qrows.map((q) => [q.id, q.topicId]));
  const mistakeByTopic = new Map<number, number>();
  for (const m of mistakes) {
    const tid = topicOfQ.get(m.questionId);
    if (tid != null) mistakeByTopic.set(tid, (mistakeByTopic.get(tid) ?? 0) + m._count.questionId);
  }

  const maxWeight = Math.max(...snap.courses.map((c) => c.weight)); // out of 100
  const maxMistakes = Math.max(1, ...[...mistakeByTopic.values()]);

  const scored: PlanFocus[] = [];
  for (const c of snap.courses) {
    for (const t of c.topics) {
      const mistakeCount = mistakeByTopic.get(t.id) ?? 0;
      // For untested topics treat mastery as low so coverage is prioritized.
      const effMastery = t.attempted === 0 ? 0 : t.mastery;
      const need = 1 - effMastery / 100;
      const weightShare = c.weight / maxWeight;
      const mistakeNorm = mistakeCount / maxMistakes;

      const priority = 0.45 * weightShare + 0.4 * need + 0.15 * mistakeNorm;

      const reasons: string[] = [];
      reasons.push(`${c.weight}% exam weight`);
      reasons.push(t.attempted === 0 ? "not yet practiced" : `mastery ${Math.round(t.mastery)}%`);
      if (mistakeCount > 0) reasons.push(`${mistakeCount} open mistake${mistakeCount > 1 ? "s" : ""}`);

      const questionTarget = Math.max(8, Math.round(need * 18) + (mistakeCount > 0 ? 4 : 0));

      scored.push({
        courseId: c.id,
        courseName: c.name,
        topicId: t.id,
        topicName: t.name,
        topicSlug: t.slug,
        mastery: Math.round(t.mastery),
        examWeight: c.weight,
        mistakes: mistakeCount,
        priority,
        reason: reasons.join(" · "),
        questionTarget,
      });
    }
  }

  scored.sort((a, b) => b.priority - a.priority);
  const top = scored.slice(0, weeks * perWeek);

  const plan: PlanWeek[] = [];
  for (let w = 0; w < weeks; w++) {
    plan.push({ week: w + 1, focus: top.slice(w * perWeek, (w + 1) * perWeek) });
  }
  return plan;
}

export async function getOrCreatePlan(userId: number) {
  const existing = await prisma.studyPlan.findFirst({
    where: { userId, active: true },
    orderBy: { createdAt: "desc" },
  });
  if (existing) return { weeks: JSON.parse(existing.weeks) as PlanWeek[], createdAt: existing.createdAt, id: existing.id };
  return regeneratePlan(userId);
}

export async function regeneratePlan(userId: number) {
  await prisma.studyPlan.updateMany({ where: { userId, active: true }, data: { active: false } });
  const weeks = await generatePlan(userId);
  const row = await prisma.studyPlan.create({
    data: { userId, weeks: JSON.stringify(weeks), active: true },
  });
  return { weeks, createdAt: row.createdAt, id: row.id };
}
