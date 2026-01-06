"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/features/auth/context/auth-provider";
import GuestGuard from "@/features/auth/components/guest-guard";

export default function SignInPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Validation ง่ายๆ
    if (!email || !password) {
      setError("Please enter both email and password.");
      setIsLoading(false);
      return;
    }

    try {
      const result = await login(email, password);

      if (!result.success) {
        setError(result.message || "Invalid credentials.");
        setIsLoading(false);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
      setIsLoading(false);
    }
  };

  return (
    <GuestGuard>
      <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-primary/5 dark:bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full mt-10 max-w-md relative z-10">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6">
              <span className="text-2xl font-bold text-foreground tracking-tight italic">
                Davinci
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Welcome back
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Enter your credentials to access the console.
            </p>
          </div>

          <div className="p-8 rounded-3xl border border-white/10 dark:border-white/3 bg-transparent backdrop-blur-[2px] relative">
            <div className="absolute inset-0 bg-linear-to-br from-white/2 to-transparent pointer-events-none rounded-3xl" />

            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              {error && (
                <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-500/10 border border-red-500/20 rounded-lg animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

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
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null); // พิมพ์ใหม่แล้วลบ Error
                  }}
                  disabled={isLoading}
                  placeholder="name@example.com"
                  className="bg-transparent border-white/10 dark:border-white/5 focus:border-primary/30 focus:ring-0 text-foreground placeholder:text-muted-foreground/30 h-11 transition-all"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-foreground/70 text-xs font-semibold uppercase tracking-wider"
                  >
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-primary/80 hover:text-primary transition-colors font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  disabled={isLoading}
                  placeholder="••••••••"
                  className="bg-transparent border-white/10 dark:border-white/5 focus:border-primary/30 focus:ring-0 text-foreground placeholder:text-muted-foreground/30 h-11 transition-all"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-foreground text-background hover:opacity-90 mt-4 font-bold h-12 rounded-xl transition-all active:scale-[0.98] shadow-2xl disabled:opacity-70 disabled:pointer-events-none"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Signing In...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-10">
            Don{"'"}t have an account?{" "}
            <Link
              href="/signup"
              className="text-foreground font-bold hover:text-primary transition-colors"
            >
              Sign up
            </Link>
          </p>

          <p className="text-center text-[10px] text-muted-foreground/40 uppercase tracking-[0.2em] mt-16">
            A project by Standardise.ltd
          </p>
        </div>
      </div>
    </GuestGuard>
  );
}
