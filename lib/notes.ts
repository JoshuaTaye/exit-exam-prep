import { prisma } from "./db";

export interface NoteSection {
  noteId: number;
  topicId: number | null;
  title: string;
  slug: string;
  overview: string;
  keyConcepts: string[];
  definitions: { term: string; definition: string }[];
  examples: { title: string; body: string }[];
  diagram: string;
  examTips: string[];
  commonMistakes: string[];
  completed: boolean;
  bookmarked: boolean;
  highlights: string[];
}

export interface CourseNotes {
  courseId: number;
  courseName: string;
  themeName: string;
  generalObjective: string;
  sections: NoteSection[];
}

export async function getCourseNotes(courseId: number, userId: number): Promise<CourseNotes | null> {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { theme: true, notes: { orderBy: { orderIndex: "asc" } } },
  });
  if (!course) return null;

  const noteIds = course.notes.map((n) => n.id);
  const [progress, bookmarks] = await Promise.all([
    prisma.noteProgress.findMany({ where: { userId, noteId: { in: noteIds } } }),
    prisma.bookmark.findMany({ where: { userId, noteId: { in: noteIds } } }),
  ]);
  const progById = new Map(progress.map((p) => [p.noteId, p]));
  const bmSet = new Set(bookmarks.map((b) => b.noteId));

  const sections: NoteSection[] = course.notes.map((n) => {
    const p = progById.get(n.id);
    return {
      noteId: n.id,
      topicId: n.topicId,
      title: n.title,
      slug: n.slug,
      overview: n.overview,
      keyConcepts: JSON.parse(n.keyConcepts),
      definitions: JSON.parse(n.definitions),
      examples: JSON.parse(n.examples),
      diagram: n.diagram,
      examTips: JSON.parse(n.examTips),
      commonMistakes: JSON.parse(n.commonMistakes),
      completed: p?.completed ?? false,
      bookmarked: bmSet.has(n.id),
      highlights: p ? JSON.parse(p.highlights) : [],
    };
  });

  return {
    courseId: course.id,
    courseName: course.name,
    themeName: course.theme.name,
    generalObjective: course.generalObjective,
    sections,
  };
}

export async function getNotesIndex(userId: number) {
  const courses = await prisma.course.findMany({
    include: { theme: true, notes: { orderBy: { orderIndex: "asc" } }, _count: { select: { questions: true } } },
    orderBy: { no: "asc" },
  });
  const allNoteIds = courses.flatMap((c) => c.notes.map((n) => n.id));
  const [progress, bookmarks] = await Promise.all([
    prisma.noteProgress.findMany({ where: { userId, noteId: { in: allNoteIds }, completed: true } }),
    prisma.bookmark.findMany({ where: { userId, noteId: { in: allNoteIds } }, include: { note: true } }),
  ]);
  const completedSet = new Set(progress.map((p) => p.noteId));
  const bmSet = new Set(bookmarks.map((b) => b.noteId));

  return {
    courses: courses.map((c) => ({
      id: c.id,
      name: c.name,
      themeName: c.theme.name,
      questionCount: c._count.questions,
      topics: c.notes.map((n) => ({
        noteId: n.id,
        title: n.title,
        slug: n.slug,
        overview: n.overview,
        completed: completedSet.has(n.id),
        bookmarked: bmSet.has(n.id),
      })),
      completedCount: c.notes.filter((n) => completedSet.has(n.id)).length,
      total: c.notes.length,
    })),
    bookmarks: bookmarks.map((b) => ({
      noteId: b.noteId,
      title: b.note.title,
      courseId: b.note.courseId,
      slug: b.note.slug,
    })),
  };
}
