import { getCurrentUser } from "@/lib/user";
import { getMasterySnapshot } from "@/lib/mastery";
import { getProgressSeries, getImprovementCurve, getHeatmap } from "@/lib/analytics";
import { PageHeader } from "@/components/page-header";
import { Ring } from "@/components/ui/ring";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MASTERY } from "@/lib/constants";
import { AnalyticsDashboard, type AnalyticsData } from "@/components/analytics/analytics-dashboard";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const user = await getCurrentUser();
  const [snap, progress, improvement, heatmap] = await Promise.all([
    getMasterySnapshot(user.id),
    getProgressSeries(user.id),
    getImprovementCurve(user.id),
    getHeatmap(user.id),
  ]);

  const data: AnalyticsData = {
    courses: snap.courses.map((c) => ({
      name: c.name, mastery: Math.round(c.mastery), attempted: c.attempted, total: c.total, weight: c.weight,
    })),
    courseTopicProgress: snap.courses.map((c) => ({
      id: c.id,
      name: c.name,
      attempted: c.attempted,
      total: c.total,
      topics: c.topics.map((t) => ({
        id: t.id, name: t.name, attempted: t.attempted, total: t.total,
      })),
    })),
    byDifficulty: ["Easy", "Medium", "Hard", "Very Hard"].map((d) => {
      const n = (snap.byDifficulty as any)[d];
      return { name: d, mastery: n.mastery, attempted: n.attempted, total: n.total };
    }),
    byType: ["MCQ", "Scenario", "Case Study", "Problem Solving"].map((t) => {
      const n = (snap.byType as any)[t];
      return { name: t, mastery: n.mastery, attempted: n.attempted, total: n.total };
    }).filter((t) => t.total > 0),
    progress,
    improvement,
    heatmap,
  };

  const readinessColor = snap.overall.readiness >= MASTERY.readinessPass ? "hsl(var(--success))" : "hsl(var(--primary))";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Performance Analytics"
        description="What am I weak at? Track readiness, mastery, daily/weekly progress, improvement, and a topic-level heatmap."
      />

      <Card>
        <CardContent className="flex flex-col items-center gap-6 py-6 sm:flex-row sm:justify-around">
          <Ring value={snap.overall.readiness} size={150} color={readinessColor} label="Readiness" />
          <div className="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-4">
            <Metric label="Raw mastery" value={`${snap.overall.rawMastery}%`} />
            <Metric label="Coverage" value={`${Math.round((snap.overall.totalAttempted / snap.overall.totalQuestions) * 100)}%`} />
            <Metric label="Attempts" value={`${progress.totalAttempts}`} />
            <Metric label="Status" value={<Badge variant={snap.overall.passLikely ? "success" : "warning"}>{snap.overall.passLikely ? "Ready" : "Not yet"}</Badge>} />
          </div>
        </CardContent>
      </Card>

      <AnalyticsDashboard data={data} />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="text-center">
      <div className="text-xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
