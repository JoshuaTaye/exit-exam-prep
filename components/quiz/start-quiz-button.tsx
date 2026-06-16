"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";

export interface QuizSpec {
  mode: "quick" | "topic" | "course" | "weakness" | "mistake" | "simulation" | "single";
  topicId?: number;
  courseId?: number;
  questionId?: number;
  n?: number;
}

export function StartQuizButton({
  spec,
  children,
  variant,
  size,
  className,
}: {
  spec: QuizSpec;
  children: React.ReactNode;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(spec),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not start session");
      router.push(`/session/${data.examId}`);
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  }

  return (
    <div className={className}>
      <Button onClick={start} disabled={loading} variant={variant} size={size}>
        {loading && <Loader2 className="animate-spin" />}
        {children}
      </Button>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
