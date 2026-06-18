"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import { Topbar } from "./topbar";
import { CommandMenu } from "@/components/command-menu";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { PageTransition } from "@/components/page-transition";
import { Button } from "@/components/ui/button";
import { draftAnswered } from "@/lib/quiz-draft";

export function AppChrome({ streak, children }: { streak: number; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [cmdOpen, setCmdOpen] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);

  const isSession = pathname.startsWith("/session");

  // Never carry the confirm dialog across navigations.
  useEffect(() => {
    setConfirmExit(false);
  }, [pathname]);

  function exitNow() {
    setConfirmExit(false);
    router.push("/");
  }

  function handleExit() {
    const examId = Number(pathname.split("/")[2]);
    // Only interrupt if there is real progress to preserve.
    if (Number.isFinite(examId) && draftAnswered(examId) > 0) {
      setConfirmExit(true);
    } else {
      router.push("/");
    }
  }

  // Live quiz: distraction-free, but with proper width, padding and an exit.
  if (isSession) {
    return (
      <div className="min-h-screen overflow-x-clip">
        <header className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6">
          <button
            onClick={handleExit}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X size={16} /> Exit
          </button>
          <ThemeToggle />
        </header>
        <div className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
          <PageTransition>{children}</PageTransition>
        </div>
        <CommandMenu open={cmdOpen} setOpen={setCmdOpen} />
        {confirmExit && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setConfirmExit(false)}
          >
            <div
              className="w-full max-w-sm rounded-xl border bg-card p-5 shadow-lift"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold">Leave this quiz?</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Your answers are saved as a draft. You can resume right where you left off
                from the dashboard or by reopening this quiz.
              </p>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setConfirmExit(false)}>
                  Keep going
                </Button>
                <Button onClick={exitNow}>Save &amp; exit</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Sidebar onCommand={() => setCmdOpen(true)} />
      <div className="overflow-x-clip lg:pl-60">
        <Topbar streak={streak} onCommand={() => setCmdOpen(true)} />
        <main className="mx-auto max-w-6xl px-4 pb-24 pt-6 lg:px-8 lg:pb-10">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
      <MobileNav />
      <CommandMenu open={cmdOpen} setOpen={setCmdOpen} />
    </div>
  );
}
