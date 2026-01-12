"use client";

import React from "react";
import {
  TableProperties,
  Database,
  Activity,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Clock,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { FeatureIntelligence } from "./feature-intelligence"; // คอมโพเนนต์ตารางที่เราทำไว้ก่อนหน้า
import { Button } from "@/components/ui/button";
import { TabularProject } from "../types";
import { projectIcons } from "@/lib/icons-map";

interface TabularProjectViewProps {
  project: TabularProject;
}

export function TabularProjectView({ project }: TabularProjectViewProps) {
  // ดึง Icon ตามที่ User เลือกไว้
  const ProjectIcon =
    projectIcons[project.icon_id as keyof typeof projectIcons] ||
    TableProperties;

  // สร้าง Dynamic Theme Styles
  const themeColor = project.theme_color || "primary";

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* --- 1. Hero Header Section --- */}
      <div className="relative overflow-hidden rounded-[2.5rem] border-0 bg-background p-8 md:p-12 shadow-sm">
        {/* Background Ambient Light ตาม Theme */}
        <div
          className={cn(
            "absolute -right-20 -top-20 size-80 rounded-full blur-[100px] opacity-20 pointer-events-none",
            `bg-${themeColor}-500`
          )}
        />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div
              className={cn(
                "flex size-20 items-center justify-center rounded-3xl shadow-inner transition-transform hover:rotate-3",
                `bg-${themeColor}-500/10`
              )}
            >
              <ProjectIcon
                className={cn("size-10", `text-${themeColor}-500`)}
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">
                  {project.name}
                </h1>
                <Badge
                  variant="outline"
                  className="rounded-md uppercase tracking-tighter text-[10px]"
                >
                  v{project.version}
                </Badge>
              </div>
              <p className="text-muted-foreground max-w-lg text-sm leading-relaxed">
                {project.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge
              className={cn(
                "h-10 px-4 rounded-xl font-bold uppercase tracking-widest text-[10px]",
                project.status === "ready"
                  ? "bg-emerald-500 hover:bg-emerald-600"
                  : "bg-amber-500 hover:bg-amber-600"
              )}
            >
              {project.status}
            </Badge>
            <Button
              variant="outline"
              size="icon"
              className="size-10 rounded-xl"
            >
              <ExternalLink className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* --- 2. Quick Metrics & Info Ribbon --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Problem Type"
          value={project.problem_type}
          icon={Activity}
        />
        <MetricCard
          title="Target Column"
          value={project.target_column}
          icon={Target}
          isCode
        />
        <MetricCard
          title="ID Column"
          value={project.id_column}
          icon={ShieldCheck}
          isCode
        />
        <MetricCard
          title="Last Updated"
          value={new Date(project.updated_at).toLocaleDateString()}
          icon={Clock}
        />
      </div>

      {/* --- 3. Intelligence & Data Section --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* <FeatureIntelligence project={project} /> */}
        </div>

        <div className="space-y-6">
          <Card className="rounded-[2rem] border-border/40 bg-muted/20 shadow-none">
            <CardHeader>
              <CardTitle className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Dataset Resource
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-background border border-border shadow-sm">
                <Database className="size-5 text-primary" />
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs font-bold truncate">
                    REF: {project.dataset_reference}
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase">
                    Pooling Resource
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                className="w-full text-xs font-bold hover:bg-transparent hover:text-primary"
              >
                View Data Lab Details <ChevronRight className="ml-1 size-3" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, isCode = false }: any) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex size-10 items-center justify-center rounded-xl bg-muted/50">
        <Icon className="size-5 text-muted-foreground" />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {title}
        </span>
        <span
          className={cn(
            "text-sm font-bold",
            isCode && "font-mono text-primary"
          )}
        >
          {value}
        </span>
      </div>
    </div>
  );
}
