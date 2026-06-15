import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/user";
import { prisma } from "@/lib/db";

// PATCH /api/notes/:noteId  { action: "toggleComplete" | "toggleBookmark" | "setHighlights", highlights? }
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ noteId: string }> }) {
  const user = await getCurrentUser();
  const { noteId: noteIdStr } = await params;
  const noteId = Number(noteIdStr);
  const body = await req.json().catch(() => ({}));
  const action = body.action as string;

  if (!Number.isFinite(noteId)) {
    return NextResponse.json({ error: "Invalid note id" }, { status: 400 });
  }

  if (action === "toggleBookmark") {
    const existing = await prisma.bookmark.findUnique({
      where: { userId_noteId: { userId: user.id, noteId } },
    });
    if (existing) {
      await prisma.bookmark.delete({ where: { id: existing.id } });
      return NextResponse.json({ bookmarked: false });
    }
    await prisma.bookmark.create({ data: { userId: user.id, noteId } });
    return NextResponse.json({ bookmarked: true });
  }

  if (action === "toggleComplete") {
    const existing = await prisma.noteProgress.findUnique({
      where: { userId_noteId: { userId: user.id, noteId } },
    });
    const completed = !(existing?.completed ?? false);
    await prisma.noteProgress.upsert({
      where: { userId_noteId: { userId: user.id, noteId } },
      update: { completed },
      create: { userId: user.id, noteId, completed },
    });
    return NextResponse.json({ completed });
  }

  if (action === "setHighlights") {
    const highlights = JSON.stringify(body.highlights ?? []);
    await prisma.noteProgress.upsert({
      where: { userId_noteId: { userId: user.id, noteId } },
      update: { highlights },
      create: { userId: user.id, noteId, highlights },
    });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
