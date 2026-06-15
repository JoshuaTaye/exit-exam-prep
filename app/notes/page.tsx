import { getCurrentUser } from "@/lib/user";
import { getNotesIndex } from "@/lib/notes";
import { PageHeader } from "@/components/page-header";
import { NotesIndex } from "@/components/notes/notes-index";

export const dynamic = "force-dynamic";

export default async function NotesPage() {
  const user = await getCurrentUser();
  const { courses, bookmarks } = await getNotesIndex(user.id);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Study Notes"
        description="Comprehensive notes for every course and learning outcome in the blueprint — overview, key concepts, definitions, worked examples, exam tips, and common mistakes. Search, bookmark, highlight, and track what you've completed."
      />
      <NotesIndex courses={courses} bookmarks={bookmarks} />
    </div>
  );
}
