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
      color: "text-rose-400",
      bg: "bg-rose-500/10",
      border: "group-hover:border-rose-500/30",
      // Visual: Table showing User Risk Scores
      visual: (
        <div className="w-full space-y-3 font-mono text-xs">
          <div className="flex justify-between items-center text-zinc-500 px-2">
            <span>USER_ID</span>
            <span>RISK_SCORE</span>
          </div>
          {/* Row 1: High Risk */}
          <div className="flex justify-between items-center bg-zinc-900/80 p-2 rounded border border-rose-500/20">
            <span className="text-zinc-300">USR_8821</span>
            <div className="flex items-center gap-2 text-rose-400 font-bold">
              <AlertCircle className="w-3 h-3" />
              <span>92% (High)</span>
            </div>
          </div>
          {/* Row 2: Low Risk */}
          <div className="flex justify-between items-center bg-zinc-900/40 p-2 rounded border border-zinc-800">
            <span className="text-zinc-500">USR_8822</span>
            <span className="text-emerald-500">12% (Safe)</span>
          </div>
        </div>
      ),
    },
    {
      icon: Package,
      title: "Demand Forecasting",
      description:
        "Optimize inventory with precision. Visualize future demand patterns to prevent stockouts.",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "group-hover:border-blue-500/30",
      // Visual: Bar Chart (Actual vs Predicted)
      visual: (
        <div className="w-full h-24 flex items-end justify-between gap-2 px-2 pb-2">
          {/* Historical Data (Solid) */}
          {[40, 60, 45, 70].map((h, i) => (
            <div
              key={i}
              className="w-full bg-zinc-700/50 rounded-sm"
              style={{ height: `${h}%` }}
            />
          ))}
          {/* Divider */}
          <div className="w-px h-full bg-zinc-800 border-l border-dashed border-zinc-600 mx-1 relative">
            <span className="absolute -top-4 -left-6 text-[10px] text-zinc-500 w-20 text-center">
              Forecast
            </span>
          </div>
          {/* Predicted Data (Colored & Pulsing) */}
          {[85, 95, 60].map((h, i) => (
            <div
              key={`p-${i}`}
              className="w-full bg-blue-500/80 rounded-sm relative group"
              style={{ height: `${h}%` }}
            >
              {/* Tooltip effect on hover */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-blue-600 text-[9px] text-white px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {h * 10}
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
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "group-hover:border-purple-500/30",
      // Visual: Price Change Card
      visual: (
        <div className="w-full flex items-center justify-between bg-zinc-900/80 p-4 rounded-lg border border-zinc-800">
          <div className="space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
              Current Price
            </span>
            <div className="text-zinc-400 line-through text-sm">$120.00</div>
          </div>

          <ArrowRight className="w-4 h-4 text-zinc-600" />

          <div className="space-y-1 text-right">
            <span className="text-[10px] text-purple-400 uppercase tracking-wider flex items-center justify-end gap-1">
              Optimized <ArrowUpRight className="w-3 h-3" />
            </span>
            <div className="text-xl font-bold text-white flex items-center gap-1">
              <span className="text-purple-400">$</span>145.50
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="use-cases" className="py-24 px-4 lg:px-8 relative bg-black">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-full max-h-125 bg-zinc-900/20 blur-[100px] rounded-full -z-10" />

      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-white">
            Solving <span className="text-zinc-500">Real-World</span> Problems
          </h2>
          <p className="text-lg text-zinc-400">
            Davinci transforms raw data into specific, actionable outputs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {cases.map((useCase, index) => (
            <Card
              key={index}
              className={`bg-zinc-950 border-zinc-800 p-8 hover:bg-zinc-900/80 transition-all duration-300 group border ${useCase.border}`}
            >
              <div className="space-y-8">
                {/* Header Icon & Title */}
                <div className="flex items-start justify-between">
                  <div
                    className={`w-12 h-12 rounded-xl ${useCase.bg} flex items-center justify-center transition-transform group-hover:scale-110`}
                  >
                    <useCase.icon className={`w-6 h-6 ${useCase.color}`} />
                  </div>
                  {/* Abstract Input Badge */}
                  <div className="px-2 py-1 rounded text-[10px] font-mono border border-zinc-800 text-zinc-500 bg-zinc-900">
                    INPUT: CSV
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3 text-white">
                    {useCase.title}
                  </h3>
                  <p className="text-zinc-400 leading-relaxed text-sm">
                    {useCase.description}
                  </p>
                </div>

                {/* The Mockup Visual (Output) */}
                <div className="relative pt-6 border-t border-zinc-800/50">
                  <div className="absolute -top-3 left-0 bg-zinc-950 px-2 text-[10px] text-zinc-500 font-mono tracking-widest">
                    OUTPUT PREVIEW
                  </div>
                  {useCase.visual}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
