"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RegeneratePlanButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  return (
    <Button
      onClick={async () => {
        setLoading(true);
        await fetch("/api/plan", { method: "POST" });
        router.refresh();
        setLoading(false);
      }}
      disabled={loading}
    >
      {loading ? <Loader2 className="animate-spin" /> : <RefreshCw />}
      Regenerate plan
    </Button>
  );
}
