"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, Search } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, SECONDARY_ITEMS } from "./nav-items";

export function Sidebar({ onCommand }: { onCommand?: () => void }) {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r bg-card/40 lg:flex">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-soft">
          <GraduationCap size={19} />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold tracking-tight">ExitPrep</p>
          <p className="text-[11px] text-muted-foreground">SE &amp; Computing Tech</p>
        </div>
      </div>

      <div className="px-3 pb-2">
        <button
          onClick={onCommand}
          className="flex w-full items-center gap-2 rounded-lg border bg-background/60 px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <Search size={15} />
          <span>Search…</span>
          <kbd className="ml-auto rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium">⌘K</kbd>
        </button>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active ? "text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              {active && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 -z-10 rounded-lg bg-accent"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <Icon size={17} className={cn(active && "text-primary")} />
              {item.label}
            </Link>
          );
        })}

        <div className="my-2 h-px bg-border" />
        {SECONDARY_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <Icon size={17} className={cn(active && "text-primary")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t px-5 py-3 text-[11px] leading-relaxed text-muted-foreground">
        Ministry of Education · Ethiopia
        <br />
        National Exit Exam · BAND 1
      </div>
    </aside>
  );
}
