"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, Loader2, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

const STREAMS = ["Software Engineering", "Artificial Intelligence", "Cyber Security", "Information Technology"];
const YEARS = ["2024", "2025", "2026"];
const GOALS = [15, 30, 45, 60];

interface Prefs {
  stream: string; examYear: string; dailyGoalMinutes: number; targetReadiness: number;
}

export function SettingsForm({ initial }: { initial: Prefs }) {
  const router = useRouter();
  const [prefs, setPrefs] = useState(initial);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const set = (p: Partial<Prefs>) => { setPrefs((s) => ({ ...s, ...p })); setSaved(false); };

  async function save() {
    setSaving(true);
    await fetch("/api/onboarding", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...prefs, program: prefs.stream }),
    });
    setSaving(false); setSaved(true);
    router.refresh();
  }

  async function reset() {
    if (!confirm("This permanently clears all attempts, mistakes, reviews and exam history. Continue?")) return;
    setResetting(true);
    await fetch("/api/reset", { method: "POST" });
    setResetting(false);
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader><CardTitle className="text-base">Appearance</CardTitle><CardDescription>Light, dark, or follow your system.</CardDescription></CardHeader>
        <CardContent className="flex items-center justify-between">
          <span className="text-sm">Theme</span>
          <ThemeToggle />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Program</CardTitle><CardDescription>Your specialization stream and exam cycle.</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium">Stream</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {STREAMS.map((s) => (
                <Pill key={s} selected={prefs.stream === s} onClick={() => set({ stream: s })}>{s}</Pill>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Exam year</p>
            <div className="grid grid-cols-3 gap-2">
              {YEARS.map((y) => <Pill key={y} selected={prefs.examYear === y} onClick={() => set({ examYear: y })} center>{y}</Pill>)}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Study goal</CardTitle><CardDescription>Daily target and your readiness ambition.</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium">Daily practice</p>
            <div className="grid grid-cols-4 gap-2">
              {GOALS.map((g) => <Pill key={g} selected={prefs.dailyGoalMinutes === g} onClick={() => set({ dailyGoalMinutes: g })} center>{g}m</Pill>)}
            </div>
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium">Target readiness</span>
              <span className="font-semibold tabular-nums text-primary">{prefs.targetReadiness}%</span>
            </div>
            <input type="range" min={60} max={95} step={5} value={prefs.targetReadiness}
              onChange={(e) => set({ targetReadiness: Number(e.target.value) })}
              className="w-full accent-[hsl(var(--primary))]" />
          </div>
          <Button onClick={save} disabled={saving}>
            {saving ? <Loader2 className="animate-spin" /> : saved ? <Check /> : null}
            {saved ? "Saved" : "Save changes"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Data</CardTitle><CardDescription>Clear your history and start over.</CardDescription></CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={reset} disabled={resetting}>
            {resetting ? <Loader2 className="animate-spin" /> : <Trash2 />} Reset all progress
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function Pill({ selected, onClick, children, center }: { selected: boolean; onClick: () => void; children: React.ReactNode; center?: boolean }) {
  return (
    <button onClick={onClick} className={cn(
      "flex items-center gap-2 rounded-lg border p-2.5 text-sm font-medium transition-all",
      center && "justify-center",
      selected ? "border-primary bg-primary/10 ring-1 ring-primary" : "hover:bg-accent",
    )}>
      {!center && <span className={cn("flex h-4 w-4 items-center justify-center rounded-full border", selected && "border-primary bg-primary text-primary-foreground")}>{selected && <Check size={11} />}</span>}
      {children}
    </button>
  );
}
