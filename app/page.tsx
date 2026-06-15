import Link from "next/link";
import {
  Flame, AlertTriangle, RefreshCw, TrendingUp, Target, ArrowRight,
  Sparkles, BookOpen, ChevronRight,
} from "lucide-react";
import { getCurrentUser } from "@/lib/user";
import { getMasterySnapshot } from "@/lib/mastery";
import { getImprovementCurve } from "@/lib/analytics";
import { countDue } from "@/lib/spaced-repetition";
import { getStudyStreak } from "@/lib/streak";
import { getOrCreatePlan } from "@/lib/study-planner";
import { prisma } from "@/lib/db";
import { MASTERY } from "@/lib/constants";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StatRing } from "@/components/ui/stat-ring";
import { StartQuizButton } from "@/components/quiz/start-quiz-button";
import { masteryColor, bandVariant, bandLabel } from "@/lib/colors";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const user = await getCurrentUser();

  const startToday = new Date(); startToday.setHours(0, 0, 0, 0);

  const [snap, due, openMistakes, improvement, streak, plan, recentMistakes, todayAgg] = await Promise.all([
    getMasterySnapshot(user.id),
    countDue(user.id),
    prisma.mistake.count({ where: { userId: user.id, resolved: false } }),
    getImprovementCurve(user.id),
    getStudyStreak(user.id),
    getOrCreatePlan(user.id),
    prisma.mistake.findMany({
      where: { userId: user.id, resolved: false },
      orderBy: { createdAt: "desc" }, take: 4,
      include: { question: { include: { topic: true, course: true } } },
    }),
    prisma.questionAttempt.aggregate({
      where: { userId: user.id, createdAt: { gte: startToday } },
      _sum: { timeMs: true }, _count: true,
    }),
  ]);

  const todayMinutes = Math.round((todayAgg._sum.timeMs ?? 0) / 60000);
  const goalPct = Math.min(100, Math.round((todayMinutes / user.dailyGoalMinutes) * 100));
  const topWeak = snap.courses.flatMap((c) => c.topics.map((t) => ({ ...t, courseName: c.name })))
    .filter((t) => t.band === "weak" || t.band === "untested")
    .sort((a, b) => a.mastery - b.mastery);
  const planFocus = plan.days[0]?.focus ?? [];
  const readinessColor = snap.overall.readiness >= MASTERY.readinessPass ? "hsl(var(--success))" : "hsl(var(--primary))";

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back`}
        description="What to study today, where you're struggling, and how close you are to passing — at a glance."
      />

      {/* Hero: readiness + key stats */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="flex flex-col items-center gap-3 py-6">
            <StatRing value={snap.overall.readiness} color={readinessColor} label="Exit Exam Readiness" />
            <Badge variant={snap.overall.passLikely ? "success" : "warning"}>
              {snap.overall.passLikely ? "On track to pass" : `Target ${user.targetReadiness}%`}
            </Badge>
            <p className="text-center text-xs text-muted-foreground">
              {snap.overall.totalAttempted}/{snap.overall.totalQuestions} questions practiced · raw mastery {snap.overall.rawMastery}%
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4 lg:col-span-2">
          <MiniStat icon={Flame} tone="warning" label="Study streak" value={`${streak.current}`} hint={streak.activeToday ? "active today" : "study today to extend"} />
          <MiniStat icon={RefreshCw} label="Reviews due" value={`${due}`} hint="spaced repetition" />
          <MiniStat icon={AlertTriangle} tone="destructive" label="Open mistakes" value={`${openMistakes}`} hint="in your journal" />
          <MiniStat icon={TrendingUp} tone="success" label="Last exam" value={improvement.count ? `${improvement.current}%` : "—"} hint={improvement.count ? "most recent" : "no exams yet"} />

          <Card className="col-span-2">
            <CardContent className="flex items-center gap-4 py-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Target size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Today's goal</span>
                  <span className="tabular-nums text-muted-foreground">{todayMinutes} / {user.dailyGoalMinutes} min</span>
                </div>
                <Progress value={goalPct} className="mt-2" indicatorClassName={goalPct >= 100 ? "bg-success" : ""} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Today's plan */}
      <Card hover>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><Sparkles size={18} className="text-primary" /> What to study today</CardTitle>
          <CardDescription>Built from your weak areas, due reviews, and study plan.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <TaskCard
            title={due > 0 ? `Clear ${due} due reviews` : "Stay sharp"}
            desc={due > 0 ? "Spaced-repetition items are ready." : "No reviews due — bank some new practice."}
            action={<StartQuizButton spec={{ mode: due > 0 ? "quick" : "weakness", n: Math.min(20, Math.max(10, due)) }} size="sm">Start</StartQuizButton>}
          />
          <TaskCard
            title={topWeak[0] ? `Drill: ${topWeak[0].name}` : "Practice weak areas"}
            desc={topWeak[0] ? `${topWeak[0].courseName} · ${topWeak[0].attempted ? Math.round(topWeak[0].mastery) + "% mastery" : "untested"}` : "Targets your lowest topics."}
            action={topWeak[0]
              ? <StartQuizButton spec={{ mode: "topic", topicId: topWeak[0].id, n: 10 }} size="sm">Drill</StartQuizButton>
              : <StartQuizButton spec={{ mode: "weakness", n: 12 }} size="sm">Start</StartQuizButton>}
          />
          <TaskCard
            title={planFocus[0] ? `Plan: ${planFocus[0].topicName}` : "Follow your plan"}
            desc={planFocus[0] ? planFocus[0].reason : "Your week-1 focus areas."}
            action={planFocus[0]
              ? <StartQuizButton spec={{ mode: "topic", topicId: planFocus[0].topicId, n: planFocus[0].questionTarget }} size="sm">Practice</StartQuizButton>
              : <Link href="/plan"><Button size="sm">Open</Button></Link>}
          />
        </CardContent>
      </Card>

      {/* Weak topics + recent mistakes */}
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="flex items-center gap-2 text-base"><AlertTriangle size={18} /> Weak topics</CardTitle>
              <CardDescription>Your lowest-mastery areas.</CardDescription>
            </div>
            <Link href="/analytics"><Button variant="ghost" size="sm">All <ChevronRight size={15} /></Button></Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {topWeak.length === 0 && <p className="text-sm text-muted-foreground">Practice a few questions to surface your weak areas.</p>}
            {topWeak.slice(0, 5).map((t) => (
              <div key={t.id} className="flex items-center justify-between gap-3 rounded-lg border p-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{t.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{t.courseName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={bandVariant[t.band]}>{bandLabel[t.band]}</Badge>
                  <StartQuizButton spec={{ mode: "topic", topicId: t.id, n: 10 }} size="sm" variant="outline">Drill</StartQuizButton>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="flex items-center gap-2 text-base"><BookOpen size={18} /> Recent mistakes</CardTitle>
              <CardDescription>Turn errors into mastery.</CardDescription>
            </div>
            <Link href="/mistakes"><Button variant="ghost" size="sm">Journal <ChevronRight size={15} /></Button></Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentMistakes.length === 0 && <p className="text-sm text-muted-foreground">No mistakes yet — they'll appear here with note links.</p>}
            {recentMistakes.map((m) => (
              <Link
                key={m.id}
                href={`/notes/${m.question.courseId}?topic=${m.question.topic.slug}#${m.question.topic.slug}`}
                className="block rounded-lg border p-2.5 transition-colors hover:bg-accent"
              >
                <p className="truncate text-sm">{m.question.stem}</p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{m.question.topic.name} · {m.question.course.name}</p>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MiniStat({
  icon: Icon, label, value, hint, tone,
}: { icon: any; label: string; value: string; hint?: string; tone?: "warning" | "destructive" | "success" }) {
  const toneClass = tone === "warning" ? "text-warning bg-warning/10"
    : tone === "destructive" ? "text-destructive bg-destructive/10"
    : tone === "success" ? "text-success bg-success/10"
    : "text-primary bg-primary/10";
  return (
    <Card hover>
      <CardContent className="flex items-center gap-3.5 p-4">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${toneClass}`}>
          <Icon size={20} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="text-xl font-bold tabular-nums">{value}</p>
          {hint && <p className="truncate text-[11px] text-muted-foreground">{hint}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

function TaskCard({ title, desc, action }: { title: string; desc: string; action: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-between gap-3 rounded-xl border bg-elevated/40 p-4">
      <div>
        <p className="text-sm font-semibold leading-snug">{title}</p>
        <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
      </div>
      {action}
    </div>
  );
}
