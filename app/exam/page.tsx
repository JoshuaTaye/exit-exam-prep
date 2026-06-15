import { Clock, ListChecks, Layers, Trophy } from "lucide-react";
import { getCurrentUser } from "@/lib/user";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stat } from "@/components/stat";
import { StartQuizButton } from "@/components/quiz/start-quiz-button";
import { formatDistanceToNow } from "date-fns";

export const dynamic = "force-dynamic";

export default async function ExamPage() {
  const user = await getCurrentUser();
  const [courses, results] = await Promise.all([
    prisma.course.findMany({ include: { theme: true }, orderBy: { no: "asc" } }),
    prisma.examResult.findMany({
      where: { userId: user.id, exam: { mode: "simulation" } },
      orderBy: { createdAt: "desc" },
      include: { exam: true },
      take: 10,
    }),
  ]);

  const totalItems = courses.reduce((s, c) => s + c.items, 0);
  const themes = new Map<string, number>();
  for (const c of courses) themes.set(c.theme.name, (themes.get(c.theme.name) ?? 0) + c.items);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Exit Exam Simulation"
        description="A full-length mock exam that mirrors the official blueprint exactly — same course item counts, same topic spread, same difficulty mix — under a real timer."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat icon={ListChecks} label="Questions" value={totalItems} hint="matched to blueprint" />
        <Stat icon={Clock} label="Time limit" value="150 min" hint="auto-submits at 0:00" />
        <Stat icon={Trophy} label="Pass mark" value="70%" hint="readiness threshold" />
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-4 py-5">
          <div>
            <p className="font-semibold">Ready to test yourself under exam conditions?</p>
            <p className="text-sm text-muted-foreground">
              Every wrong answer is logged to your Mistake Journal and scheduled for spaced review.
            </p>
          </div>
          <StartQuizButton spec={{ mode: "simulation" }} size="lg">Start Full Simulation</StartQuizButton>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><Layers size={18} /> Blueprint composition</CardTitle>
            <CardDescription>How the {totalItems} questions are distributed.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[...themes.entries()].map(([theme, items]) => (
              <div key={theme}>
                <div className="mb-1 flex justify-between text-sm font-medium">
                  <span>{theme}</span>
                  <span className="tabular-nums text-muted-foreground">{items} items · {Math.round((items / totalItems) * 100)}%</span>
                </div>
                <div className="space-y-1 pl-1">
                  {courses.filter((c) => c.theme.name === theme).map((c) => (
                    <div key={c.id} className="flex justify-between text-xs text-muted-foreground">
                      <span>{c.name}</span>
                      <span className="tabular-nums">{c.items} Q</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Past simulations</CardTitle>
            <CardDescription>Your full-exam attempts over time.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {results.length === 0 && (
              <p className="text-sm text-muted-foreground">No simulations yet. Take your first to get a baseline readiness score.</p>
            )}
            {results.map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">{formatDistanceToNow(r.createdAt, { addSuffix: true })}</p>
                  <p className="text-xs text-muted-foreground">{r.correct}/{r.totalItems} correct</p>
                </div>
                <Badge variant={r.passed ? "success" : "destructive"} className="text-sm">{r.score}%</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
