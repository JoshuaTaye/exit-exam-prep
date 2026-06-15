"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { X } from "lucide-react";
import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import { Topbar } from "./topbar";
import { CommandMenu } from "@/components/command-menu";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { PageTransition } from "@/components/page-transition";

export function AppChrome({ streak, children }: { streak: number; children: React.ReactNode }) {
  const pathname = usePathname();
  const [cmdOpen, setCmdOpen] = useState(false);

  const isSession = pathname.startsWith("/session");

  // Live quiz: distraction-free, but with proper width, padding and an exit.
  if (isSession) {
    return (
      <div className="min-h-screen overflow-x-clip">
        <header className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X size={16} /> Exit
          </Link>
          <ThemeToggle />
        </header>
        <div className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
          <PageTransition>{children}</PageTransition>
        </div>
        <CommandMenu open={cmdOpen} setOpen={setCmdOpen} />
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
