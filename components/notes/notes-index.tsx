"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Bookmark, CheckCircle2, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface TopicLite { noteId: number; title: string; slug: string; overview: string; completed: boolean; bookmarked: boolean }
interface CourseLite { id: number; name: string; themeName: string; questionCount: number; topics: TopicLite[]; completedCount: number; total: number }
interface BookmarkLite { noteId: number; title: string; courseId: number; slug: string }

export function NotesIndex({ courses, bookmarks }: { courses: CourseLite[]; bookmarks: BookmarkLite[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return courses;
    return courses
      .map((c) => ({
        ...c,
        topics: c.topics.filter(
          (t) =>
            t.title.toLowerCase().includes(term) ||
            t.overview.toLowerCase().includes(term) ||
            c.name.toLowerCase().includes(term),
        ),
      }))
      .filter((c) => c.topics.length > 0 || c.name.toLowerCase().includes(term));
  }, [q, courses]);

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search notes by topic, course, or keyword…"
          className="w-full rounded-lg border bg-card py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {bookmarks.length > 0 && !q && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base"><Bookmark size={18} /> Bookmarked</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {bookmarks.map((b) => (
              <Link key={b.noteId} href={`/notes/${b.courseId}?topic=${b.slug}#${b.slug}`}>
                <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/70">{b.title}</Badge>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((c) => (
          <Card key={c.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-base">{c.name}</CardTitle>
                  <CardDescription>{c.themeName} · {c.questionCount} questions</CardDescription>
                </div>
                <Badge variant="muted">{c.completedCount}/{c.total} done</Badge>
              </div>
              <Progress value={c.total ? (c.completedCount / c.total) * 100 : 0} className="mt-2" indicatorClassName="bg-success" />
            </CardHeader>
            <CardContent className="space-y-1">
              {c.topics.map((t) => (
                <Link
                  key={t.noteId}
                  href={`/notes/${c.id}?topic=${t.slug}#${t.slug}`}
                  className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                >
                  <span className="flex items-center gap-2 truncate">
                    {t.completed && <CheckCircle2 size={14} className="shrink-0 text-success" />}
                    {t.bookmarked && <Bookmark size={14} className="shrink-0 text-primary" />}
                    <span className="truncate">{t.title}</span>
                  </span>
                  <ChevronRight size={16} className="shrink-0 text-muted-foreground" />
                </Link>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
