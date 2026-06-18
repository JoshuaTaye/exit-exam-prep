"use client";

import { useMemo, useState } from "react";
import {
  Search, CheckCircle2, XCircle, Eye, EyeOff, GraduationCap,
  BookOpenCheck, RotateCcw, Lightbulb, Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  EXIT_EXAM_2017_QUESTIONS,
  EXIT_EXAM_2017_CATEGORIES,
  type Choice,
} from "@/data/exit-exam-2017";
import { ExitExamRunner } from "./exit-exam-runner";

const LETTERS: Choice[] = ["A", "B", "C", "D"];
type Mode = "study" | "practice" | "exam";

export function ExitExamView() {
  const [mode, setMode] = useState<Mode>("study");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [selected, setSelected] = useState<Record<number, Choice>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return EXIT_EXAM_2017_QUESTIONS.filter((item) => {
      if (category !== "All" && item.category !== category) return false;
      if (!q) return true;
      const hay = `${item.num} ${item.stem} ${Object.values(item.options).join(" ")} ${item.category}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query, category]);

  // Practice-mode score (only counts answered questions across the whole exam).
  const answeredNums = Object.keys(selected).map(Number);
  const correctCount = answeredNums.filter(
    (n) => selected[n] === EXIT_EXAM_2017_QUESTIONS.find((x) => x.num === n)!.answer,
  ).length;
  const answeredCount = answeredNums.length;
  const scorePct = answeredCount ? Math.round((correctCount / answeredCount) * 100) : 0;

  function pick(num: number, choice: Choice) {
    if (mode !== "practice") return;
    if (selected[num]) return; // lock answer once chosen
    setSelected((s) => ({ ...s, [num]: choice }));
  }
  function toggleReveal(num: number) {
    setRevealed((r) => ({ ...r, [num]: !r[num] }));
  }
  function reset() {
    setSelected({});
    setRevealed({});
  }

  const categories = ["All", ...EXIT_EXAM_2017_CATEGORIES];

  return (
    <div className="space-y-5">
      {/* Controls */}
      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex rounded-lg border p-0.5">
              <button
                onClick={() => setMode("study")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  mode === "study" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <BookOpenCheck size={15} /> Study
              </button>
              <button
                onClick={() => setMode("practice")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  mode === "practice" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <GraduationCap size={15} /> Practice
              </button>
              <button
                onClick={() => setMode("exam")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  mode === "exam" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Clock size={15} /> Exam
              </button>
            </div>

            <div className="flex items-center gap-3">
              {mode === "practice" && answeredCount > 0 && (
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground tabular-nums">{correctCount}</span>/{answeredCount} correct
                  <span className="ml-1">· {scorePct}%</span>
                </div>
              )}
              {(answeredCount > 0 || Object.keys(revealed).length > 0) && (
                <Button variant="ghost" size="sm" onClick={reset}>
                  <RotateCcw size={14} /> Reset
                </Button>
              )}
            </div>
          </div>

          {mode === "exam" ? (
            <p className="text-xs text-muted-foreground">
              Exam mode presents the questions one at a time under a countdown timer, just like the other quizzes. Choose a duration below to begin.
            </p>
          ) : (
            <>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search questions, answers or topics…"
                  className="w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div className="flex flex-wrap gap-1.5">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                      category === c ? "border-primary bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent",
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <p className="text-xs text-muted-foreground">
                Showing {filtered.length} of {EXIT_EXAM_2017_QUESTIONS.length} questions ·{" "}
                {mode === "study"
                  ? "Study mode shows the correct answer and explanation for every question."
                  : "Practice mode hides answers — pick an option to check yourself, then read the explanation."}
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {mode === "exam" && <ExitExamRunner />}

      {/* Practice running score bar */}
      {mode === "practice" && answeredCount > 0 && (
        <div className="space-y-1.5">
          <Progress
            value={scorePct}
            indicatorClassName={scorePct >= 70 ? "bg-success" : scorePct >= 50 ? "bg-warning" : "bg-destructive"}
          />
        </div>
      )}

      {/* Questions */}
      {mode !== "exam" && (
      <div className="space-y-4">
        {filtered.map((item) => {
          const userPick = selected[item.num];
          const answeredHere = mode === "practice" && userPick != null;
          const show = mode === "study" || answeredHere || revealed[item.num];
          const gotItRight = userPick === item.answer;

          return (
            <Card
              key={item.num}
              className={cn(
                answeredHere && (gotItRight ? "border-success/40" : "border-destructive/40"),
              )}
            >
              <CardContent className="space-y-3 p-4 sm:p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">Q{item.num}</Badge>
                  <Badge variant="outline">{item.category}</Badge>
                  {answeredHere && (
                    <Badge variant={gotItRight ? "success" : "destructive"} className="ml-auto">
                      {gotItRight ? (
                        <span className="inline-flex items-center gap-1"><CheckCircle2 size={13} /> Correct</span>
                      ) : (
                        <span className="inline-flex items-center gap-1"><XCircle size={13} /> Incorrect</span>
                      )}
                    </Badge>
                  )}
                </div>

                <p className="whitespace-pre-wrap text-base font-semibold leading-relaxed [overflow-wrap:anywhere]">
                  {item.stem}
                </p>

                <div className="space-y-2">
                  {LETTERS.map((L) => {
                    const isAnswer = item.answer === L;
                    const isPicked = userPick === L;
                    const reveal = show;
                    return (
                      <button
                        key={L}
                        onClick={() => pick(item.num, L)}
                        disabled={mode !== "practice" || answeredHere}
                        className={cn(
                          "flex w-full items-start gap-3 rounded-lg border p-3 text-left text-sm transition-colors",
                          mode === "practice" && !answeredHere && "hover:bg-accent cursor-pointer",
                          mode !== "practice" && "cursor-default",
                          reveal && isAnswer && "border-success bg-success/10",
                          reveal && isPicked && !isAnswer && "border-destructive bg-destructive/10",
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
                            reveal && isAnswer && "border-success bg-success text-success-foreground",
                            reveal && isPicked && !isAnswer && "border-destructive bg-destructive text-destructive-foreground",
                          )}
                        >
                          {L}
                        </span>
                        <span className="pt-0.5 [overflow-wrap:anywhere]">{item.options[L]}</span>
                        {reveal && isAnswer && (
                          <span className="ml-auto shrink-0 pt-0.5 text-xs font-medium text-success">✓ correct</span>
                        )}
                        {reveal && isPicked && !isAnswer && (
                          <span className="ml-auto shrink-0 pt-0.5 text-xs font-medium text-destructive">your answer</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Reveal toggle for practice mode before answering */}
                {mode === "practice" && !answeredHere && (
                  <Button variant="ghost" size="sm" onClick={() => toggleReveal(item.num)}>
                    {revealed[item.num] ? <EyeOff size={14} /> : <Eye size={14} />}
                    {revealed[item.num] ? "Hide answer" : "Show answer"}
                  </Button>
                )}

                {show && (
                  <div className="rounded-lg bg-muted p-3 text-sm">
                    <p className="mb-1 inline-flex items-center gap-1.5 font-semibold">
                      <Lightbulb size={14} className="text-warning" />
                      Answer: {item.answer}
                    </p>
                    <p className="leading-relaxed text-muted-foreground [overflow-wrap:anywhere]">{item.explanation}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {filtered.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              No questions match your search.
            </CardContent>
          </Card>
        )}
      </div>
      )}
    </div>
  );
}
