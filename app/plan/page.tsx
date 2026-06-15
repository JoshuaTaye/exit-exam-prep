import Link from "next/link";
import { isToday, isTomorrow, format } from "date-fns";
import { CalendarDays, BookOpen, GraduationCap } from "lucide-react";
import { getCurrentUser } from "@/lib/user";
import { getOrCreatePlan } from "@/lib/study-planner";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StartQuizButton } from "@/components/quiz/start-quiz-button";
import { RegeneratePlanButton } from "@/components/plan/regenerate-button";
import { masteryColor } from "@/lib/colors";

export const dynamic = "force-dynamic";

function dayLabel(dateStr: string) {
  const date = new Date(dateStr);
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  return format(date, "EEEE");
}

export default async function PlanPage() {
  const user = await getCurrentUser();
  const plan = await getOrCreatePlan(user.id);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Study Planner"
        description="A focused plan for the days you have left — front-loading high-weight blueprint areas, your lowest mastery, and your most frequent mistakes, then ending with a full simulation to check your readiness."
      >
        <RegeneratePlanButton />
      </PageHeader>

      <Card>
        <CardContent className="flex flex-wrap items-center gap-x-6 gap-y-2 py-4 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Priority formula:</span>
          <span>45% blueprint exam weight</span>
          <span>·</span>
          <span>40% low mastery / coverage gap</span>
          <span>·</span>
          <span>15% open mistakes</span>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {plan.days.map((d) => (
          <Card key={d.day} className={d.isFinalDay ? "border-primary/40" : undefined}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                {d.isFinalDay ? <GraduationCap size={18} className="text-primary" /> : <CalendarDays size={18} />}
                Day {d.day} · {dayLabel(d.date)}
              </CardTitle>
              <CardDescription>
                {format(new Date(d.date), "EEEE, MMM d")}
                {d.isFinalDay ? " · Final review + full simulation" : ` · ${d.focus.length} focus areas`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {d.isFinalDay && (
                <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
                  <p className="text-sm font-semibold">Take the Exit Exam Simulation</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    A full 100-item, blueprint-matched, timed mock exam — the best signal for where you stand before the real thing.
                  </p>
                  <Link href="/exam" className="mt-2 inline-block">
                    <Button size="sm">Open Simulation</Button>
                  </Link>
                </div>
              )}
              {d.focus.length === 0 && !d.isFinalDay && (
                <p className="text-sm text-muted-foreground">Nothing scheduled — great coverage!</p>
              )}
              {d.focus.length > 0 && d.isFinalDay && (
                <p className="text-xs font-medium text-muted-foreground">Quick review before the exam:</p>
              )}
              {d.focus.map((f) => (
                <div key={f.topicId} className="rounded-lg border p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{f.topicName}</p>
                      <p className="truncate text-xs text-muted-foreground">{f.courseName}</p>
                    </div>
                    <span className="shrink-0 text-sm font-bold tabular-nums" style={{ color: masteryColor(f.mastery) }}>
                      {f.mastery}%
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">{f.reason}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge variant="muted">target {f.questionTarget} Q</Badge>
                    <StartQuizButton spec={{ mode: "topic", topicId: f.topicId, n: f.questionTarget }} size="sm">
                      Practice
                    </StartQuizButton>
                    <Link href={`/notes/${f.courseId}?topic=${f.topicSlug}#${f.topicSlug}`}>
                      <Button size="sm" variant="outline"><BookOpen /> Notes</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
