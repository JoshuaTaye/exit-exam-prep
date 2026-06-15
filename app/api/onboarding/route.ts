import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/user";
import { prisma } from "@/lib/db";

// POST /api/onboarding — save welcome-flow preferences and mark onboarded.
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  const body = await req.json().catch(() => ({}));

  const data: any = {};
  if (typeof body.program === "string") data.program = body.program;
  if (typeof body.stream === "string") data.stream = body.stream;
  if (typeof body.examYear === "string") data.examYear = body.examYear;
  if (Number.isFinite(body.dailyGoalMinutes)) data.dailyGoalMinutes = body.dailyGoalMinutes;
  if (Number.isFinite(body.targetReadiness)) data.targetReadiness = body.targetReadiness;
  if (typeof body.onboarded === "boolean") data.onboarded = body.onboarded;
  if (typeof body.diagnosticDone === "boolean") data.diagnosticDone = body.diagnosticDone;

  const updated = await prisma.user.update({ where: { id: user.id }, data });
  return NextResponse.json({ ok: true, user: { onboarded: updated.onboarded } });
}
