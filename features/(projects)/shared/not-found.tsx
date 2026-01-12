"use client";

import React from "react";
import { FileSearch, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function ProjectNotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center space-y-6 text-center">
      <div className="relative">
        <div className="absolute -inset-4 rounded-full bg-muted/50 blur-2xl" />
        <div className="relative flex size-24 items-center justify-center rounded-3xl border border-border bg-background shadow-sm">
          <FileSearch className="size-12 text-muted-foreground/60" />
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Project Not Found</h1>
        <p className="max-w-75 text-sm text-muted-foreground leading-relaxed">
          The project you are looking for doesn{"'"}t exist or has been moved to
          another workspace.
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="rounded-xl px-6"
        >
          <ArrowLeft className="mr-2 size-4" /> Go Back
        </Button>
        <Button
          onClick={() => router.push("/dashboard/projects")}
          className="rounded-xl px-6 shadow-lg shadow-primary/20"
        >
          <Home className="mr-2 size-4" /> Project Hub
        </Button>
      </div>
    </div>
  );
}
