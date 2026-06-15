import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/user";
import { prisma } from "@/lib/db";

// POST /api/review { questionId } — add a question to the review list (due now).
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  const body = await req.json().catch(() => ({}));
  const questionId = Number(body.questionId);
  if (!Number.isFinite(questionId)) {
    return NextResponse.json({ error: "questionId required" }, { status: 400 });
  }
  const now = new Date();
  await prisma.reviewState.upsert({
    where: { userId_questionId: { userId: user.id, questionId } },
    update: { dueAt: now },
    create: { userId: user.id, questionId, dueAt: now, intervalDays: 0 },
  });
  return NextResponse.json({ ok: true });
}
