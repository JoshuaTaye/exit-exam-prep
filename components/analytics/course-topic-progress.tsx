"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export interface TopicProgress {
  id: number;
  name: string;
  attempted: number;
  total: number;
}

export interface CourseProgress {
  id: number;
  name: string;
  attempted: number;
  total: number;
  topics: TopicProgress[];
}

export function CourseTopicProgress({ courses }: { courses: CourseProgress[] }) {
  const [openIds, setOpenIds] = useState<Set<number>>(new Set(courses[0] ? [courses[0].id] : []));

  const toggle = (id: number) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Progress by course &amp; topic</CardTitle>
        <CardDescription>Questions you've answered at least once vs. the total available, per course and per topic.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {courses.map((c) => {
          const pct = c.total ? Math.round((c.attempted / c.total) * 100) : 0;
          const expanded = openIds.has(c.id);
          return (
            <div key={c.id} className="rounded-lg border">
              <button
                type="button"
                onClick={() => toggle(c.id)}
                className="flex w-full items-center gap-3 p-3 text-left"
              >
                <ChevronDown
                  size={16}
                  className={cn("shrink-0 text-muted-foreground transition-transform", expanded && "rotate-180")}
                />
                <span className="flex-1 truncate text-sm font-medium">{c.name}</span>
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                  {c.attempted}/{c.total} done ({pct}%)
                </span>
                <div className="hidden w-28 shrink-0 sm:block">
                  <Progress value={pct} />
                </div>
              </button>
              {expanded && (
                <div className="space-y-3 border-t px-3 py-3">
                  {c.topics.map((t) => {
                    const tpct = t.total ? Math.round((t.attempted / t.total) * 100) : 0;
                    return (
                      <div key={t.id} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="truncate pr-2">{t.name}</span>
                          <span className="shrink-0 tabular-nums text-muted-foreground">
                            {t.attempted}/{t.total} ({tpct}%)
                          </span>
                        </div>
                        <Progress value={tpct} />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
