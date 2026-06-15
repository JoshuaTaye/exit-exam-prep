import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/user";
import { getCourseNotes } from "@/lib/notes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StartQuizButton } from "@/components/quiz/start-quiz-button";
import { NotesReader } from "@/components/notes/notes-reader";

export const dynamic = "force-dynamic";

export default async function CourseNotesPage({
  params,
  searchParams,
}: {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{ topic?: string }>;
}) {
  const { courseId: courseIdStr } = await params;
  const { topic } = await searchParams;
  const courseId = Number(courseIdStr);
  if (!Number.isFinite(courseId)) notFound();

  const user = await getCurrentUser();
  const notes = await getCourseNotes(courseId, user.id);
  if (!notes) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/notes" className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={15} /> All notes
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <Badge variant="secondary" className="mb-2">{notes.themeName}</Badge>
            <h1 className="text-2xl font-bold tracking-tight">{notes.courseName}</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{notes.generalObjective}</p>
          </div>
          <StartQuizButton spec={{ mode: "course", courseId }}>Quiz this course</StartQuizButton>
        </div>
      </div>

      <NotesReader initialSections={notes.sections} activeSlug={topic} />
    </div>
  );
}
