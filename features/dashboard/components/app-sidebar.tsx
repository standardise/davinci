"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  Command,
  LayoutDashboard,
  Database,
  Briefcase,
  TableProperties,
  LineChart,
  ScanEye,
  History,
  CreditCard,
  Settings,
  LogOut,
  UserCircle,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { UserNav } from "@/features/auth/components/user-nav";
import { useAuth } from "@/features/auth/context/auth-provider";

const data = {
  navigation: [
    { name: "Overview", url: "/dashboard", icon: LayoutDashboard },
    { name: "Datasets", url: "/dashboard/datasets", icon: Database },
    { name: "Prediction", url: "/dashboard/predictions", icon: History },
  ],
  services: [
    {
      name: "Tabular Analysis",
      url: "/dashboard/services/tabular",
      icon: TableProperties,
    },
    {
      name: "Time Series",
      url: "/dashboard/services/timeseries",
      icon: LineChart,
    },
    {
      name: "Vision AI",
      url: "/dashboard/services/vision",
      icon: ScanEye,
    },
  ],
  management: [
    { name: "Billing & Usage", url: "/dashboard/billing", icon: CreditCard },
    { name: "Settings", url: "/dashboard/settings", icon: Settings },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <Sidebar variant="inset" {...props} className="border-r-0">
      <SidebarHeader className="h-16 px-6 flex justify-center">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="hover:bg-transparent"
            >
              <a href="/dashboard" className="flex items-center gap-3">
                <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                  <Command className="size-5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-bold tracking-tight uppercase">
                    Davinci
                  </span>
                  <span className="truncate text-[10px] font-medium uppercase tracking-[0.2em] opacity-40">
                    Standardise
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-0 py-4 overflow-y-auto no-scrollbar">
        {/* Main Hub Section */}
        <SidebarGroup className="px-2 pb-6">
          <SidebarGroupLabel className="px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] opacity-40">
            Workspace
          </SidebarGroupLabel>
          <SidebarMenu>
            {data.navigation.map((item) => {
              const isActive = pathname === item.url;
              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "h-9 gap-3 rounded-md px-4",
                      isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground"
                    )}
                  >
                    <a href={item.url}>
                      <item.icon
                        className={cn(
                          "size-4",
                          isActive ? "text-primary" : "opacity-50"
                        )}
                      />
                      <span className="font-semibold">{item.name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* Specialized Engines Section */}
        <SidebarGroup className="px-2 pb-6">
          <SidebarGroupLabel className="px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] opacity-40">
            Services
          </SidebarGroupLabel>
          <SidebarMenu>
            {data.services.map((service) => {
              const isActive = pathname.startsWith(service.url);
              return (
                <SidebarMenuItem key={service.name}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "h-9 gap-3 rounded-md px-4",
                      isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground"
                    )}
                  >
                    <a href={service.url}>
                      <service.icon
                        className={cn(
                          "size-4",
                          isActive ? "text-primary" : "opacity-50"
                        )}
                      />
                      <span className="font-semibold">{service.name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        <div className="mx-6 my-2 h-px bg-border opacity-50" />

        {/* System Management */}
        <SidebarGroup className="px-2 pt-4">
          <SidebarGroupLabel className="px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] opacity-40">
            System
          </SidebarGroupLabel>
          <SidebarMenu>
            {data.management.map((item) => {
              const isActive = pathname.startsWith(item.url);
              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "h-9 gap-3 rounded-md px-4",
                      isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground"
                    )}
                  >
                    <a href={item.url}>
                      <item.icon
                        className={cn(
                          "size-4",
                          isActive ? "text-primary" : "opacity-50"
                        )}
                      />
                      <span className="font-semibold">{item.name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 bg-transparent">
        {user && (
          <UserNav side="right" align="end">
            <SidebarMenuButton
              size="lg"
              className="w-full justify-start gap-3 rounded-xl px-2 hover:bg-accent transition-colors"
            >
              <Avatar className="size-8 rounded-lg border border-border">
                <AvatarImage src={user.avatar_url} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-primary text-[10px] font-bold text-primary-foreground">
                  {user.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col overflow-hidden text-left">
                <span className="truncate text-sm font-semibold">
                  {user.name}
                </span>
                <span className="truncate text-xs opacity-50">
                  {user.email}
                </span>
              </div>
            </SidebarMenuButton>
          </UserNav>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
