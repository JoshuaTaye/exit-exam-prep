import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/user";
import {
  buildQuickQuiz, buildTopicQuiz, buildCourseQuiz,
  buildWeaknessQuiz, buildMistakeQuiz, buildSimulation, buildDiagnostic,
  buildSingleQuiz,
} from "@/lib/exam-builder";

// POST /api/sessions  → create a practice/exam session and return safe questions.
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  const body = await req.json().catch(() => ({}));
  const { mode, topicId, courseId, n, questionId, questionIds } = body as {
    mode: string; topicId?: number; courseId?: number; n?: number;
    questionId?: number; questionIds?: number[];
  };

  try {
    let session;
    switch (mode) {
      case "quick": session = await buildQuickQuiz(user.id, n ?? 10); break;
      case "topic":
        if (!topicId) return NextResponse.json({ error: "topicId required" }, { status: 400 });
        session = await buildTopicQuiz(user.id, topicId, n ?? 12); break;
      case "course":
        if (!courseId) return NextResponse.json({ error: "courseId required" }, { status: 400 });
        session = await buildCourseQuiz(user.id, courseId); break;
      case "weakness": session = await buildWeaknessQuiz(user.id, n ?? 15); break;
      case "mistake": session = await buildMistakeQuiz(user.id, n ?? 15, questionIds); break;
      case "simulation": session = await buildSimulation(user.id); break;
      case "diagnostic": session = await buildDiagnostic(user.id); break;
      case "single":
        if (!questionId) return NextResponse.json({ error: "questionId required" }, { status: 400 });
        session = await buildSingleQuiz(user.id, questionId); break;
      default: return NextResponse.json({ error: "Unknown mode" }, { status: 400 });
    }
    if (session.questions.length === 0) {
      return NextResponse.json({ error: "No questions available for this selection." }, { status: 422 });
    }
    return NextResponse.json(session);
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed to build session" }, { status: 500 });
  }
}
