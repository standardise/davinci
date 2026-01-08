"use client";

import { useState } from "react";
import {
  LayoutGrid,
  Database,
  BarChart3,
  CreditCard,
  Settings,
  Menu,
  X,
  Search,
  Bell,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import AuthGuard from "@/features/auth/components/auth-guard";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { name: "Applications", href: "/dashboard/applications", icon: LayoutGrid },
    { name: "Datasets", href: "/dashboard/datasets", icon: Database },
    { name: "Predictions", href: "/dashboard/predictions", icon: BarChart3 },
  ];

  const subItems = [
    { name: "Billing & Usage", href: "/dashboard/billing", icon: CreditCard },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        {/* Ambient Background Effects */}
        <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />

        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-border/40 backdrop-blur-xl sticky top-0 z-40 bg-background/60">
          <Link href="/" className="font-bold text-lg tracking-tight">
            Davinci.
          </Link>

          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <aside
            className={`
            fixed inset-y-0 left-0 z-50 
            flex flex-col
            border-r border-sidebar-border/50
            transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]
            
            w-full bg-sidebar/80 backdrop-blur-2xl
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}

            md:w-64 md:translate-x-0 md:static
          `}
          >
            <div className="p-4 md:p-8 md:pb-10 flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center gap-2 group"
                onClick={() => setIsSidebarOpen(false)}
              >
                <span className="text-xl md:text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                  Davinci.
                </span>
              </Link>

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-3 mb-4 mt-2">
                Workspace
              </p>
              {menuItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 md:py-2.5 rounded-lg text-sm font-medium transition-all group ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                  >
                    <item.icon
                      className={`w-4 h-4 ${
                        isActive
                          ? "text-primary"
                          : "opacity-70 group-hover:opacity-100"
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 space-y-1.5 mt-auto border-t border-sidebar-border/50 bg-gradient-to-t from-background/50 to-transparent">
              {subItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 md:py-2.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? "text-primary bg-primary/5"
                        : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}

              <div className="mt-4 p-3 rounded-xl border border-border/50 bg-card/40 hover:bg-card/60 transition-all cursor-pointer group flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                  <Link href={"/dashboard/account"}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary/30 to-purple-500/30 border border-border/20 flex items-center justify-center text-[10px] font-bold shrink-0">
                      JD
                    </div>
                    <div className="flex-1 overflow-hidden min-w-0">
                      <p className="text-[11px] font-bold truncate">
                        John Davinci
                      </p>
                      <p className="text-[9px] text-muted-foreground truncate italic font-mono">
                        Starter Tier
                      </p>
                    </div>
                  </Link>
                </div>
                <LogOut className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 flex flex-col min-h-screen w-full overflow-hidden relative bg-background">
            <header className="hidden md:flex h-16 border-b border-border/40 items-center justify-between px-8 bg-background/80 backdrop-blur-xl sticky top-0 z-30 transition-colors">
              <div className="flex items-center gap-2 text-xs font-medium">
                <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  Platform
                </span>
                <span className="text-muted-foreground/30">/</span>
                <span className="text-foreground">
                  {menuItems.find((i) => pathname.startsWith(i.href))?.name ||
                    "Dashboard"}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    className="bg-secondary/50 border border-transparent rounded-lg pl-9 pr-4 py-1.5 text-[11px] outline-none focus:bg-background focus:border-primary/20 focus:ring-4 focus:ring-primary/10 w-48 lg:w-64 transition-all placeholder:text-muted-foreground/50"
                    placeholder="Search..."
                  />
                </div>

                <div className="h-4 w-px bg-border/40" />

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground h-8 w-8 rounded-full"
                  >
                    <Bell className="w-4 h-4" />
                  </Button>
                  <ModeToggle />
                </div>
              </div>
            </header>

            <div className="flex-1 p-4 md:p-8 lg:p-10 w-full max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
