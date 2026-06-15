"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StartQuizButton } from "@/components/quiz/start-quiz-button";

interface TopicLite { id: number; name: string; count: number; mastery: number }
interface CourseLite { id: number; name: string; count: number; topics: TopicLite[] }

export function PracticePicker({ courses }: { courses: CourseLite[] }) {
  const [courseId, setCourseId] = useState(courses[0]?.id ?? 0);
  const [topicId, setTopicId] = useState(courses[0]?.topics[0]?.id ?? 0);
  const [quickN, setQuickN] = useState(10);

  const course = courses.find((c) => c.id === courseId) ?? courses[0];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Quick quiz */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Quiz</CardTitle>
          <CardDescription>A fast mixed set, prioritizing due reviews and weak spots.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <label className="flex items-center justify-between text-sm">
            <span>Questions</span>
            <span className="font-semibold tabular-nums">{quickN}</span>
          </label>
          <input
            type="range" min={5} max={20} value={quickN}
            onChange={(e) => setQuickN(Number(e.target.value))}
            className="w-full accent-[hsl(var(--primary))]"
          />
          <StartQuizButton spec={{ mode: "quick", n: quickN }}>Start Quick Quiz</StartQuizButton>
        </CardContent>
      </Card>

      {/* Topic / Course quiz */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Topic &amp; Course Quiz</CardTitle>
          <CardDescription>Drill a single learning outcome, or every question in a course.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <select
            value={courseId}
            onChange={(e) => {
              const id = Number(e.target.value);
              setCourseId(id);
              const c = courses.find((x) => x.id === id);
              setTopicId(c?.topics[0]?.id ?? 0);
            }}
            className="w-full rounded-lg border bg-card px-3 py-2 text-sm"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.name} ({c.count} Q)</option>
            ))}
          </select>
          <select
            value={topicId}
            onChange={(e) => setTopicId(Number(e.target.value))}
            className="w-full rounded-lg border bg-card px-3 py-2 text-sm"
          >
            {course?.topics.map((t) => (
              <option key={t.id} value={t.id}>{t.name} · {Math.round(t.mastery)}% ({t.count} Q)</option>
            ))}
          </select>
          <div className="flex gap-2">
            <StartQuizButton spec={{ mode: "topic", topicId, n: 12 }}>Topic Quiz</StartQuizButton>
            <StartQuizButton spec={{ mode: "course", courseId }} variant="outline">
              Course Quiz ({course?.count ?? 0} Q)
            </StartQuizButton>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
