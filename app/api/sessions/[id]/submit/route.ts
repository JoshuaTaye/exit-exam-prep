import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/user";
import { gradeSession, type SubmittedAnswer } from "@/lib/grading";

// POST /api/sessions/:id/submit  → grade answers, record attempts/mistakes/reviews.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  const { id } = await params;
  const examId = Number(id);
  if (!Number.isFinite(examId)) {
    return NextResponse.json({ error: "Invalid session id" }, { status: 400 });
  }
  const body = await req.json().catch(() => ({}));
  const answers: SubmittedAnswer[] = body.answers ?? [];
  const durationMs: number = body.durationMs ?? 0;

  try {
    const result = await gradeSession(user.id, examId, answers, durationMs);
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed to grade" }, { status: 500 });
  }
}
