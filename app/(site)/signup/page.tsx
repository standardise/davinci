"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-blue-600/5 dark:bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full mt-10 max-w-md relative z-10">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-6">
            <span className="text-2xl font-bold text-foreground tracking-tight italic"></span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Create an account
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Start building institutional-grade models today.
          </p>
        </div>
        <div className="p-8 rounded-3xl border border-white/5 dark:border-white/2 bg-transparent backdrop-blur-[2px] relative group">
          <div className="absolute inset-0 bg-linear-to-br from-white/2 to-transparent pointer-events-none rounded-3xl" />

          <form className="space-y-5 relative z-10">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="firstname"
                  className="text-foreground/70 text-xs font-semibold uppercase tracking-wider"
                >
                  First name
                </Label>
                <Input
                  id="firstname"
                  placeholder="John"
                  className="bg-transparent border-white/10 dark:border-white/5 focus:border-primary/30 focus:ring-0 text-foreground placeholder:text-muted-foreground/30 h-11 transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="lastname"
                  className="text-foreground/70 text-xs font-semibold uppercase tracking-wider"
                >
                  Last name
                </Label>
                <Input
                  id="lastname"
                  placeholder="Doe"
                  className="bg-transparent border-white/10 dark:border-white/5 focus:border-primary/30 focus:ring-0 text-foreground placeholder:text-muted-foreground/30 h-11 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-foreground/70 text-xs font-semibold uppercase tracking-wider"
              >
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@company.com"
                className="bg-transparent border-white/10 dark:border-white/5 focus:border-primary/30 focus:ring-0 text-foreground placeholder:text-muted-foreground/30 h-11 transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-foreground/70 text-xs font-semibold uppercase tracking-wider"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="bg-transparent border-white/10 dark:border-white/5 focus:border-primary/30 focus:ring-0 text-foreground placeholder:text-muted-foreground/30 h-11 transition-all"
              />
              <p className="text-[10px] text-muted-foreground/60 italic">
                Must be at least 8 characters.
              </p>
            </div>

            <Button className="w-full bg-foreground text-background hover:opacity-90 mt-4 font-bold h-12 rounded-xl transition-all active:scale-[0.98] shadow-2xl">
              Create Account <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </div>

        {/* Footer Link */}
        <p className="text-center text-sm text-muted-foreground mt-10">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="text-foreground font-bold hover:text-primary transition-colors"
          >
            Sign in
          </Link>
        </p>

        <p className="text-center text-[10px] text-muted-foreground/40 uppercase tracking-[0.2em] mt-16">
          A project by Standardise.ltd
        </p>
      </div>
    </div>
  );
}
