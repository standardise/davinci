"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("System Exception:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 text-center">
      <div className="flex size-20 items-center justify-center rounded-3xl bg-amber-500/10 border border-amber-500/20">
        <AlertTriangle className="size-10 text-amber-600" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">System Exception</h1>
        <p className="max-w-87.5 text-sm text-muted-foreground">
          An unexpected error occurred while processing this project. Our
          engineers have been notified.
        </p>
        {error.digest && (
          <p className="text-[10px] font-mono text-zinc-400">
            ID: {error.digest}
          </p>
        )}
      </div>

      <Button onClick={() => reset()} className="rounded-xl px-8 gap-2">
        <RefreshCcw className="size-4" /> Try Again
      </Button>
    </div>
  );
}
