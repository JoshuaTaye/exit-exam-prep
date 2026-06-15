import Link from "next/link";
import { Zap, AlertTriangle, Repeat, GraduationCap } from "lucide-react";
import { getCurrentUser } from "@/lib/user";
import { getMasterySnapshot } from "@/lib/mastery";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StartQuizButton } from "@/components/quiz/start-quiz-button";
import { PracticePicker } from "@/components/practice/practice-picker";

export const dynamic = "force-dynamic";

export default async function PracticePage() {
  const user = await getCurrentUser();
  const [snap, counts] = await Promise.all([
    getMasterySnapshot(user.id),
    prisma.question.groupBy({ by: ["topicId"], _count: { topicId: true } }),
  ]);
  const countByTopic = new Map(counts.map((c) => [c.topicId, c._count.topicId]));

  const courses = snap.courses.map((c) => ({
    id: c.id,
    name: c.name,
    count: c.total,
    topics: c.topics.map((t) => ({
      id: t.id, name: t.name, mastery: t.mastery, count: countByTopic.get(t.id) ?? 0,
    })),
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Smart Practice"
        description="Every session is generated from the official question bank and ranked by deliberate-practice priority: due reviews → open mistakes → unseen → previously wrong."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ModeCard
          icon={AlertTriangle}
          title="Weakness Quiz"
          desc="Targets your lowest-mastery and untested topics first."
          action={<StartQuizButton spec={{ mode: "weakness", n: 15 }}>Start</StartQuizButton>}
        />
        <ModeCard
          icon={Repeat}
          title="Mistake Quiz"
          desc="Only questions you've previously missed — turn errors into mastery."
          action={<StartQuizButton spec={{ mode: "mistake", n: 15 }}>Start</StartQuizButton>}
        />
        <ModeCard
          icon={Zap}
          title="Quick Quiz"
          desc="A short mixed set to keep your streak and reviews moving."
          action={<StartQuizButton spec={{ mode: "quick", n: 10 }}>Start</StartQuizButton>}
        />
        <ModeCard
          icon={GraduationCap}
          title="Exit Exam Simulation"
          desc="Full 100-item, blueprint-matched, timed mock exam."
          action={<Link href="/exam"><Button>Open</Button></Link>}
        />
      </div>

      <PracticePicker courses={courses} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Spaced repetition</CardTitle>
          <CardDescription>
            Missed questions resurface on an expanding schedule (1 → 2 → 4 → 7 → 14 days); correct answers
            push the next review further out. Due items are automatically prioritized in every quiz above.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

function ModeCard({
  icon: Icon, title, desc, action,
}: { icon: any; title: string; desc: string; action: React.ReactNode }) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-1">
        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon size={20} />
        </div>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
      <CardContent>{action}</CardContent>
    </Card>
  );
}
