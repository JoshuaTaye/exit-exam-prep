import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSessionQuestions } from "@/lib/exam-builder";
import { getCurrentUser } from "@/lib/user";
import { QuizRunner } from "@/components/quiz/quiz-runner";
import type { ExamMode } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const examId = Number(id);
  if (!Number.isFinite(examId)) notFound();

  const user = await getCurrentUser();
  const exam = await prisma.exam.findUnique({ where: { id: examId } });
  if (!exam || exam.userId !== user.id) notFound();

  // Already graded → could redirect; for simplicity allow re-take by rebuilding.
  const questions = await getSessionQuestions(examId);

  return (
    <QuizRunner
      session={{
        examId,
        mode: exam.mode as ExamMode,
        title: exam.title,
        durationSec: exam.durationSec,
        questions,
      }}
    />
  );
}
