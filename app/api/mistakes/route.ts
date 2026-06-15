import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/user";
import { prisma } from "@/lib/db";

// PATCH /api/mistakes { questionId, action: "understood" | "reopen" }
export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  const body = await req.json().catch(() => ({}));
  const questionId = Number(body.questionId);
  const action = body.action as string;
  if (!Number.isFinite(questionId)) {
    return NextResponse.json({ error: "questionId required" }, { status: 400 });
  }

  if (action === "understood") {
    await prisma.mistake.updateMany({
      where: { userId: user.id, questionId, resolved: false },
      data: { resolved: true },
    });
    return NextResponse.json({ resolved: true });
  }
  if (action === "reopen") {
    await prisma.mistake.updateMany({
      where: { userId: user.id, questionId },
      data: { resolved: false },
    });
    return NextResponse.json({ resolved: false });
  }
  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
