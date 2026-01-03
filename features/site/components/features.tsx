import { Card } from "@/components/ui/card";
import {
  Sparkles,
  Zap,
  ShieldCheck,
  FileSpreadsheet,
  ArrowUpRight,
} from "lucide-react";

export function Features() {
  return (
    <section
      id="features"
      className="py-24 px-4 lg:px-8 relative bg-black overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-125 h-125 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-125 h-125 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto relative z-10">
        <div className="mb-16 max-w-2xl">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Built for{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-400">
              Intelligence
            </span>
            .
          </h2>
          <p className="text-lg text-zinc-400">
            Davinci orchestrates complex machine learning workflows behind a
            simple interface.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          <Card className="md:col-span-2 lg:row-span-2 bg-zinc-900/40 border-zinc-800 p-8 hover:border-blue-500/30 transition-all duration-500 group overflow-hidden relative backdrop-blur-sm">
            <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="h-full flex flex-col justify-between relative z-10">
              <div className="space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-500/20 group-hover:border-blue-500/50 transition-all duration-300 shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)]">
                  <Sparkles className="w-7 h-7 text-white group-hover:text-blue-400 transition-colors" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-4 text-white">
                    Adaptive Intelligence
                  </h3>
                  <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
                    Auto-detects problem types. No manual tuning required. Our
                    AI engine analyzes your data patterns and automatically
                    selects the optimal forecasting model.
                  </p>
                </div>
              </div>

              <div className="mt-8 relative h-48 w-full rounded-xl bg-zinc-950/50 border border-zinc-800/50 overflow-hidden flex items-end justify-center gap-2 p-4">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95].map((height, i) => (
                  <div
                    key={i}
                    className="w-full bg-linear-to-t from-blue-600/80 to-indigo-400/80 rounded-t-sm transition-all duration-1000 group-hover:opacity-100 opacity-60"
                    style={{
                      height: `${height}%`,
                      transitionDelay: `${i * 50}ms`,
                    }}
                  />
                ))}
                <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-transparent to-transparent" />
              </div>
            </div>
          </Card>

          <Card className="bg-zinc-900/40 border-zinc-800 p-8 hover:bg-zinc-900/60 hover:border-indigo-500/30 transition-all duration-300 group backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
              <ArrowUpRight className="text-zinc-500" />
            </div>
            <div className="space-y-6 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center group-hover:bg-indigo-500/20 group-hover:border-indigo-500/50 transition-all duration-300">
                <Zap className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3 text-white">Velocity</h3>
                <p className="text-zinc-400 leading-relaxed text-sm">
                  Process 10,000+ rows in seconds. Enterprise-grade performance
                  without the complexity.
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-zinc-900/40 border-zinc-800 p-8 hover:bg-zinc-900/60 hover:border-emerald-500/30 transition-all duration-300 group backdrop-blur-sm">
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center group-hover:bg-emerald-500/20 group-hover:border-emerald-500/50 transition-all duration-300">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3 text-white">
                  Bank-Grade Security
                </h3>
                <p className="text-zinc-400 leading-relaxed text-sm">
                  Encrypted & Private. Your data never leaves your control. SOC
                  2 Type II certified.
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-zinc-900/40 border-zinc-800 p-8 hover:bg-zinc-900/60 hover:border-cyan-500/30 transition-all duration-300 group backdrop-blur-sm">
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center group-hover:bg-cyan-500/20 group-hover:border-cyan-500/50 transition-all duration-300">
                <FileSpreadsheet className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3 text-white">
                  Spreadsheet Native
                </h3>
                <p className="text-zinc-400 leading-relaxed text-sm">
                  If you can use Excel, you can use Davinci. No coding required.
                  Upload and predict.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
