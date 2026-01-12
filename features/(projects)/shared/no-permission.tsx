"use client";

import React from "react";
import { ShieldAlert, Lock, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProjectNoPermission() {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center space-y-6 text-center">
      <div className="relative">
        <div className="absolute -inset-4 rounded-full bg-rose-500/10 blur-2xl" />
        <div className="relative flex size-24 items-center justify-center rounded-3xl border border-rose-500/20 bg-background shadow-sm">
          <Lock className="size-10 text-rose-500" />
        </div>
        <div className="absolute -bottom-2 -right-2 flex size-8 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg border-2 border-background">
          <ShieldAlert className="size-4" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-rose-500">
          Access Denied
        </h2>
        <h1 className="text-2xl font-bold tracking-tight">Restricted Area</h1>
        <p className="max-w-[320px] text-sm text-muted-foreground leading-relaxed">
          You don{"'"}t have the required permissions to view this project.
          Please contact your workspace administrator.
        </p>
      </div>

      <div className="flex flex-col gap-3 pt-2">
        <Button
          variant="ghost"
          className="rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          <LifeBuoy className="mr-2 size-4" /> Contact Support
        </Button>
        <Button
          variant="outline"
          onClick={() => (window.location.href = "/dashboard/projects")}
          className="rounded-xl px-10 border-zinc-200"
        >
          Return to Hub
        </Button>
      </div>
    </div>
  );
}
