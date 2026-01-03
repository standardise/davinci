"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-4 lg:px-8 overflow-hidden bg-background transition-colors duration-300">
      {/* Background Glows - ปรับให้รองรับทั้งสองโหมด */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-200 bg-blue-600/10 dark:bg-blue-900/20 rounded-full blur-[120px] opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-150 h-150 bg-indigo-600/10 dark:bg-indigo-900/20 rounded-full blur-[120px] opacity-50 pointer-events-none" />

      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 text-center lg:text-left">
            {/* Badge - Glass Effect */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted/50 text-sm font-medium text-muted-foreground backdrop-blur-md mx-auto lg:mx-0 shadow-sm">
              <Sparkles className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              <span>Enterprise-grade AI forecasting</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter text-foreground leading-[1.1]">
              Future,
              <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-500 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-500">
                Predicted.
              </span>
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0 text-balance">
              Transform historical data into strategic foresight. The enterprise
              platform for high-precision forecasting at scale.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:opacity-90 rounded-full px-8 text-base font-semibold shadow-lg shadow-blue-500/20 transition-all"
              >
                Start Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 border-border bg-background/50 backdrop-blur-sm hover:bg-accent transition-all"
              >
                View Demo
              </Button>
            </div>

            {/* Trusted By - ปรับ Logo SVG ให้รองรับสีโหมด */}
            <div className="pt-10 space-y-6 border-t border-border/50 lg:border-none">
              <p className="text-sm text-zinc-500 uppercase tracking-wider font-medium">
                Trusted by forward-thinking data teams
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-8 opacity-40 grayscale hover:opacity-100 dark:hover:opacity-60 transition-all duration-300">
                {/* Logo 1 */}
                <svg
                  className="h-8 w-auto text-foreground"
                  viewBox="0 0 100 40"
                  fill="currentColor"
                >
                  <path
                    d="M10 20 L 30 10 L 50 30 L 70 15 L 90 25"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <circle cx="90" cy="25" r="4" />
                </svg>
                {/* Logo 2 */}
                <svg
                  className="h-6 w-auto text-foreground"
                  viewBox="0 0 120 40"
                  fill="currentColor"
                >
                  <rect x="10" y="10" width="20" height="20" rx="4" />
                  <rect
                    x="40"
                    y="15"
                    width="20"
                    height="15"
                    rx="4"
                    opacity="0.7"
                  />
                  <rect
                    x="70"
                    y="5"
                    width="20"
                    height="25"
                    rx="4"
                    opacity="0.5"
                  />
                </svg>
                {/* Logo 3 */}
                <svg
                  className="h-7 w-auto text-foreground"
                  viewBox="0 0 100 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <circle cx="20" cy="20" r="10" />
                  <circle cx="50" cy="20" r="10" opacity="0.7" />
                  <circle cx="80" cy="20" r="10" opacity="0.4" />
                </svg>
              </div>
            </div>
          </div>

          {/* Right Visual - Abstract Data Trajectory */}
          <div className="relative hidden lg:block h-125 perspective-1000">
            <div className="absolute inset-0 flex items-center justify-center transform rotate-y-12 rotate-x-6 scale-110">
              <div className="relative w-full h-full max-w-125 max-h-125">
                {/* Central Glowing Orb - ปรับแสงให้นวลขึ้น */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-linear-to-tr from-blue-500/20 via-indigo-500/20 to-purple-500/20 blur-3xl animate-pulse" />

                <svg
                  viewBox="0 0 400 400"
                  className="absolute inset-0 w-full h-full overflow-visible"
                >
                  <defs>
                    <linearGradient
                      id="line-gradient-main"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                      <stop offset="50%" stopColor="#6366f1" stopOpacity="1" />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity="1" />
                    </linearGradient>
                    <linearGradient
                      id="line-gradient-faint"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                      <stop
                        offset="100%"
                        stopColor="#6366f1"
                        stopOpacity="0.3"
                      />
                    </linearGradient>
                  </defs>

                  <path
                    d="M 50 320 Q 150 280, 200 200 T 350 80"
                    fill="none"
                    stroke="url(#line-gradient-faint)"
                    strokeWidth="2"
                    className="opacity-30"
                  />
                  <path
                    d="M 70 340 Q 170 300, 220 220 T 370 100"
                    fill="none"
                    stroke="url(#line-gradient-faint)"
                    strokeWidth="2"
                    className="opacity-20"
                  />

                  <path
                    d="M 50 300 Q 150 200, 250 250 T 380 100"
                    fill="none"
                    stroke="url(#line-gradient-main)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                  />

                  <g className="transform translate-x-95 translate-y-25">
                    <circle
                      r="8"
                      fill="#a855f7"
                      className="animate-ping opacity-75"
                    />
                    <circle
                      r="6"
                      fill="currentColor"
                      className="text-white dark:text-white drop-shadow-[0_0_10px_rgba(168,85,247,1)]"
                    />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
