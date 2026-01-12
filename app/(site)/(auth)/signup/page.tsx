"use client";

import GuestGuard from "@/features/auth/components/guest-guard";
import { SignUpForm } from "@/features/auth/components/sign-up-form";

export default function SignUpPage() {
  return (
    <GuestGuard>
      <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-blue-600/5 dark:bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />
        <SignUpForm />
      </div>
    </GuestGuard>
  );
}