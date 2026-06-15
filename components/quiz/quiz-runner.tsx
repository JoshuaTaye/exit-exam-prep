"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Clock, Flag, ChevronLeft, ChevronRight, CheckCircle2, XCircle,
  BookOpen, Loader2, RotateCcw, Star, Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Ring } from "@/components/ui/ring";
import { cn } from "@/lib/utils";
import { difficultyVariant } from "@/lib/colors";
import type { Difficulty } from "@/lib/constants";

interface SafeQuestion {
  id: number;
  externalId: string;
  stem: string;
  options: { A: string; B: string; C: string; D: string };
  difficulty: string;
  questionType: string;
  courseName: string;
  topicName: string;
  topicSlug: string;
}
interface Session {
  examId: number;
  mode: string;
  title: string;
  durationSec: number;
  questions: SafeQuestion[];
}
interface GradeResult {
  score: number;
  correct: number;
  total: number;
  passed: boolean;
  mode: string;
  breakdown: {
    byCourse: { name: string; correct: number; total: number; pct: number }[];
    byDifficulty: { name: string; correct: number; total: number; pct: number }[];
    byType: { name: string; correct: number; total: number; pct: number }[];
  };
  questions: {
    questionId: number; externalId: string; selected: string | null;
    correctAnswer: string; isCorrect: boolean; explanation: string; stem: string;
    options: { A: string; B: string; C: string; D: string };
    difficulty: string; questionType: string; courseName: string; topicName: string;
    noteHref: string;
  }[];
}

const LETTERS = ["A", "B", "C", "D"] as const;

