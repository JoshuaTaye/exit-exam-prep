import { Layers, BookOpen, ListChecks, Database } from "lucide-react";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/page-header";
import { Stat } from "@/components/stat";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { difficultyVariant } from "@/lib/colors";
import type { Difficulty } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function BlueprintPage() {
  const [themes, courses, topics, typeDist, diffDist, totalQ] = await Promise.all([
    prisma.theme.findMany({ orderBy: { no: "asc" } }),
    prisma.course.findMany({ include: { theme: true, _count: { select: { questions: true } } }, orderBy: { no: "asc" } }),
    prisma.topic.findMany(),
    prisma.question.groupBy({ by: ["questionType"], _count: { questionType: true } }),
    prisma.question.groupBy({ by: ["difficulty"], _count: { difficulty: true } }),
    prisma.question.count(),
  ]);

  const topicsByCourse = new Map<number, typeof topics>();
  for (const t of topics) {
    const arr = topicsByCourse.get(t.courseId) ?? [];
    arr.push(t); topicsByCourse.set(t.courseId, arr);
  }

  const totalItems = courses.reduce((s, c) => s + c.items, 0);
  const typeMap = new Map(typeDist.map((t) => [t.questionType, t._count.questionType]));
  const diffOrder: Difficulty[] = ["Easy", "Medium", "Hard", "Very Hard"];
  const diffMap = new Map(diffDist.map((d) => [d.difficulty, d._count.difficulty]));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Exam Blueprint"
        description="The structured analysis of the MoE Test Blueprint that drives every exam, quiz, and study recommendation in this platform."
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <Stat icon={Layers} label="Themes" value={themes.length} />
        <Stat icon={BookOpen} label="Courses" value={courses.length} />
        <Stat icon={ListChecks} label="Exam items" value={totalItems} hint="per full simulation" />
        <Stat icon={Database} label="Bank questions" value={totalQ} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Question-type distribution</CardTitle>
            <CardDescription>How the {totalQ}-question bank is classified.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {["MCQ", "Problem Solving", "Scenario", "Case Study"].map((t) => {
              const n = typeMap.get(t) ?? 0;
              return (
                <div key={t} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{t}</span>
                    <span className="tabular-nums text-muted-foreground">{n} · {Math.round((n / totalQ) * 100)}%</span>
                  </div>
                  <Progress value={(n / totalQ) * 100} />
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Difficulty distribution</CardTitle>
            <CardDescription>Calculated from complexity, concept count, and Bloom level.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {diffOrder.map((d) => {
              const n = diffMap.get(d) ?? 0;
              return (
                <div key={d} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2"><Badge variant={difficultyVariant[d]}>{d}</Badge></span>
                    <span className="tabular-nums text-muted-foreground">{n} · {Math.round((n / totalQ) * 100)}%</span>
                  </div>
                  <Progress value={(n / totalQ) * 100} />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {themes.map((theme) => {
        const themeCourses = courses.filter((c) => c.themeId === theme.id);
        return (
          <Card key={theme.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{theme.name}</CardTitle>
                <Badge variant="default" className="text-sm">{theme.weight}% of exam</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {themeCourses.map((c) => {
                const cts = (topicsByCourse.get(c.id) ?? []).sort((a, b) => b.importance - a.importance);
                return (
                  <div key={c.id} className="rounded-lg border p-4">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-semibold">{c.no}. {c.name}</h3>
                      <div className="flex gap-2 text-xs">
                        <Badge variant="muted">{c.creditHours} cr.hrs</Badge>
                        <Badge variant="secondary">{c.items} exam items</Badge>
                        <Badge variant="outline">{c._count.questions} in bank</Badge>
                      </div>
                    </div>
                    <p className="mb-3 text-xs text-muted-foreground">{c.generalObjective}</p>
                    <div className="overflow-x-auto rounded-md border">
                      <table className="w-full min-w-[560px] text-sm">
                        <thead className="bg-muted/50 text-xs text-muted-foreground">
                          <tr>
                            <th className="px-3 py-2 text-left font-medium">Learning outcome (topic)</th>
                            <th className="px-3 py-2 text-right font-medium">Items</th>
                            <th className="px-3 py-2 text-right font-medium">Weight</th>
                            <th className="px-3 py-2 text-left font-medium">Bloom</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {cts.map((t) => {
                            const bloom = JSON.parse(t.bloom) as Record<string, number>;
                            return (
                              <tr key={t.id}>
                                <td className="px-3 py-2">{t.name}</td>
                                <td className="px-3 py-2 text-right tabular-nums">{t.items}</td>
                                <td className="px-3 py-2 text-right tabular-nums">{Math.round(t.importance * 100)}%</td>
                                <td className="px-3 py-2">
                                  <div className="flex flex-wrap gap-1">
                                    {Object.entries(bloom).map(([lvl, cnt]) => (
                                      <Badge key={lvl} variant="muted" className="text-[10px]">{lvl} ×{cnt}</Badge>
                                    ))}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
