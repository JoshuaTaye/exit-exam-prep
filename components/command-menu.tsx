"use client";

import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Dumbbell, AlertTriangle, Zap, GraduationCap, Moon, Sun, Loader2,
} from "lucide-react";
import { useTheme } from "next-themes";
import { NAV_ITEMS, SECONDARY_ITEMS } from "./nav/nav-items";

export function CommandMenu({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();
  const [busy, setBusy] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const current = mounted ? resolvedTheme : undefined;

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, setOpen]);

  const go = (href: string) => { setOpen(false); router.push(href); };

  async function startSession(spec: Record<string, any>) {
    setBusy(true);
    try {
      const res = await fetch("/api/sessions", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(spec),
      });
      const data = await res.json();
      if (res.ok) { setOpen(false); router.push(`/session/${data.examId}`); }
    } finally { setBusy(false); }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-[12vh]" role="dialog" aria-modal>
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <Command
        className="relative w-full max-w-xl overflow-hidden rounded-xl border bg-popover shadow-lift"
        loop
      >
        <div className="flex items-center border-b px-3">
          {busy ? <Loader2 size={16} className="animate-spin text-muted-foreground" /> : <span className="text-muted-foreground">⌘</span>}
          <Command.Input
            autoFocus
            placeholder="Search pages, start a quiz…"
            className="w-full bg-transparent px-3 py-3.5 text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">ESC</kbd>
        </div>
        <Command.List className="max-h-[60vh] overflow-y-auto p-2">
          <Command.Empty className="py-8 text-center text-sm text-muted-foreground">No results.</Command.Empty>

          <Command.Group heading="Quick actions" className="px-1 text-xs font-medium text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5">
            <Item onSelect={() => startSession({ mode: "weakness", n: 15 })} icon={AlertTriangle}>Start Weakness Quiz</Item>
            <Item onSelect={() => startSession({ mode: "mistake", n: 15 })} icon={Dumbbell}>Practice my mistakes</Item>
            <Item onSelect={() => startSession({ mode: "quick", n: 10 })} icon={Zap}>Quick Quiz (10)</Item>
            <Item onSelect={() => startSession({ mode: "simulation" })} icon={GraduationCap}>Full Exam Simulation</Item>
          </Command.Group>

          <Command.Group heading="Go to" className="px-1 text-xs font-medium text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5">
            {[...NAV_ITEMS, ...SECONDARY_ITEMS].map((item) => (
              <Item key={item.href} onSelect={() => go(item.href)} icon={item.icon}>{item.label}</Item>
            ))}
          </Command.Group>

          <Command.Group heading="Theme" className="px-1 text-xs font-medium text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5">
            <Item onSelect={() => { setTheme(current === "dark" ? "light" : "dark"); setOpen(false); }} icon={current === "dark" ? Sun : Moon}>
              Switch to {current === "dark" ? "light" : "dark"} mode
            </Item>
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
}

function Item({ children, onSelect, icon: Icon }: { children: React.ReactNode; onSelect: () => void; icon: any }) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm aria-selected:bg-accent aria-selected:text-accent-foreground"
    >
      <Icon size={16} className="text-muted-foreground" />
      {children}
    </Command.Item>
  );
}
