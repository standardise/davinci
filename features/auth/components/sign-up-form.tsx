"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/features/auth/context/auth-provider";

export function SignUpForm() {
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (
      !formData.firstname ||
      !formData.lastname ||
      !formData.email ||
      !formData.password
    ) {
      setError("Please fill in all fields.");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        name: `${formData.firstname.trim()} ${formData.lastname.trim()}`,
        email: formData.email,
        password: formData.password,
      };

      const result = await register(payload);

      if (!result.success) {
        setError(result.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full mt-10 max-w-md relative z-10">
      <div className="text-center mb-10">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Create an account
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Start building institutional-grade models today.
        </p>
      </div>

      <div className="p-8 rounded-3xl border border-white/5 dark:border-white/2 bg-transparent backdrop-blur-[2px] relative group">
        <div className="absolute inset-0 bg-linear-to-br from-white/2 to-transparent pointer-events-none rounded-3xl" />

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-500/10 border border-red-500/20 rounded-lg animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

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
                value={formData.firstname}
                onChange={handleChange}
                placeholder="John"
                disabled={isLoading}
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
                value={formData.lastname}
                onChange={handleChange}
                placeholder="Doe"
                disabled={isLoading}
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
              value={formData.email}
              onChange={handleChange}
              placeholder="john@company.com"
              disabled={isLoading}
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
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={isLoading}
              className="bg-transparent border-white/10 dark:border-white/5 focus:border-primary/30 focus:ring-0 text-foreground placeholder:text-muted-foreground/30 h-11 transition-all"
            />
            <p className="text-[10px] text-muted-foreground/60 italic">
              Must be at least 8 characters.
            </p>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-foreground text-background hover:opacity-90 mt-4 font-bold h-12 rounded-xl transition-all active:scale-[0.98] shadow-2xl disabled:opacity-70 disabled:pointer-events-none"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Creating
                Account...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Create Account <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </form>
      </div>

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
  );
}
