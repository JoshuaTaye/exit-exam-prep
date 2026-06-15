"use client";

import { useEffect, useState } from "react";
import { AnimatedNumber } from "./animated-number";

export function StatRing({
  value, size = 170, stroke = 12, label, sublabel, color = "hsl(var(--primary))",
}: {
  value: number; size?: number; stroke?: number;
  label?: string; sublabel?: string; color?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  const [offset, setOffset] = useState(c);
  useEffect(() => {
    const t = setTimeout(() => setOffset(c - (pct / 100) * c), 50);
    return () => clearTimeout(t);
  }, [pct, c]);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <AnimatedNumber value={value} suffix="%" className="text-4xl font-bold tabular-nums" />
        {label && <span className="mt-0.5 text-xs font-medium text-muted-foreground">{label}</span>}
        {sublabel && <span className="mt-0.5 text-[11px] text-muted-foreground">{sublabel}</span>}
      </div>
    </div>
  );
}
