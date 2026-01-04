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

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { name: "Applications", href: "/projects", icon: LayoutGrid },
    { name: "Datasets", href: "/datasets", icon: Database },
    { name: "Predictions", href: "/predictions", icon: BarChart3 },
  ];

  const subItems = [
    { name: "Billing & Usage", href: "/billing", icon: CreditCard },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="fixed top-0 left-0 w-125 h-125 bg-blue-500/5 dark:bg-blue-600/3 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-125 h-125 bg-indigo-500/5 dark:bg-indigo-600/3 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5 backdrop-blur-md sticky top-0 z-40 bg-background/50">
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
        <aside
          className={`
            fixed inset-y-0 left-0 z-50 
            flex flex-col
            border-r border-white/10 dark:border-white/3 
            transition-transform duration-300 ease-in-out
            
            w-full bg-background/95 backdrop-blur-2xl
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}

            md:w-64 md:translate-x-0 md:static md:bg-card/20 md:backdrop-blur-xl
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
                  className={`flex items-center gap-3 px-4 py-3 md:py-3 rounded-2xl text-sm font-medium transition-all group ${
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent"
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

          <div className="p-4 space-y-1.5 mt-auto border-t border-white/5 bg-linear-to-t from-background/50 to-transparent">
            {subItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 md:py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "text-primary bg-primary/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}

            <div className="mt-4 p-3 rounded-2xl border border-white/5 bg-white/2 hover:bg-white/5 transition-all cursor-pointer group flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-linear-to-tr from-blue-500/30 to-indigo-500/30 border border-white/10 flex items-center justify-center text-[10px] font-bold shrink-0">
                  JD
                </div>
                <div className="flex-1 overflow-hidden min-w-0">
                  <p className="text-[11px] font-bold truncate">John Davinci</p>
                  <p className="text-[9px] text-muted-foreground truncate italic font-mono">
                    Starter Tier
                  </p>
                </div>
              </div>
              <LogOut className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col min-h-screen w-full overflow-hidden relative">
          <header className="hidden md:flex h-16 border-b border-white/5 items-center justify-between px-8 bg-background/50 backdrop-blur-md sticky top-0 z-30 transition-colors">
            <div className="flex items-center gap-2 text-xs font-medium">
              <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                Platform
              </span>
              <span className="text-muted-foreground/30">/</span>
              <span className="text-foreground italic">
                {menuItems.find((i) => pathname.startsWith(i.href))?.name ||
                  "Dashboard"}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  className="bg-muted/30 border border-border/40 rounded-full pl-9 pr-4 py-1.5 text-[11px] outline-none focus:border-primary/50 w-48 lg:w-64 transition-all focus:bg-background/80 placeholder:text-muted-foreground/50"
                  placeholder="Type to search..."
                />
              </div>

              <div className="h-4 w-px bg-white/10" />

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
  );
}