export function QuizRunner({ session }: { session: Session }) {
  const router = useRouter();
  const { questions } = session;
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flags, setFlags] = useState<Record<number, boolean>>({});
  const [times, setTimes] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<GradeResult | null>(null);
  const startRef = useRef(Date.now());
  const enteredRef = useRef(Date.now());

  const timed = session.durationSec > 0;
  const [remaining, setRemaining] = useState(session.durationSec);

  // accumulate time on the leaving question
  function flushTime(forIdx: number) {
    const qid = questions[forIdx].id;
    const delta = Date.now() - enteredRef.current;
    setTimes((t) => ({ ...t, [qid]: (t[qid] ?? 0) + delta }));
    enteredRef.current = Date.now();
  }
  function goto(next: number) {
    if (next === idx) return;
    flushTime(idx);
    setIdx(next);
  }

  const submit = async () => {
    if (submitting || result) return;
    flushTime(idx);
    setSubmitting(true);
    const payload = {
      durationMs: Date.now() - startRef.current,
      answers: questions.map((q) => ({
        questionId: q.id,
        selected: answers[q.id] ?? null,
        timeMs: times[q.id] ?? 0,
      })),
    };
    const res = await fetch(`/api/sessions/${session.examId}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSubmitting(false);
    if (res.ok) {
      setResult(data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      alert(data.error ?? "Failed to submit");
    }
  };
  const submitRef = useRef(submit);
  submitRef.current = submit;
  const idxRef = useRef(idx);
  idxRef.current = idx;
  const gotoRef = useRef(goto);
  gotoRef.current = goto;

  const [reviewAdded, setReviewAdded] = useState<Record<number, boolean>>({});
  async function addReview(qid: number) {
    setReviewAdded((s) => ({ ...s, [qid]: true }));
    await fetch("/api/review", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId: qid }),
    });
  }

  // keyboard shortcuts
  useEffect(() => {
    if (result) return;
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (e.metaKey || e.ctrlKey || el?.tagName === "INPUT" || el?.tagName === "TEXTAREA") return;
      const cur = questions[idxRef.current];
      const k = e.key.toLowerCase();
      if (["a", "b", "c", "d"].includes(k)) {
        setAnswers((a) => ({ ...a, [cur.id]: k.toUpperCase() }));
      } else if (["1", "2", "3", "4"].includes(k)) {
        setAnswers((a) => ({ ...a, [cur.id]: LETTERS[Number(k) - 1] }));
      } else if (e.key === "ArrowRight") {
        gotoRef.current(Math.min(questions.length - 1, idxRef.current + 1));
      } else if (e.key === "ArrowLeft") {
        gotoRef.current(Math.max(0, idxRef.current - 1));
      } else if (k === "f") {
        setFlags((f) => ({ ...f, [cur.id]: !f[cur.id] }));
      } else if (e.key === "Enter") {
        if (idxRef.current === questions.length - 1) submitRef.current();
        else gotoRef.current(idxRef.current + 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [result, questions]);

  // timer
  useEffect(() => {
    if (!timed || result) return;
    const t = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(t);
          submitRef.current();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [timed, result]);

  const answeredCount = Object.keys(answers).length;

  if (result) return <ResultsView result={result} onRetry={() => router.push("/practice")} onAddReview={addReview} reviewAdded={reviewAdded} />;

  const q = questions[idx];
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">{session.title}</h1>
          <p className="text-sm text-muted-foreground">
            Question {idx + 1} of {questions.length} · {answeredCount} answered
          </p>
        </div>
        <div className="flex items-center gap-3">
          {timed && (
            <div
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-2 font-mono text-sm font-semibold",
                remaining < 60 ? "border-destructive text-destructive" : "",
              )}
            >
              <Clock size={16} />
              {mm}:{ss}
            </div>
          )}
          <Button onClick={submit} disabled={submitting} variant="success">
            {submitting && <Loader2 className="animate-spin" />}
            Submit
          </Button>
        </div>
      </div>

      <Progress value={((idx + 1) / questions.length) * 100} />

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{q.courseName}</Badge>
            <Badge variant="outline">{q.topicName}</Badge>
            <Badge variant={difficultyVariant[q.difficulty as Difficulty]}>{q.difficulty}</Badge>
            <Badge variant="muted">{q.questionType}</Badge>
            <button
              onClick={() => addReview(q.id)}
              className="ml-auto inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
              title="Add to review list"
            >
              {reviewAdded[q.id] ? <Check size={13} className="text-success" /> : <Star size={13} />}
              {reviewAdded[q.id] ? "Saved" : "Review later"}
            </button>
            <span className="text-xs text-muted-foreground">{q.externalId}</span>
          </div>
          <CardTitle className="pt-2 text-base leading-relaxed sm:text-lg [overflow-wrap:anywhere]">{q.stem}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {LETTERS.map((L) => {
            const selected = answers[q.id] === L;
            return (
              <button
                key={L}
                onClick={() => setAnswers((a) => ({ ...a, [q.id]: L }))}
                className={cn(
                  "flex w-full items-start gap-3 rounded-lg border p-3 text-left text-sm transition-colors",
                  selected
                    ? "border-primary bg-primary/10 ring-1 ring-primary"
                    : "hover:bg-accent",
                )}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
                    selected ? "border-primary bg-primary text-primary-foreground" : "",
                  )}
                >
                  {L}
                </span>
                <span className="pt-0.5 [overflow-wrap:anywhere]">{q.options[L]}</span>
              </button>
            );
          })}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => goto(Math.max(0, idx - 1))} disabled={idx === 0}>
          <ChevronLeft /> Previous
        </Button>
        <Button
          variant={flags[q.id] ? "warning" : "ghost"}
          onClick={() => setFlags((f) => ({ ...f, [q.id]: !f[q.id] }))}
        >
          <Flag /> {flags[q.id] ? "Flagged" : "Flag"}
        </Button>
        <Button
          variant="outline"
          onClick={() => goto(Math.min(questions.length - 1, idx + 1))}
          disabled={idx === questions.length - 1}
        >
          Next <ChevronRight />
        </Button>
      </div>

      {/* Question palette */}
      <Card>
        <CardContent className="flex flex-wrap gap-2 p-4">
          {questions.map((qq, i) => {
            const isAnswered = answers[qq.id] != null;
            const isFlagged = flags[qq.id];
            return (
              <button
                key={qq.id}
                onClick={() => goto(i)}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-md border text-xs font-semibold transition-colors",
                  i === idx && "ring-2 ring-primary",
                  isFlagged
                    ? "border-warning bg-warning/15 text-[hsl(38_92%_38%)]"
                    : isAnswered
                      ? "border-primary bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent",
                )}
              >
                {i + 1}
              </button>
            );
          })}
        </CardContent>
      </Card>

      <p className="hidden text-center text-xs text-muted-foreground lg:block">
        Shortcuts: <Kbd>A</Kbd>–<Kbd>D</Kbd> select · <Kbd>←</Kbd> <Kbd>→</Kbd> navigate · <Kbd>F</Kbd> flag · <Kbd>Enter</Kbd> next
      </p>
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">{children}</kbd>;
}

function ResultsView({
  result, onRetry, onAddReview, reviewAdded,
}: {
  result: GradeResult; onRetry: () => void;
  onAddReview: (qid: number) => void; reviewAdded: Record<number, boolean>;
}) {
  const ringColor = result.passed ? "hsl(var(--success))" : "hsl(var(--destructive))";
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-8 sm:flex-row sm:justify-around">
          <Ring value={result.score} color={ringColor} label="Score" sublabel={`${result.correct}/${result.total} correct`} />
          <div className="space-y-2 text-center sm:text-left">
            <Badge variant={result.passed ? "success" : "destructive"} className="text-sm">
              {result.passed ? "Pass (≥ 70%)" : "Below pass mark"}
            </Badge>
            <h2 className="text-2xl font-bold capitalize">{result.mode} complete</h2>
            <p className="max-w-md text-sm text-muted-foreground">
              Wrong answers are saved to your Mistake Journal and scheduled for spaced review.
              Use “Review Notes” on any question to study the underlying concept.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Button onClick={onRetry}><RotateCcw /> More practice</Button>
              <Link href="/mistakes"><Button variant="outline">View Mistake Journal</Button></Link>
              <Link href="/analytics"><Button variant="ghost">Analytics</Button></Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <BreakdownCard title="By Course" rows={result.breakdown.byCourse} />
        <BreakdownCard title="By Difficulty" rows={result.breakdown.byDifficulty} />
        <BreakdownCard title="By Question Type" rows={result.breakdown.byType} />
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Review ({result.questions.length})</h3>
        {result.questions.map((q, i) => (
          <Card key={q.questionId} className={cn(q.isCorrect ? "border-success/40" : "border-destructive/40")}>
            <CardContent className="space-y-3 p-4">
              <div className="flex items-start gap-2">
                {q.isCorrect ? (
                  <CheckCircle2 className="mt-0.5 shrink-0 text-success" size={18} />
                ) : (
                  <XCircle className="mt-0.5 shrink-0 text-destructive" size={18} />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {i + 1}. {q.stem}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs">
                    <Badge variant="secondary">{q.courseName}</Badge>
                    <Badge variant="outline">{q.topicName}</Badge>
                    <Badge variant={difficultyVariant[q.difficulty as Difficulty]}>{q.difficulty}</Badge>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5 pl-7">
                {LETTERS.map((L) => {
                  const isCorrect = q.correctAnswer === L;
                  const isSelected = q.selected === L;
                  return (
                    <div
                      key={L}
                      className={cn(
                        "rounded-md border px-3 py-1.5 text-sm",
                        isCorrect && "border-success bg-success/10",
                        isSelected && !isCorrect && "border-destructive bg-destructive/10",
                      )}
                    >
                      <span className="font-semibold">{L}.</span> {q.options[L]}
                      {isCorrect && <span className="ml-2 text-xs font-medium text-success">✓ correct</span>}
                      {isSelected && !isCorrect && (
                        <span className="ml-2 text-xs font-medium text-destructive">your answer</span>
                      )}
                    </div>
                  );
                })}
                {q.selected === null && (
                  <p className="text-xs italic text-muted-foreground">Skipped — counted as incorrect.</p>
                )}
              </div>
              <div className="ml-7 rounded-md bg-muted p-3 text-sm">
                <p className="text-muted-foreground">{q.explanation}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Link href={q.noteHref}>
                    <Button size="sm" variant="outline"><BookOpen /> Review Notes: {q.topicName}</Button>
                  </Link>
                  <Button
                    size="sm"
                    variant={reviewAdded[q.questionId] ? "success" : "ghost"}
                    onClick={() => onAddReview(q.questionId)}
                  >
                    {reviewAdded[q.questionId] ? <Check /> : <Star />}
                    {reviewAdded[q.questionId] ? "Added to review" : "Add to Review List"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function BreakdownCard({
  title, rows,
}: { title: string; rows: { name: string; correct: number; total: number; pct: number }[] }) {
  return (
    <Card>
      <CardHeader className="pb-2"><CardTitle className="text-sm">{title}</CardTitle></CardHeader>
      <CardContent className="space-y-2.5">
        {rows.length === 0 && <p className="text-xs text-muted-foreground">No data.</p>}
        {rows.map((r) => (
          <div key={r.name} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="truncate pr-2">{r.name}</span>
              <span className="tabular-nums text-muted-foreground">{r.correct}/{r.total} · {r.pct}%</span>
            </div>
            <Progress
              value={r.pct}
              indicatorClassName={r.pct >= 70 ? "bg-success" : r.pct >= 50 ? "bg-warning" : "bg-destructive"}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
