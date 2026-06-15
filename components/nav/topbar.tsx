"use client";

import Link from "next/link";
import { Flame, Search, GraduationCap } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Topbar({ streak, onCommand }: { streak: number; onCommand: () => void }) {
  return (
    <header className="glass sticky top-0 z-30 flex h-14 items-center gap-3 border-b px-4 lg:px-8">
      {/* Mobile brand */}
      <Link href="/" className="flex items-center gap-2 lg:hidden">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <GraduationCap size={17} />
        </div>
        <span className="text-sm font-semibold">ExitPrep</span>
      </Link>

      <div className="ml-auto flex items-center gap-2">
        {streak > 0 && (
          <div
            className="flex items-center gap-1.5 rounded-full border bg-card px-2.5 py-1 text-xs font-semibold"
            title={`${streak}-day study streak`}
          >
            <Flame size={14} className="text-warning" />
            {streak}
            <span className="hidden text-muted-foreground sm:inline">day streak</span>
          </div>
        )}
        <button
          onClick={onCommand}
          aria-label="Search"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground lg:hidden"
        >
          <Search size={17} />
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
