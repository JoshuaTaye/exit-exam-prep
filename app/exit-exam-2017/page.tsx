import { ListChecks, CheckCircle2, FileText } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Stat } from "@/components/stat";
import { ExitExamView } from "@/components/exit-exam-2017/exit-exam-view";
import { EXIT_EXAM_2017_QUESTIONS, EXIT_EXAM_2017_CATEGORIES } from "@/data/exit-exam-2017";

export const metadata = {
  title: "Exit Exam 2017",
};

export default function ExitExam2017Page() {
  const total = EXIT_EXAM_2017_QUESTIONS.length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Exit Exam 2017"
        description="The complete 2017 Software Engineering Exit Exam — all questions with verified answer keys and detailed explanations, including why each wrong option is wrong. Switch to Practice mode to test yourself."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat icon={ListChecks} label="Questions" value={total} hint="full past paper" />
        <Stat icon={CheckCircle2} label="Answered & explained" value={`${total}/${total}`} hint="100% covered" />
        <Stat icon={FileText} label="Topics" value={EXIT_EXAM_2017_CATEGORIES.length} hint="categories covered" />
      </div>

      <ExitExamView />
    </div>
  );
}
