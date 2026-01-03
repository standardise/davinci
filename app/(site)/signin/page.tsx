"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full mt-10 max-w-md relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Welcome back
          </h1>
          <p className="text-zinc-400 mt-2 text-sm">
            Enter your credentials to access the console.
          </p>
        </div>

        <Card className="bg-zinc-950/50 border-0  p-8 backdrop-blur-xl shadow-2xl">
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="bg-zinc-900/50 border-zinc-800 focus:border-indigo-500 text-white placeholder:text-zinc-600"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-zinc-300">
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-indigo-400 hover:text-indigo-300"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="bg-zinc-900/50 border-zinc-800 focus:border-indigo-500 text-white placeholder:text-zinc-600"
              />
            </div>

            <Button className="w-full bg-white text-black hover:bg-zinc-200 mt-2 font-medium h-10">
              Sign In
            </Button>
          </form>
        </Card>

        {/* Footer Link */}
        <p className="text-center text-sm text-zinc-500 mt-8">
          Don{"'"}t have an account?{" "}
          <Link
            href="/signup"
            className="text-white hover:underline underline-offset-4"
          >
            Sign up
          </Link>
        </p>

        <p className="text-center text-xs text-zinc-600 mt-8">
          A project by Standardise.ltd
        </p>
      </div>
    </div>
  );
}
