"use client";

import * as React from "react";
import {
  Command,
  LayoutDashboard,
  Database,
  BrainCircuit,
  CreditCard,
  Settings,
  LifeBuoy,
  Send,
  History,
} from "lucide-react";

import { NavProjects } from "@/features/dashboard/components/nav-projects";
import { NavSecondary } from "@/features/dashboard/components/nav-secondary";
import { NavUser } from "@/features/dashboard/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Data Structure
const data = {
  user: {
    name: "User",
    email: "user@davinci.ai",
    avatar: "/avatars/default.jpg",
  },
  projects: [
    {
      name: "Overview",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Datasets",
      url: "/dashboard/datasets",
      icon: Database,
    },
    {
      name: "Models",
      url: "/dashboard/models",
      icon: BrainCircuit,
    },
    {
      name: "Predictions",
      url: "/dashboard/predictions",
      icon: History,
    },
    {
      name: "Billing & Usage",
      url: "/dashboard/billing",
      icon: CreditCard,
    },
    {
      name: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold">Davinci</span>
                  <span className="truncate text-xs text-zinc-400">
                    by Standardise
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
