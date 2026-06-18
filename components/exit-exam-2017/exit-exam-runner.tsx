"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Clock, Flag, ChevronLeft, ChevronRight, CheckCircle2, XCircle,
  Loader2, RotateCcw, GraduationCap, Lightbulb, Settings2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Ring } from "@/components/ui/ring";
import { cn } from "@/lib/utils";
import { EXIT_EXAM_2017_QUESTIONS, type Choice, type ExitExam2017Question } from "@/data/exit-exam-2017";

const LETTERS: Choice[] = ["A", "B", "C", "D"];
const MINUTE_PRESETS = [30, 60, 90, 120];
const COUNT_PRESETS = [25, 50, 99];

type Phase = "setup" | "running" | "done";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function ExitExamRunner() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [minutes, setMinutes] = useState(60);
  const [count, setCount] = useState(99);
  const [questions, setQuestions] = useState<ExitExam2017Question[]>([]);

  function start() {
    const m = Math.max(1, Math.min(300, Math.round(minutes)));
    const n = Math.max(1, Math.min(EXIT_EXAM_2017_QUESTIONS.length, Math.round(count)));
    setMinutes(m);
    setQuestions(shuffle(EXIT_EXAM_2017_QUESTIONS).slice(0, n));
    setPhase("running");
  }

  if (phase === "setup") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Settings2 size={18} /> Set up your exam
          </CardTitle>
          <CardDescription>
            Questions appear one at a time under a countdown — just like the official sitting. The exam auto-submits when the timer hits zero.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-medium">Duration (minutes)</p>
            <div className="flex flex-wrap items-center gap-2">
              {MINUTE_PRESETS.map((m) => (
                <button
                  key={m}
                  onClick={() => setMinutes(m)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                    minutes === m ? "border-primary bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent",
                  )}
                >
                  {m} min
                </button>
              ))}
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={1}
                  max={300}
                  value={minutes}
                  onChange={(e) => setMinutes(Number(e.target.value))}
                  className="w-20 rounded-lg border bg-background px-2.5 py-1.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <span className="text-sm text-muted-foreground">custom</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Number of questions</p>
            <div className="flex flex-wrap items-center gap-2">
              {COUNT_PRESETS.map((n) => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                    count === n ? "border-primary bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent",
                  )}
                >
                  {n === EXIT_EXAM_2017_QUESTIONS.length ? `All ${n}` : n}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Questions are drawn at random and shuffled for each attempt.</p>
          </div>

          <Button size="lg" onClick={start}>
            <GraduationCap /> Start exam · {Math.max(1, Math.min(300, Math.round(minutes)))} min
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <ExamSession
      questions={questions}
      durationSec={minutes * 60}
      onRestart={() => setPhase("setup")}
    />
  );
}

