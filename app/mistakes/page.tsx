import Link from "next/link";
import { AlertTriangle, Repeat, Flame, CheckCircle2 } from "lucide-react";
import { getCurrentUser } from "@/lib/user";
import { getMistakeJournal } from "@/lib/analytics";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Stat } from "@/components/stat";
import { StartQuizButton } from "@/components/quiz/start-quiz-button";
import { MistakesView } from "@/components/mistakes/mistakes-view";

export const dynamic = "force-dynamic";

export default async function MistakesPage() {
  const user = await getCurrentUser();
  const journal = await getMistakeJournal(user.id);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mistake Journal"
        description="A permanent record of every wrong answer — grouped, analyzed, and linked straight to the notes that fix the misconception."
      >
        {journal.totalMistakes > 0 && (
          <StartQuizButton spec={{ mode: "mistake", n: 20 }}>Practice my mistakes</StartQuizButton>
        )}
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat icon={AlertTriangle} label="Total mistakes logged" value={journal.totalMistakes} />
        <Stat icon={CheckCircle2} label="Resolved" value={journal.resolvedCount}
          hint="later answered correctly" />
        <Stat icon={Repeat} label="Repeat-missed questions" value={journal.repeatMistakes.length} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><Flame size={18} /> Frequently missed topics</CardTitle>
            <CardDescription>Where your errors cluster — prime targets for focused review.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {journal.frequentlyMissedTopics.length === 0 && (
              <p className="text-sm text-muted-foreground">No mistakes yet.</p>
            )}
            {journal.frequentlyMissedTopics.map((t) => (
              <div key={t.topicId} className="flex items-center justify-between gap-2 rounded-lg border p-2.5">
                <span className="truncate text-sm font-medium">{t.name}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">{t.count}</Badge>
                  <StartQuizButton spec={{ mode: "topic", topicId: t.topicId, n: 10 }} size="sm" variant="outline">
                    Drill
                  </StartQuizButton>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><Repeat size={18} /> Repeat mistakes</CardTitle>
            <CardDescription>Questions you've missed more than once — concepts not yet sticking.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {journal.repeatMistakes.length === 0 && (
              <p className="text-sm text-muted-foreground">None yet — keep it that way!</p>
            )}
            {journal.repeatMistakes.slice(0, 8).map((r) => (
              <div key={r.questionId} className="rounded-lg border p-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm">{r.stem}</span>
                  <Badge variant={r.resolved ? "success" : "destructive"}>×{r.times}</Badge>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{r.topicName}</span>
                  <Link href={r.noteHref} className="text-xs text-primary underline">Review notes</Link>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <h2 className="pt-2 text-lg font-semibold">All mistakes</h2>
      <MistakesView entries={journal.entries} />
    </div>
  );
}
