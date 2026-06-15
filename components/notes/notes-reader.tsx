"use client";

import { useEffect, useRef, useState, Fragment } from "react";
import {
  Bookmark, BookmarkCheck, CheckCircle2, Circle, Highlighter, Eraser,
  Lightbulb, AlertTriangle, BookText,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Section {
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

// Render text with any highlighted substrings wrapped in <mark>.
function HL({ text, highlights, onRemove }: { text: string; highlights: string[]; onRemove: (s: string) => void }) {
  if (highlights.length === 0) return <>{text}</>;
  const sorted = [...highlights].sort((a, b) => b.length - a.length);
  let parts: (string | { hl: string })[] = [text];
  for (const h of sorted) {
    const next: typeof parts = [];
    for (const p of parts) {
      if (typeof p !== "string") { next.push(p); continue; }
      let rest = p;
      let i = rest.indexOf(h);
      while (i !== -1) {
        if (i > 0) next.push(rest.slice(0, i));
        next.push({ hl: h });
        rest = rest.slice(i + h.length);
        i = rest.indexOf(h);
      }
      if (rest) next.push(rest);
    }
    parts = next;
  }
  return (
    <>
      {parts.map((p, i) =>
        typeof p === "string" ? (
          <Fragment key={i}>{p}</Fragment>
        ) : (
          <mark key={i} className="note-hl cursor-pointer" title="Click to remove highlight" onClick={() => onRemove(p.hl)}>
            {p.hl}
          </mark>
        ),
      )}
    </>
  );
}

export function NotesReader({ initialSections, activeSlug }: { initialSections: Section[]; activeSlug?: string }) {
  const [sections, setSections] = useState(initialSections);
  const [pending, setPending] = useState<{ noteId: number; text: string; x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to deep-linked section.
  useEffect(() => {
    if (activeSlug) {
      const el = document.getElementById(activeSlug);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        el.classList.add("ring-2", "ring-primary");
        const t = setTimeout(() => el.classList.remove("ring-2", "ring-primary"), 1800);
        return () => clearTimeout(t);
      }
    }
  }, [activeSlug]);

  async function patch(noteId: number, body: any) {
    const res = await fetch(`/api/notes/${noteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.json();
  }

  function update(noteId: number, patchFn: (s: Section) => Section) {
    setSections((prev) => prev.map((s) => (s.noteId === noteId ? patchFn(s) : s)));
  }

  async function toggleBookmark(noteId: number) {
    const r = await patch(noteId, { action: "toggleBookmark" });
    update(noteId, (s) => ({ ...s, bookmarked: r.bookmarked }));
  }
  async function toggleComplete(noteId: number) {
    const r = await patch(noteId, { action: "toggleComplete" });
    update(noteId, (s) => ({ ...s, completed: r.completed }));
  }
  async function setHighlights(noteId: number, highlights: string[]) {
    update(noteId, (s) => ({ ...s, highlights }));
    await patch(noteId, { action: "setHighlights", highlights });
  }

  function onMouseUp() {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) { setPending(null); return; }
    const text = sel.toString().trim();
    if (text.length < 4) { setPending(null); return; }
    let node = sel.anchorNode as HTMLElement | null;
    while (node && !(node instanceof HTMLElement && node.dataset.noteId)) node = node.parentElement;
    if (!node) { setPending(null); return; }
    const rect = sel.getRangeAt(0).getBoundingClientRect();
    setPending({
      noteId: Number((node as HTMLElement).dataset.noteId),
      text,
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    });
  }

  function addPending() {
    if (!pending) return;
    const s = sections.find((x) => x.noteId === pending.noteId);
    if (s && !s.highlights.includes(pending.text)) {
      setHighlights(pending.noteId, [...s.highlights, pending.text]);
    }
    setPending(null);
    window.getSelection()?.removeAllRanges();
  }

  const completedCount = sections.filter((s) => s.completed).length;

  return (
    <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-8">
      {/* Table of contents */}
      <aside className="mb-6 lg:sticky lg:top-6 lg:mb-0 lg:self-start">
        <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
          Contents · {completedCount}/{sections.length}
        </p>
        <nav className="space-y-1">
          {sections.map((s) => (
            <a
              key={s.noteId}
              href={`#${s.slug}`}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              {s.completed ? <CheckCircle2 size={14} className="shrink-0 text-success" /> : <Circle size={14} className="shrink-0" />}
              <span className="truncate">{s.title}</span>
            </a>
          ))}
        </nav>
      </aside>

      {/* Sections */}
      <div ref={containerRef} onMouseUp={onMouseUp} className="space-y-6">
        {sections.map((s) => (
          <Card key={s.noteId} id={s.slug} className="scroll-mt-6 transition-shadow">
            <CardContent className="space-y-4 p-5" data-note-id={s.noteId}>
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-bold">{s.title}</h2>
                <div className="flex shrink-0 gap-1">
                  {s.highlights.length > 0 && (
                    <Button size="sm" variant="ghost" onClick={() => setHighlights(s.noteId, [])} title="Clear highlights">
                      <Eraser size={15} />
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => toggleBookmark(s.noteId)} title="Bookmark">
                    {s.bookmarked ? <BookmarkCheck size={15} className="text-primary" /> : <Bookmark size={15} />}
                  </Button>
                  <Button
                    size="sm"
                    variant={s.completed ? "success" : "outline"}
                    onClick={() => toggleComplete(s.noteId)}
                  >
                    {s.completed ? <CheckCircle2 size={15} /> : <Circle size={15} />}
                    {s.completed ? "Completed" : "Mark done"}
                  </Button>
                </div>
              </div>

              <p className="leading-relaxed text-foreground/90">
                <HL text={s.overview} highlights={s.highlights} onRemove={(h) => setHighlights(s.noteId, s.highlights.filter((x) => x !== h))} />
              </p>

              <Block icon={BookText} title="Key concepts">
                <ul className="list-disc space-y-1 pl-5 text-sm">
                  {s.keyConcepts.map((k, i) => (
                    <li key={i}><HL text={k} highlights={s.highlights} onRemove={(h) => setHighlights(s.noteId, s.highlights.filter((x) => x !== h))} /></li>
                  ))}
                </ul>
              </Block>

              <Block title="Definitions">
                <dl className="space-y-1.5 text-sm">
                  {s.definitions.map((d, i) => (
                    <div key={i}>
                      <dt className="inline font-semibold">{d.term}: </dt>
                      <dd className="inline text-foreground/90">
                        <HL text={d.definition} highlights={s.highlights} onRemove={(h) => setHighlights(s.noteId, s.highlights.filter((x) => x !== h))} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </Block>

              {s.examples.length > 0 && (
                <Block title="Worked examples">
                  <div className="space-y-2">
                    {s.examples.map((ex, i) => (
                      <div key={i} className="rounded-md bg-muted p-3 text-sm">
                        <p className="font-medium">{ex.title}</p>
                        <p className="text-foreground/90">
                          <HL text={ex.body} highlights={s.highlights} onRemove={(h) => setHighlights(s.noteId, s.highlights.filter((x) => x !== h))} />
                        </p>
                      </div>
                    ))}
                  </div>
                </Block>
              )}

              {s.diagram && (
                <Block title="Diagram">
                  <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs leading-relaxed">{s.diagram}</pre>
                </Block>
              )}

              <Block icon={Lightbulb} title="Exam tips" tone="warning">
                <ul className="list-disc space-y-1 pl-5 text-sm">
                  {s.examTips.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </Block>

              <Block icon={AlertTriangle} title="Common mistakes" tone="destructive">
                <ul className="list-disc space-y-1 pl-5 text-sm">
                  {s.commonMistakes.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </Block>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Floating highlight toolbar */}
      {pending && (
        <button
          onClick={addPending}
          style={{ position: "fixed", left: pending.x, top: pending.y, transform: "translate(-50%, -100%)" }}
          className="z-50 flex items-center gap-1 rounded-md bg-foreground px-2.5 py-1.5 text-xs font-medium text-background shadow-lg"
        >
          <Highlighter size={13} /> Highlight
        </button>
      )}
    </div>
  );
}

function Block({
  title, children, icon: Icon, tone,
}: { title: string; children: React.ReactNode; icon?: any; tone?: "warning" | "destructive" }) {
  return (
    <div>
      <h3 className={cn(
        "mb-1.5 flex items-center gap-1.5 text-sm font-semibold",
        tone === "warning" && "text-[hsl(38_92%_38%)]",
        tone === "destructive" && "text-destructive",
      )}>
        {Icon && <Icon size={15} />} {title}
      </h3>
      {children}
    </div>
  );
}
