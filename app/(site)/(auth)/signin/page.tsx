"use client";

import GuestGuard from "@/features/auth/components/guest-guard";
import { SignInForm } from "@/features/auth/components/sign-in-form";

export default function SignInPage() {
  return (
    <GuestGuard>
      <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-primary/5 dark:bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none" />
        <SignInForm />
      </div>
    </GuestGuard>
  );
}