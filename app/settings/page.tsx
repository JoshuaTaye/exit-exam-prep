import { getCurrentUser } from "@/lib/user";
import { PageHeader } from "@/components/page-header";
import { SettingsForm } from "@/components/settings/settings-form";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Settings" description="Personalize your study experience." />
      <SettingsForm
        initial={{
          stream: user.stream,
          examYear: user.examYear,
          dailyGoalMinutes: user.dailyGoalMinutes,
          targetReadiness: user.targetReadiness,
        }}
      />
    </div>
  );
}
