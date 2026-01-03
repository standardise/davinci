"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { Zap, Box, Calculator, ShieldCheck } from "lucide-react";

export function Pricing() {
  const [modelsPerMonth, setModelsPerMonth] = useState(5);
  const [rowsPerMonth, setRowsPerMonth] = useState(10000);

  const MODEL_COST = 0.98;
  const INFERENCE_COST_PER_1K = 0.0098;

  const modelCost = modelsPerMonth * MODEL_COST;
  const inferenceCost = (rowsPerMonth / 1000) * INFERENCE_COST_PER_1K;
  const totalCost = modelCost + inferenceCost;

  return (
    <section
      id="pricing"
      className="py-24 px-4 lg:px-8 relative overflow-hidden bg-black text-white selection:bg-blue-500/30"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 text-xs font-medium text-zinc-400 mb-2 backdrop-blur-md">
            <Calculator className="w-3 h-3 text-blue-400" />
            <span>Transparent Calculation</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            Simple,{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-400">
              Pay-as-you-go
            </span>{" "}
            Pricing
          </h2>
          <p className="text-lg text-zinc-400">
            No subscriptions. No hidden fees. Credits never expire.
            <br />
            Start small and scale indefinitely.
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-12">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-zinc-900/40 border-zinc-800 p-6 flex items-center flex-row justify-between hover:bg-zinc-900/60 transition-colors backdrop-blur-sm group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <Box className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-left">
                  <div className="text-sm text-zinc-400 font-medium">
                    Build Model
                  </div>
                  <div className="text-xs text-zinc-500">Training & Tuning</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold font-mono text-white">
                  $0.98
                </div>
                <div className="text-xs text-zinc-500">per job</div>
              </div>
            </Card>

            <Card className="bg-zinc-900/40 border-zinc-800 p-6 flex flex-row items-center justify-between hover:bg-zinc-900/60 transition-colors backdrop-blur-sm group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                  <Zap className="w-6 h-6 text-purple-400" />
                </div>
                <div className="text-left">
                  <div className="text-sm text-zinc-400 font-medium">
                    Inference
                  </div>
                  <div className="text-xs text-zinc-500">Batch Prediction</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold font-mono text-white">
                  ~$0.098
                </div>
                <div className="text-xs text-zinc-500">per 1k rows</div>
              </div>
            </Card>
          </div>
        </div>

        <Card className="max-w-4xl mx-auto mb-16 bg-zinc-950/80 border-zinc-800 p-8 md:p-12 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] -z-10" />

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-10">
              <div>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  Estimate Monthly Usage
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-300 font-medium text-sm">
                    Models trained
                  </label>
                  <div className="flex items-center gap-2 bg-zinc-900 rounded-lg border border-zinc-800 px-3 py-1">
                    <input
                      type="number"
                      value={modelsPerMonth}
                      onChange={(e) =>
                        setModelsPerMonth(
                          Math.max(0, Math.min(50, Number(e.target.value) || 0))
                        )
                      }
                      className="w-12 bg-transparent text-right font-mono text-white focus:outline-none text-sm"
                    />
                    <span className="text-zinc-500 text-xs">/mo</span>
                  </div>
                </div>
                <Slider
                  value={[modelsPerMonth]}
                  onValueChange={(value) => setModelsPerMonth(value[0])}
                  max={50}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-300 font-medium text-sm">
                    Rows predicted
                  </label>
                  <div className="flex items-center gap-2 bg-zinc-900 rounded-lg border border-zinc-800 px-3 py-1">
                    <input
                      type="number"
                      value={rowsPerMonth}
                      onChange={(e) =>
                        setRowsPerMonth(
                          Math.max(
                            0,
                            Math.min(1000000, Number(e.target.value) || 0)
                          )
                        )
                      }
                      className="w-20 bg-transparent text-right font-mono text-white focus:outline-none text-sm"
                    />
                    <span className="text-zinc-500 text-xs">/mo</span>
                  </div>
                </div>
                <Slider
                  value={[rowsPerMonth]}
                  onValueChange={(value) => setRowsPerMonth(value[0])}
                  max={1000000}
                  step={1000}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-zinc-600 font-mono">
                  <span>0</span>
                  <span>1M rows</span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900/50 rounded-2xl p-8 border border-zinc-800 flex flex-col justify-between h-full min-h-70">
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-zinc-400 border-b border-zinc-800 pb-3">
                  <span>Training Cost</span>
                  <span className="font-mono text-white">
                    ${modelCost.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-zinc-400 border-b border-zinc-800 pb-3">
                  <span>Inference Cost</span>
                  <span className="font-mono text-white">
                    ${inferenceCost.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-6 text-center lg:text-right space-y-2">
                <p className="text-zinc-400 text-sm font-medium uppercase tracking-wider">
                  Estimated Total
                </p>
                <div className="text-5xl lg:text-6xl font-bold font-mono text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-indigo-400 to-cyan-400 drop-shadow-2xl">
                  ${totalCost.toFixed(2)}
                </div>
                <p className="text-zinc-500 text-sm">per month</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h3 className="text-2xl md:text-3xl font-bold text-white">
              Ready to start?
            </h3>
            <p className="text-lg text-zinc-400">
              Top up as little as{" "}
              <span className="text-white font-bold">$5</span>.
              <br className="hidden md:block" />
              We process payments securely via Stripe.
            </p>
          </div>

          <Button className="h-14 px-12 text-lg bg-white text-black hover:bg-zinc-200 rounded-full font-bold shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] transition-all duration-300 transform hover:scale-105">
            Top up $5 & Start Building
          </Button>

          <div className="items-center justify-center gap-2 text-sm text-zinc-500 bg-zinc-900/50 py-2 px-4 rounded-full inline-flex border border-zinc-800/50">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Auto-refund on failed training jobs.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
