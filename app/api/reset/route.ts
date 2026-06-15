import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/user";
import { prisma } from "@/lib/db";

// POST /api/reset — clear all study activity (keeps account & preferences).
export async function POST() {
  const user = await getCurrentUser();
  const where = { userId: user.id };
  await prisma.questionAttempt.deleteMany({ where });
  await prisma.mistake.deleteMany({ where });
  await prisma.reviewState.deleteMany({ where });
  await prisma.examResult.deleteMany({ where });
  await prisma.exam.deleteMany({ where });
  await prisma.studyPlan.deleteMany({ where });
  await prisma.bookmark.deleteMany({ where });
  await prisma.noteProgress.deleteMany({ where });
  await prisma.user.update({ where: { id: user.id }, data: { diagnosticDone: false } });
  return NextResponse.json({ ok: true });
}
