"use client";

import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid, Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { masteryColor } from "@/lib/colors";
import { CourseTopicProgress, type CourseProgress } from "./course-topic-progress";

interface Node { id?: number; name: string; mastery: number; attempted: number; total: number }
interface HeatTopic { topicId: number; name: string; courseName: string; mastery: number; attempted: number; band: string }

export interface AnalyticsData {
  courses: { name: string; mastery: number; attempted: number; total: number; weight: number }[];
  courseTopicProgress: CourseProgress[];
  byDifficulty: Node[];
  byType: Node[];
  progress: {
    daily: { label: string; total: number; accuracy: number }[];
    weekly: { label: string; total: number; accuracy: number }[];
    cumulative: { n: number; accuracy: number }[];
    totalAttempts: number;
  };
  improvement: { series: { date: string; score: number; mode: string }[]; initial: number; current: number; rate: number; count: number };
  heatmap: { strong: HeatTopic[]; moderate: HeatTopic[]; weak: HeatTopic[]; untested: HeatTopic[]; all: HeatTopic[] };
}

const tooltipStyle = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 8,
  fontSize: 12,
};

export function AnalyticsDashboard({ data }: { data: AnalyticsData }) {
  const hasData = data.progress.totalAttempts > 0;

  if (!hasData) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          No performance data yet. Complete a few quizzes and your analytics will populate here.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Improvement curve */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="min-w-0 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Improvement curve</CardTitle>
            <CardDescription>Cumulative accuracy across every question you've answered.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data.progress.cumulative}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="n" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="accuracy" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader>
            <CardTitle className="text-base">Exam scores</CardTitle>
            <CardDescription>Initial vs current</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-around text-center">
              <div>
                <p className="text-2xl font-bold">{data.improvement.initial}%</p>
                <p className="text-xs text-muted-foreground">Initial</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{data.improvement.current}%</p>
                <p className="text-xs text-muted-foreground">Current</p>
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: data.improvement.rate >= 0 ? "hsl(var(--success))" : "hsl(var(--destructive))" }}>
                  {data.improvement.rate >= 0 ? "+" : ""}{data.improvement.rate}%
                </p>
                <p className="text-xs text-muted-foreground">per attempt</p>
              </div>
            </div>
            {data.improvement.count > 0 ? (
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={data.improvement.series.map((s, i) => ({ ...s, i: i + 1 }))}>
                  <YAxis domain={[0, 100]} hide />
                  <XAxis dataKey="i" hide />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="score" stroke="hsl(var(--success))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-xs text-muted-foreground">No exam attempts recorded yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Daily performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Daily performance</CardTitle>
          <CardDescription>Accuracy and volume per day.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.progress.daily}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="accuracy" radius={[4, 4, 0, 0]}>
                {data.progress.daily.map((d, i) => (
                  <Cell key={i} fill={masteryColor(d.accuracy)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Mastery by course + difficulty + type */}
      <div className="grid min-w-0 gap-6 lg:grid-cols-2">
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle className="text-base">Mastery by course</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={data.courses} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="mastery" radius={[0, 4, 4, 0]}>
                  {data.courses.map((c, i) => <Cell key={i} fill={c.attempted ? masteryColor(c.mastery) : "hsl(var(--muted))"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <MiniBars title="Mastery by question type" rows={data.byType} />
          <MiniBars title="Mastery by difficulty" rows={data.byDifficulty} />
        </div>
      </div>

      {/* Progress by course & topic */}
      <CourseTopicProgress courses={data.courseTopicProgress} />

      {/* Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Topic heatmap</CardTitle>
          <CardDescription>
            <span className="text-success">Strong {data.heatmap.strong.length}</span> ·{" "}
            <span className="text-[hsl(38_92%_38%)]">Moderate {data.heatmap.moderate.length}</span> ·{" "}
            <span className="text-destructive">Weak {data.heatmap.weak.length}</span> ·{" "}
            <span className="text-muted-foreground">Untested {data.heatmap.untested.length}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-5 md:grid-cols-7">
            {data.heatmap.all.map((t) => (
              <div
                key={t.topicId}
                title={`${t.name} — ${t.courseName}: ${t.attempted ? t.mastery + "%" : "untested"}`}
                className="group relative aspect-square rounded-md border"
                style={{ background: t.attempted ? masteryColor(t.mastery) + "33" : "hsl(var(--muted))" }}
              >
                <div className="flex h-full flex-col justify-between p-1.5">
                  <span className="line-clamp-3 text-[9px] leading-tight text-foreground/80">{t.name}</span>
                  <span className="text-[11px] font-bold tabular-nums" style={{ color: t.attempted ? masteryColor(t.mastery) : "hsl(var(--muted-foreground))" }}>
                    {t.attempted ? `${t.mastery}%` : "—"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MiniBars({ title, rows }: { title: string; rows: Node[] }) {
  return (
    <Card>
      <CardHeader className="pb-2"><CardTitle className="text-base">{title}</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {rows.map((r) => (
          <div key={r.name} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{r.name}</span>
              <span className="tabular-nums text-muted-foreground">
                {r.attempted > 0 ? `${Math.round(r.mastery)}%` : "untested"} ({r.attempted}/{r.total})
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full" style={{ width: `${r.mastery}%`, background: masteryColor(r.mastery) }} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
