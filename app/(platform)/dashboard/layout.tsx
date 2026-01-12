"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Search, Bell } from "lucide-react";

import { ModeToggle } from "@/components/mode-toggle";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import AuthGuard from "@/features/auth/components/auth-guard";
import { AppSidebar } from "@/features/dashboard/components/app-sidebar";
import { cn } from "@/lib/utils";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const getCurrentPageName = () => {
    if (pathname === "/dashboard") return "Overview";
    if (pathname.includes("/dashboard/projects")) return "Project Hub";
    if (pathname.includes("/dashboard/datasets")) return "Data Lab";

    if (pathname.includes("/dashboard/services/tabular"))
      return "Tabular Analysis";
    if (pathname.includes("/dashboard/services/timeseries"))
      return "Time Series Forecasting";
    if (pathname.includes("/dashboard/services/vision")) return "Vision AI";

    if (pathname.includes("/dashboard/predictions")) return "Prediction Audit";
    if (pathname.includes("/dashboard/billing")) return "Billing & Usage";
    if (pathname.includes("/dashboard/settings")) return "Settings";

    return "Dashboard";
  };

  return (
    <AuthGuard>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background selection:bg-primary/10">
          {/* Ambient Background - Soft & Professional */}
          <div className="fixed top-0 left-0 -z-10 h-full w-full">
            <div className="absolute top-0 left-0 h-125 w-125 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 h-125 w-125 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
          </div>

          <AppSidebar />

          <SidebarInset className="flex flex-col bg-transparent">
            {/* Header: Clean & Swiss Minimalist */}
            <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-border/40 bg-background/60 px-6 backdrop-blur-xl transition-all duration-300">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground transition-colors" />
                <Separator
                  orientation="vertical"
                  className="h-4 bg-border/60"
                />

                <nav className="flex items-center gap-2 text-[11px] font-medium tracking-wide uppercase">
                  <span className="text-muted-foreground/60">Platform</span>
                  <span className="text-muted-foreground/20">/</span>
                  <span className="text-foreground font-bold">
                    {getCurrentPageName()}
                  </span>
                </nav>
              </div>

              <div className="flex items-center gap-4">
                {/* Search: Sophisticated & Subtle */}
                <div className="relative group hidden md:block">
                  <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                  <input
                    className={cn(
                      "h-9 w-64 rounded-full border border-transparent bg-muted/40 pl-10 pr-4 text-[12px] outline-none transition-all",
                      "placeholder:text-muted-foreground/40",
                      "focus:bg-background focus:border-border focus:ring-4 focus:ring-primary/5 focus:w-80"
                    )}
                    placeholder="Search resources..."
                  />
                </div>

                <div className="flex items-center gap-2 border-l border-border/40 pl-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                  >
                    <Bell className="size-4" />
                  </Button>
                  <ModeToggle />
                </div>
              </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
              <div className="mx-auto max-w-7xl p-6 lg:p-10">{children}</div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
}
