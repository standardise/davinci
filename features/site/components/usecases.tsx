"use client";

import { Card } from "@/components/ui/card";
import {
  TrendingDown,
  Package,
  DollarSign,
  ArrowRight,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";

export function UseCases() {
  const cases = [
    {
      icon: TrendingDown,
      title: "Customer Churn",
      description:
        "Retain customers before they leave. Predict churn probability per user and take proactive action.",
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      border: "group-hover:border-rose-500/40",
      visual: (
        <div className="w-full space-y-3 font-mono text-xs">
          <div className="flex justify-between items-center text-muted-foreground px-2">
            <span>USER_ID</span>
            <span>RISK_SCORE</span>
          </div>
          <div className="flex justify-between items-center bg-background/50 backdrop-blur-sm p-2 rounded border border-rose-500/20 shadow-sm">
            <span className="text-foreground/80">USR_8821</span>
            <div className="flex items-center gap-2 text-rose-500 font-bold">
              <AlertCircle className="w-3 h-3" />
              <span>92% (High)</span>
            </div>
          </div>
          <div className="flex justify-between items-center bg-background/30 p-2 rounded border border-border">
            <span className="text-muted-foreground">USR_8822</span>
            <span className="text-emerald-500 font-medium">12% (Safe)</span>
          </div>
        </div>
      ),
    },
    {
      icon: Package,
      title: "Demand Forecasting",
      description:
        "Optimize inventory with precision. Visualize future demand patterns to prevent stockouts.",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "group-hover:border-blue-500/40",
      visual: (
        <div className="w-full h-24 flex items-end justify-between gap-2 px-2 pb-2">
          {[40, 60, 45, 70].map((h, i) => (
            <div
              key={i}
              className="w-full bg-muted rounded-sm"
              style={{ height: `${h}%` }}
            />
          ))}
          <div className="w-px h-full bg-border border-l border-dashed border-muted-foreground/30 mx-1 relative">
            <span className="absolute -top-4 -left-6 text-[9px] text-muted-foreground w-20 text-center font-mono">
              Forecast
            </span>
          </div>
          {[85, 95, 60].map((h, i) => (
            <div
              key={`p-${i}`}
              className="w-full bg-blue-500/60 dark:bg-blue-500/80 rounded-sm relative group/bar"
              style={{ height: `${h}%` }}
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-blue-600 text-[9px] text-white px-1.5 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                {h * 10} units
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      icon: DollarSign,
      title: "Dynamic Pricing",
      description:
        "Maximize revenue automatically. Adjust prices based on real-time demand elasticity.",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "group-hover:border-purple-500/40",
      visual: (
        <div className="w-full flex items-center justify-between bg-background/50 backdrop-blur-sm p-4 rounded-lg border border-border shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
              Current
            </span>
            <div className="text-muted-foreground/60 line-through text-sm">
              $120.00
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground/40" />
          <div className="space-y-1 text-right">
            <span className="text-[10px] text-purple-500 uppercase tracking-wider flex items-center justify-end gap-1 font-bold">
              Optimized <ArrowUpRight className="w-3 h-3" />
            </span>
            <div className="text-xl font-bold text-foreground flex items-center gap-1">
              <span className="text-purple-500">$</span>145.50
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section
      id="use-cases"
      className="py-24 px-4 lg:px-8 relative bg-background transition-colors duration-300"
    >
      {/* Background Decor - ปรับให้จางลง */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-full max-h-125 bg-primary/5 blur-[100px] rounded-full -z-10 pointer-events-none" />

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">
            Solving <span className="text-muted-foreground">Real-World</span>{" "}
            Problems
          </h2>
          <p className="text-lg text-muted-foreground">
            Davinci transforms raw data into specific, actionable outputs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {cases.map((useCase, index) => (
            <Card
              key={index}
              className={`bg-card/40 border-white/10 dark:border-white/5 p-8 hover:bg-card/60 transition-all duration-300 group backdrop-blur-md shadow-lg border ${useCase.border}`}
            >
              <div className="space-y-8">
                <div className="flex items-start justify-between">
                  <div
                    className={`w-12 h-12 rounded-xl ${useCase.bg} flex items-center justify-center transition-transform group-hover:scale-110 shadow-inner`}
                  >
                    <useCase.icon className={`w-6 h-6 ${useCase.color}`} />
                  </div>
                  <div className="px-2 py-1 rounded text-[10px] font-mono border border-border text-muted-foreground bg-muted/50 shadow-sm">
                    INPUT: CSV
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3 text-card-foreground">
                    {useCase.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {useCase.description}
                  </p>
                </div>

                <div className="relative pt-6 border-t border-border/50">
                  <div className="absolute -top-3 left-0 bg-background/80 px-2 text-[10px] text-muted-foreground font-mono tracking-widest backdrop-blur-sm">
                    OUTPUT PREVIEW
                  </div>
                  <div className="min-h-25 flex items-center">
                    {useCase.visual}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
