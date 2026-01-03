"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full mt-10 max-w-md relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Create an account
          </h1>
          <p className="text-zinc-400 mt-2 text-sm">
            Start building institutional-grade models today.
          </p>
        </div>

        <Card className="bg-zinc-950/50 border-0 p-8 backdrop-blur-xl shadow-2xl">
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstname" className="text-zinc-300">
                  First name
                </Label>
                <Input
                  id="firstname"
                  placeholder="John"
                  className="bg-zinc-900/50 border-zinc-800 focus:border-blue-500 text-white placeholder:text-zinc-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname" className="text-zinc-300">
                  Last name
                </Label>
                <Input
                  id="lastname"
                  placeholder="Doe"
                  className="bg-zinc-900/50 border-zinc-800 focus:border-blue-500 text-white placeholder:text-zinc-600"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@company.com"
                className="bg-zinc-900/50 border-zinc-800 focus:border-blue-500 text-white placeholder:text-zinc-600"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="bg-zinc-900/50 border-zinc-800 focus:border-blue-500 text-white placeholder:text-zinc-600"
              />
              <p className="text-[10px] text-zinc-500">
                Must be at least 8 characters.
              </p>
            </div>

            {/* Submit Button */}
            <Button className="w-full bg-white text-black hover:bg-zinc-200 mt-2 font-medium h-10">
              Create Account <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </Card>

        {/* Footer Link */}
        <p className="text-center text-sm text-zinc-500 mt-8">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="text-white hover:underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>

        <p className="text-center text-xs text-zinc-600 mt-8">
          A project by Standardise.ltd
        </p>
      </div>
    </div>
  );
}
