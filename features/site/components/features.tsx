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
      className="py-24 px-4 lg:px-8 relative bg-background overflow-hidden transition-colors duration-300"
    >
      {/* Background Glows - ปรับให้จางลงเพื่อขับเอฟเฟกต์กระจก */}
      <div className="absolute top-0 right-0 w-125 h-125 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-125 h-125 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto relative z-10">
        <div className="mb-16 max-w-2xl">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
            Built for{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400">
              Intelligence
            </span>
            .
          </h2>
          <p className="text-lg text-muted-foreground">
            Davinci orchestrates complex machine learning workflows behind a
            simple interface.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:auto-rows-fr">
          {/* Main Feature Card - Glass Blur Effect */}
          <Card className="md:col-span-2 lg:row-span-2 bg-card/30 border-white/10 dark:border-white/5 p-8 hover:border-primary/40 transition-all duration-500 group overflow-hidden relative backdrop-blur-md shadow-xl">
            {/* Inner Glow สำหรับเอฟเฟกต์กระจก */}
            <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-50 pointer-events-none" />
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="h-full flex flex-col justify-between relative z-10">
              <div className="space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 group-hover:border-primary/40 transition-all duration-300 shadow-lg">
                  <Sparkles className="w-7 h-7 text-foreground group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-4 text-card-foreground">
                    Adaptive Intelligence
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
                    Auto-detects problem types. No manual tuning required. Our
                    AI engine analyzes your data patterns and automatically
                    selects the optimal forecasting model.
                  </p>
                </div>
              </div>

              {/* Chart Visualization Area */}
              <div className="mt-8 relative h-32 md:h-48 w-full rounded-xl bg-black/10 dark:bg-white/5 border border-white/10 overflow-hidden flex items-end justify-center gap-2 p-4 backdrop-blur-sm">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95].map((height, i) => (
                  <div
                    key={i}
                    className="w-full bg-linear-to-t from-blue-500/80 to-indigo-400/80 rounded-t-sm transition-all duration-1000 group-hover:opacity-100 opacity-40"
                    style={{
                      height: `${height}%`,
                      transitionDelay: `${i * 50}ms`,
                    }}
                  />
                ))}
                <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent" />
              </div>
            </div>
          </Card>

          {/* Small Feature Card - Glass Blur Effect */}
          {[
            {
              title: "Velocity",
              desc: "Process 10,000+ rows in seconds. Enterprise-grade performance.",
              icon: Zap,
              color: "text-indigo-500",
              hover: "hover:border-indigo-500/40",
            },
            {
              title: "Bank-Grade Security",
              desc: "Encrypted & Private. Your data never leaves your control. SOC 2 Type II.",
              icon: ShieldCheck,
              color: "text-emerald-500",
              hover: "hover:border-emerald-500/40",
            },
            {
              title: "Spreadsheet Native",
              desc: "If you can use Excel, you can use Davinci. No coding required.",
              icon: FileSpreadsheet,
              color: "text-cyan-500",
              hover: "hover:border-cyan-500/40",
            },
          ].map((item, idx) => (
            <Card
              key={idx}
              className={`bg-card/30 border-white/10 dark:border-white/5 p-8 ${item.hover} transition-all duration-300 group backdrop-blur-md relative overflow-hidden shadow-lg`}
            >
              {idx === 0 && (
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                  <ArrowUpRight className="text-muted-foreground" />
                </div>
              )}
              <div className="space-y-6 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/40 transition-all duration-300">
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-card-foreground">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {item.desc}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
