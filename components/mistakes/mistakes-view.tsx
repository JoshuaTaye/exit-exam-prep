"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, ChevronDown, CheckCircle2, Check, RotateCcw, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StartQuizButton } from "@/components/quiz/start-quiz-button";
import { cn } from "@/lib/utils";
import { difficultyVariant } from "@/lib/colors";
import type { Difficulty } from "@/lib/constants";

interface Entry {
  id: number; questionId: number; externalId: string; stem: string;
  selectedAnswer: string; selectedText: string; correctAnswer: string; correctText: string;
  explanation: string; difficulty: string; questionType: string;
  courseName: string; topicName: string; topicSlug: string; courseId: number; topicId: number;
  attemptNumber: number; resolved: boolean; createdAt: string; noteHref: string;
}

type GroupBy = "course" | "topic" | "difficulty" | "date";

export function MistakesView({ entries }: { entries: Entry[] }) {
  const [groupBy, setGroupBy] = useState<GroupBy>("course");
  const [showResolved, setShowResolved] = useState(true);

  const filtered = showResolved ? entries : entries.filter((e) => !e.resolved);

  const groups = useMemo(() => {
    const m = new Map<string, Entry[]>();
    for (const e of filtered) {
      let key: string;
      switch (groupBy) {
        case "course": key = e.courseName; break;
        case "topic": key = `${e.courseName} › ${e.topicName}`; break;
        case "difficulty": key = e.difficulty; break;
        case "date": key = new Date(e.createdAt).toLocaleDateString(); break;
      }
      (m.get(key) ?? m.set(key, []).get(key)!).push(e);
    }
    return [...m.entries()].sort((a, b) => b[1].length - a[1].length);
  }, [filtered, groupBy]);

  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <CheckCircle2 className="mx-auto mb-3 text-success" size={36} />
          <p className="font-medium">No mistakes recorded yet.</p>
          <p className="text-sm text-muted-foreground">
            Take a quiz — every wrong answer lands here, permanently, with a direct link to the relevant notes.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium">Group by:</span>
        {(["course", "topic", "difficulty", "date"] as GroupBy[]).map((g) => (
          <Button key={g} size="sm" variant={groupBy === g ? "default" : "outline"} onClick={() => setGroupBy(g)}>
            {g[0].toUpperCase() + g.slice(1)}
          </Button>
        ))}
        <label className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
          <input type="checkbox" checked={showResolved} onChange={(e) => setShowResolved(e.target.checked)} />
          Show resolved
        </label>
      </div>

      {groups.map(([key, list]) => (
        <GroupBlock key={key} title={key} entries={list} />
      ))}
    </div>
  );
}

function GroupBlock({ title, entries }: { title: string; entries: Entry[] }) {
  const [open, setOpen] = useState(false);
  return (
    <Card>
      <button className="flex w-full items-center justify-between p-4 text-left" onClick={() => setOpen((o) => !o)}>
        <div className="flex items-center gap-3">
          <span className="font-semibold">{title}</span>
          <Badge variant="destructive">{entries.length} mistake{entries.length > 1 ? "s" : ""}</Badge>
        </div>
        <ChevronDown className={cn("transition-transform", open && "rotate-180")} size={18} />
      </button>
      {open && (
        <CardContent className="space-y-3 border-t pt-4">
          {entries.map((e) => (
            <MistakeRow key={e.id} e={e} />
          ))}
        </CardContent>
      )}
    </Card>
  );
}

function MistakeRow({ e }: { e: Entry }) {
  return (
    <div className={cn("rounded-lg border p-3", e.resolved && "opacity-70")}>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{e.courseName}</Badge>
        <Badge variant="outline">{e.topicName}</Badge>
        <Badge variant={difficultyVariant[e.difficulty as Difficulty]}>{e.difficulty}</Badge>
        {e.attemptNumber > 1 && <Badge variant="warning">attempt #{e.attemptNumber}</Badge>}
        {e.resolved && <Badge variant="success">resolved</Badge>}
        <span className="ml-auto text-xs text-muted-foreground">
          {new Date(e.createdAt).toLocaleDateString()} · {e.externalId}
        </span>
      </div>
      <p className="text-sm font-medium">{e.stem}</p>
      <div className="mt-2 grid gap-1.5 text-sm sm:grid-cols-2">
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-1.5">
          <span className="text-xs font-medium text-destructive">Your answer:</span>{" "}
          <span className="font-semibold">{e.selectedAnswer}.</span> {e.selectedText}
        </div>
        <div className="rounded-md border border-success/40 bg-success/10 px-3 py-1.5">
          <span className="text-xs font-medium text-success">Correct:</span>{" "}
          <span className="font-semibold">{e.correctAnswer}.</span> {e.correctText}
        </div>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{e.explanation}</p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <Link href={e.noteHref}>
          <Button size="sm" variant="outline"><BookOpen /> Open Notes</Button>
        </Link>
        <StartQuizButton spec={{ mode: "topic", topicId: e.topicId, n: 10 }} size="sm" variant="ghost">
          <RotateCcw /> Retake similar
        </StartQuizButton>
        {!e.resolved && <MarkUnderstood questionId={e.questionId} />}
      </div>
    </div>
  );
}

function MarkUnderstood({ questionId }: { questionId: number }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <Button
      size="sm" variant="ghost"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await fetch("/api/mistakes", {
          method: "PATCH", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questionId, action: "understood" }),
        });
        router.refresh();
      }}
    >
      {busy ? <Loader2 className="animate-spin" /> : <Check />} Mark understood
    </Button>
  );
}
