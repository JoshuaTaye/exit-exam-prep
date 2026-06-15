import Link from "next/link";
import { CalendarDays, BookOpen } from "lucide-react";
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

export default async function PlanPage() {
  const user = await getCurrentUser();
  const plan = await getOrCreatePlan(user.id);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Study Planner"
        description="An auto-generated plan that prioritizes high-weight blueprint areas, your lowest mastery, and your most frequent mistakes — so your study time buys the most exam points."
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
        {plan.weeks.map((w) => (
          <Card key={w.week}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarDays size={18} /> Week {w.week}
              </CardTitle>
              <CardDescription>{w.focus.length} focus areas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {w.focus.length === 0 && <p className="text-sm text-muted-foreground">Nothing scheduled — great coverage!</p>}
              {w.focus.map((f) => (
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
