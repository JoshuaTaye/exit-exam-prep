"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PlayCircle, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { listDrafts, clearDraft, type QuizDraft } from "@/lib/quiz-draft";

export function ResumeBanner() {
  const router = useRouter();
  const [drafts, setDrafts] = useState<QuizDraft[] | null>(null);

  useEffect(() => {
    setDrafts(listDrafts());
  }, []);

  if (!drafts || drafts.length === 0) return null;

  function discard(examId: number) {
    clearDraft(examId);
    setDrafts((d) => (d ?? []).filter((x) => x.examId !== examId));
  }

  return (
    <div className="space-y-2">
      {drafts.map((d) => {
        const answered = Object.keys(d.answers ?? {}).length;
        return (
          <Card key={d.examId} className="border-primary/40 bg-primary/5">
            <CardContent className="flex flex-wrap items-center gap-3 p-4">
              <PlayCircle className="shrink-0 text-primary" size={22} />
              <div className="min-w-[12rem] flex-1">
                <p className="text-sm font-semibold">Resume: {d.title}</p>
                <p className="text-xs text-muted-foreground">
                  {answered} of {d.total} answered · saved {timeAgo(d.updatedAt)}
                </p>
                <Progress value={(answered / d.total) * 100} className="mt-1.5 h-1.5" />
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={() => router.push(`/session/${d.examId}`)}>
                  Resume
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => discard(d.examId)}
                  title="Discard draft"
                >
                  <X size={15} /> Discard
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
