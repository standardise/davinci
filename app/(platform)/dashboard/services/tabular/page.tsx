"use client";

import React from "react";
import {
  Info,
  Plus,
  CheckCircle2,
  TrendingDown,
  ShieldCheck,
  Coins,
  Stethoscope,
  Users,
  Warehouse,
  ArrowRight,
  Clock,
  Target,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const businessCases = [
  {
    icon: TrendingDown,
    title: "Customer Churn",
    type: "CLASSIFICATION",
    description:
      "Analyze behavioral patterns to identify high-risk customers likely to cancel their subscription before they leave.",
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    border: "group-hover:border-rose-500/40",
    visual: (
      <div className="w-full space-y-2 font-mono text-[10px]">
        <div className="flex justify-between bg-rose-500/10 p-2 rounded border border-rose-500/20 shadow-sm">
          <span className="text-foreground/80">USR_4402 (Standard)</span>
          <span className="text-rose-500 font-bold">94% Risk</span>
        </div>
        <div className="flex justify-between bg-emerald-500/5 p-2 rounded border border-emerald-500/20 opacity-50">
          <span>USR_4403 (Premium)</span>
          <span className="text-emerald-500">5% Safe</span>
        </div>
      </div>
    ),
  },
  {
    icon: ShieldCheck,
    title: "Fraud Detection",
    type: "CLASSIFICATION",
    description:
      "Detect anomalous transaction patterns in real-time across banking or e-commerce systems to prevent financial loss.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "group-hover:border-amber-500/40",
    visual: (
      <div className="w-full p-2 rounded-lg bg-background border border-border flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">
            TX: #99121-B
          </span>
          <span className="px-1.5 py-0.5 rounded bg-amber-500 text-[8px] text-white font-bold animate-pulse">
            SUSPICIOUS
          </span>
        </div>
        <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-amber-500 w-[88%]" />
        </div>
        <span className="text-[8px] text-muted-foreground uppercase font-semibold">
          Anomaly: High-Velocity Transfer
        </span>
      </div>
    ),
  },
  {
    icon: Coins,
    title: "Credit Scoring",
    type: "REGRESSION",
    description:
      "Evaluate creditworthiness by analyzing historical financial data to assist lending teams in loan approval decisions.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "group-hover:border-blue-500/40",
    visual: (
      <div className="w-full flex items-center justify-around gap-2 bg-muted/30 p-3 rounded-xl border border-border">
        <div className="text-center">
          <div className="text-[8px] text-muted-foreground uppercase font-bold tracking-tighter">
            Rating
          </div>
          <div className="text-lg font-bold text-blue-500">782</div>
        </div>
        <ArrowRight className="size-3 text-muted-foreground" />
        <div className="px-3 py-1 rounded-full bg-blue-500 text-[10px] font-bold text-white shadow-sm uppercase tracking-tighter">
          Grade A+
        </div>
      </div>
    ),
  },
  {
    icon: Warehouse,
    title: "Procurement Risk",
    type: "CLASSIFICATION",
    description:
      "Assess supplier reliability and performance metrics to proactively mitigate supply chain disruptions.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "group-hover:border-emerald-500/40",
    visual: (
      <div className="w-full space-y-2">
        <div className="flex items-center justify-between p-2 rounded bg-background border border-border shadow-sm">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold">
              Logistics Partners Inc.
            </span>
            <span className="text-[7px] text-muted-foreground uppercase">
              Stable fulfillment
            </span>
          </div>
          <div className="text-emerald-500 text-[9px] font-bold flex items-center gap-1 uppercase">
            <CheckCircle2 className="size-3" /> Reliable
          </div>
        </div>
        <div className="flex items-center justify-between p-2 rounded bg-rose-500/5 border border-rose-500/20">
          <span className="text-[9px] font-bold opacity-70">
            Global Parts Co.
          </span>
          <div className="text-rose-500 text-[9px] font-bold flex items-center gap-1 uppercase">
            <AlertCircle className="size-3" /> Delay Risk
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: Stethoscope,
    title: "Patient Readmission",
    type: "CLASSIFICATION",
    description:
      "Predict the likelihood of patient readmission within 30 days to optimize post-discharge care plans.",
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    border: "group-hover:border-cyan-500/40",
    visual: (
      <div className="w-full space-y-2">
        <div className="flex items-center gap-2 p-2 rounded border border-border bg-background shadow-sm">
          <div className="size-2 rounded-full bg-rose-500" />
          <span className="text-[9px] font-medium flex-1">
            Case #88: 72% Probability
          </span>
          <Clock className="size-3 text-muted-foreground" />
        </div>
        <div className="flex items-center gap-2 p-2 rounded border border-border bg-background/50 opacity-40">
          <div className="size-2 rounded-full bg-emerald-500" />
          <span className="text-[9px] font-medium flex-1">
            Case #89: 12% Probability
          </span>
        </div>
      </div>
    ),
  },
  {
    icon: Users,
    title: "Employee Attrition",
    type: "CLASSIFICATION",
    description:
      "Identify key attrition drivers and high-risk employees to improve retention strategies and organizational health.",
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    border: "group-hover:border-indigo-500/40",
    visual: (
      <div className="w-full flex items-center justify-between p-3 rounded-lg border border-indigo-500/20 bg-indigo-500/5">
        <div className="flex flex-col">
          <span className="text-[9px] font-bold uppercase tracking-tighter opacity-50">
            Engagement
          </span>
          <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
            4.2 / 10
          </div>
        </div>
        <div className="text-right">
          <div className="text-[8px] text-muted-foreground uppercase">
            Retention Action
          </div>
          <div className="text-[10px] font-bold text-rose-500 underline decoration-rose-500/30 uppercase tracking-tighter">
            Review Hub
          </div>
        </div>
      </div>
    ),
  },
];

import { TabularProjectList } from "@/features/applications/components/tabular-project-list";

export default function TabularServicePage() {
  return (
    <div className="space-y-12 pb-24 selection:bg-primary/10">
      {/* 1. Service Hero Section */}
      <section className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 pt-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h1 className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary">
              Davinci AutoML Engine
            </h1>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
            Tabular Analysis <br />
            <span className="text-muted-foreground">Reimagined.</span>
          </h2>
          <p className="max-w-xl text-base text-muted-foreground leading-relaxed">
            Transform structured data into high-precision predictive outputs.
            Automated feature engineering, model selection, and SHAP
            interpretability built-in.
          </p>
        </div>
      </section>

      {/* 2. Project List Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
            <h3 className="text-2xl font-bold tracking-tight">Your Projects</h3>
        </div>
        <TabularProjectList />
      </section>

      {/* 3. Educational Section (Capabilities) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
        <div className="flex flex-col p-8 rounded-[2rem] border border-border/40 bg-muted/20 backdrop-blur-sm gap-4 transition-colors hover:bg-muted/30">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-foreground/70">
            <Info className="size-4 text-primary" /> Supported Structures
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Optimized for spreadsheets and relational databases. Handles missing
            values, categorical encoding, and temporal features automatically.
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {["CSV", "Parquet", "XLSX", "SQL Connector"].map((f) => (
              <span
                key={f}
                className="px-3 py-1 rounded-full bg-background border border-border/60 text-[10px] font-bold text-zinc-500 shadow-sm"
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col p-8 rounded-[2rem] border border-primary/10 bg-primary/5 backdrop-blur-sm gap-4">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-primary/80">
            <Target className="size-4" /> Decision Intelligence
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Built for decision-making. Every prediction comes with a detailed
            audit explaining the &quot;Why&quot; behind the AI&apos;s output
            using weighted SHAP averages.
          </p>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-2 text-[11px] font-bold">
              <CheckCircle2 className="size-3.5 text-emerald-500" />{" "}
              Multi-Strategy Voting
            </div>
            <div className="flex items-center gap-2 text-[11px] font-bold">
              <CheckCircle2 className="size-3.5 text-emerald-500" /> Global
              Optimization
            </div>
          </div>
        </div>
      </div>

      {/* 3. Use Case Gallery - Input/Output Visualization */}
      <section className="space-y-8 pt-6">
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-bold tracking-tight">
            Capabilities & Scenarios
          </h3>
          <p className="text-sm text-muted-foreground">
            Experience how your structured data translates into specific
            business outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businessCases.map((useCase, index) => (
            <Card
              key={index}
              className={cn(
                "group relative border-border/50 bg-card/40 p-8 transition-all duration-300 hover:bg-card/70 hover:shadow-2xl hover:shadow-zinc-200/50 dark:hover:shadow-zinc-950/50 rounded-[2rem] border overflow-hidden",
                useCase.border
              )}
            >
              <div className="space-y-8">
                <div className="flex items-start justify-between">
                  <div
                    className={cn(
                      "flex size-12 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:scale-110 shadow-inner",
                      useCase.bg
                    )}
                  >
                    <useCase.icon className={cn("size-6", useCase.color)} />
                  </div>
                  <div className="px-2.5 py-1 rounded-lg text-[9px] font-bold font-mono border border-border/60 text-muted-foreground bg-muted/40 shadow-sm">
                    {useCase.type}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-bold leading-tight">
                    {useCase.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed min-h-10">
                    {useCase.description}
                  </p>
                </div>

                {/* Output Preview Area */}
                <div className="relative pt-8 border-t border-border/40">
                  <div className="absolute -top-3 left-0 bg-background/90 px-3 py-0.5 rounded-full border border-border/40 text-[9px] font-bold uppercase tracking-widest text-muted-foreground backdrop-blur-sm">
                    Output Preview
                  </div>
                  <div className="flex min-h-25 items-center justify-center">
                    {useCase.visual}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
