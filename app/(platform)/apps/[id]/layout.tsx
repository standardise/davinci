import React from "react";
import { Navbar } from "@/features/applications/components/webapp/navigation";

export default async function AppLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-background">
      <Navbar appId={id} />
      <main className="container mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  );
}
