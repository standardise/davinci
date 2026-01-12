"use client";

import React from "react";
import { Construction, Boxes, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServicePlaceholderProps {
  serviceName: string;
  expectedFeature?: string;
}

export function ServicePlaceholder({
  serviceName,
  expectedFeature,
}: ServicePlaceholderProps) {
  return (
    <div className="flex min-h-100 w-full flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-muted/20 p-8 text-center backdrop-blur-sm">
      <div className="relative mb-6">
        <div className="absolute -inset-1 rounded-full bg-primary/20 blur-xl animate-pulse" />
        <div className="relative flex size-20 items-center justify-center rounded-2xl bg-background border border-border shadow-2xl">
          <Boxes
            className="size-10 text-primary animate-bounce"
            style={{ animationDuration: "3s" }}
          />
        </div>
      </div>

      <div className="max-w-md space-y-3">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/60">
          Module Under Construction
        </h2>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {serviceName} Engine
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          We are currently implementing high-precision algorithms for this
          module. The{" "}
          <span className="font-semibold text-foreground">
            {expectedFeature || "next-generation AI"}
          </span>{" "}
          logic is being calibrated for production-grade reliability.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        <div className="flex items-center gap-1.5 rounded-full bg-background border border-border px-3 py-1 text-[10px] font-medium text-zinc-500">
          <Zap className="size-3 text-amber-500" />
          PERFORMANCE TUNING
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-background border border-border px-3 py-1 text-[10px] font-medium text-zinc-500">
          <Construction className="size-3 text-blue-500" />
          CORE IMPLEMENTATION
        </div>
      </div>

      <div className="mt-10 flex gap-3">
        <Button
          variant="outline"
          className="rounded-xl px-6 h-11 text-xs font-semibold"
        >
          Check Roadmap
        </Button>
        <Button className="rounded-xl px-6 h-11 text-xs font-semibold gap-2">
          Notify Me When Ready <ArrowRight className="size-3" />
        </Button>
      </div>
    </div>
  );
}