function ExamSession({
  questions, durationSec, onRestart,
}: {
  questions: ExitExam2017Question[];
  durationSec: number;
  onRestart: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, Choice>>({});
  const [flags, setFlags] = useState<Record<number, boolean>>({});
  const [remaining, setRemaining] = useState(durationSec);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const submit = () => {
    if (done) return;
    setSubmitting(true);
    setDone(true);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const submitRef = useRef(submit);
  submitRef.current = submit;
  const idxRef = useRef(idx);
  idxRef.current = idx;

  // countdown
  useEffect(() => {
    if (done) return;
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
  }, [done]);

  // keyboard shortcuts (match the live quiz runner)
  useEffect(() => {
    if (done) return;
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (e.metaKey || e.ctrlKey || el?.tagName === "INPUT" || el?.tagName === "TEXTAREA") return;
      const cur = questions[idxRef.current];
      const k = e.key.toLowerCase();
      if (["a", "b", "c", "d"].includes(k)) {
        setAnswers((a) => ({ ...a, [cur.num]: k.toUpperCase() as Choice }));
      } else if (["1", "2", "3", "4"].includes(k)) {
        setAnswers((a) => ({ ...a, [cur.num]: LETTERS[Number(k) - 1] }));
      } else if (e.key === "ArrowRight") {
        setIdx((i) => Math.min(questions.length - 1, i + 1));
      } else if (e.key === "ArrowLeft") {
        setIdx((i) => Math.max(0, i - 1));
      } else if (k === "f") {
        setFlags((f) => ({ ...f, [cur.num]: !f[cur.num] }));
      } else if (e.key === "Enter") {
        if (idxRef.current === questions.length - 1) submitRef.current();
        else setIdx((i) => i + 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [done, questions]);

  const result = useMemo(() => {
    if (!done) return null;
    const correct = questions.filter((q) => answers[q.num] === q.answer).length;
    const total = questions.length;
    const score = total ? Math.round((correct / total) * 100) : 0;
    const byCat = new Map<string, { correct: number; total: number }>();
    for (const q of questions) {
      const c = byCat.get(q.category) ?? { correct: 0, total: 0 };
      c.total += 1;
      if (answers[q.num] === q.answer) c.correct += 1;
      byCat.set(q.category, c);
    }
    const breakdown = [...byCat.entries()]
      .map(([name, v]) => ({ name, ...v, pct: Math.round((v.correct / v.total) * 100) }))
      .sort((a, b) => a.pct - b.pct);
    return { correct, total, score, passed: score >= 70, breakdown };
  }, [done, questions, answers]);

  if (done && result) {
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
              <h2 className="text-2xl font-bold">Exam complete</h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Review every question below — the correct answer and a full explanation are shown for each.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <Button onClick={onRestart}><RotateCcw /> New exam</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">By topic</CardTitle></CardHeader>
          <CardContent className="grid gap-2.5 sm:grid-cols-2">
            {result.breakdown.map((r) => (
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

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Review ({questions.length})</h3>
          {questions.map((q, i) => {
            const picked = answers[q.num] ?? null;
            const isCorrect = picked === q.answer;
            return (
              <Card key={q.num} className={cn(isCorrect ? "border-success/40" : "border-destructive/40")}>
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-start gap-2">
                    {isCorrect
                      ? <CheckCircle2 className="mt-0.5 shrink-0 text-success" size={18} />
                      : <XCircle className="mt-0.5 shrink-0 text-destructive" size={18} />}
                    <div className="flex-1">
                      <p className="whitespace-pre-wrap text-sm font-medium [overflow-wrap:anywhere]">{`${i + 1}. ${q.stem}`}</p>
                      <div className="mt-1 flex flex-wrap gap-2 text-xs">
                        <Badge variant="secondary">Q{q.num}</Badge>
                        <Badge variant="outline">{q.category}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5 pl-7">
                    {LETTERS.map((L) => {
                      const correctOpt = q.answer === L;
                      const selectedOpt = picked === L;
                      return (
                        <div
                          key={L}
                          className={cn(
                            "rounded-md border px-3 py-1.5 text-sm",
                            correctOpt && "border-success bg-success/10",
                            selectedOpt && !correctOpt && "border-destructive bg-destructive/10",
                          )}
                        >
                          <span className="font-semibold">{L}.</span>{" "}
                          <span className="[overflow-wrap:anywhere]">{q.options[L]}</span>
                          {correctOpt && <span className="ml-2 text-xs font-medium text-success">✓ correct</span>}
                          {selectedOpt && !correctOpt && <span className="ml-2 text-xs font-medium text-destructive">your answer</span>}
                        </div>
                      );
                    })}
                    {picked === null && <p className="text-xs italic text-muted-foreground">Skipped — counted as incorrect.</p>}
                  </div>
                  <div className="ml-7 rounded-md bg-muted p-3 text-sm">
                    <p className="mb-1 inline-flex items-center gap-1.5 font-semibold">
                      <Lightbulb size={14} className="text-warning" /> Answer: {q.answer}
                    </p>
                    <p className="leading-relaxed text-muted-foreground [overflow-wrap:anywhere]">{q.explanation}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  const q = questions[idx];
  const answeredCount = Object.keys(answers).length;
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Exit Exam 2017 — Exam</h2>
          <p className="text-sm text-muted-foreground">
            Question {idx + 1} of {questions.length} · {answeredCount} answered
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex items-center gap-2 rounded-lg border px-3 py-2 font-mono text-sm font-semibold",
              remaining < 60 ? "border-destructive text-destructive" : "",
            )}
          >
            <Clock size={16} /> {mm}:{ss}
          </div>
          <Button onClick={submit} disabled={submitting} variant="success">
            {submitting && <Loader2 className="animate-spin" />} Submit
          </Button>
        </div>
      </div>

      <Progress value={((idx + 1) / questions.length) * 100} />

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Q{q.num}</Badge>
            <Badge variant="outline">{q.category}</Badge>
          </div>
          <p className="whitespace-pre-wrap pt-2 text-base font-semibold leading-relaxed tracking-tight sm:text-lg [overflow-wrap:anywhere]">
            {q.stem}
          </p>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {LETTERS.map((L) => {
            const selected = answers[q.num] === L;
            return (
              <button
                key={L}
                onClick={() => setAnswers((a) => ({ ...a, [q.num]: L }))}
                className={cn(
                  "flex w-full items-start gap-3 rounded-lg border p-3 text-left text-sm transition-colors",
                  selected ? "border-primary bg-primary/10 ring-1 ring-primary" : "hover:bg-accent",
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
        <Button variant="outline" onClick={() => setIdx((i) => Math.max(0, i - 1))} disabled={idx === 0}>
          <ChevronLeft /> Previous
        </Button>
        <Button
          variant={flags[q.num] ? "warning" : "ghost"}
          onClick={() => setFlags((f) => ({ ...f, [q.num]: !f[q.num] }))}
        >
          <Flag /> {flags[q.num] ? "Flagged" : "Flag"}
        </Button>
        <Button
          variant="outline"
          onClick={() => setIdx((i) => Math.min(questions.length - 1, i + 1))}
          disabled={idx === questions.length - 1}
        >
          Next <ChevronRight />
        </Button>
      </div>

      <Card>
        <CardContent className="flex flex-wrap gap-2 p-4">
          {questions.map((qq, i) => {
            const isAnswered = answers[qq.num] != null;
            const isFlagged = flags[qq.num];
            return (
              <button
                key={qq.num}
                onClick={() => setIdx(i)}
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
