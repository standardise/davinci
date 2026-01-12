"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Database,
  LayoutGrid,
  Plus,
  Zap,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { useAuth } from "@/features/auth/context/auth-provider";
import { ListApps } from "@/features/applications/api";
import { ListDatasets } from "@/features/datasets/api";
import { App } from "@/features/applications/types";
import { Dataset } from "@/features/datasets/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { StatsCard } from "@/features/dashboard/components/stats-card";
import { EmptyState } from "@/features/dashboard/components/empty-state";
import { DashboardSkeleton } from "@/features/dashboard/components/dashboard-skeleton";

export default function DashboardPage() {
  const { user } = useAuth();
  const [recentApps, setRecentApps] = useState<App[]>([]);
  const [recentDatasets, setRecentDatasets] = useState<Dataset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ apps: 0, datasets: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, datasetsRes] = await Promise.all([
          ListApps({ limit: 5 }),
          ListDatasets({ limit: 5 }),
        ]);

        const appsData = Array.isArray(appsRes.data)
          ? appsRes.data
          : appsRes.data.data;
        const datasetsData = Array.isArray(datasetsRes.data)
          ? datasetsRes.data
          : datasetsRes.data.data;

        setRecentApps(appsData || []);
        setRecentDatasets(datasetsData || []);
        setStats({
          apps: appsRes.data.total || appsData?.length || 0,
          datasets: datasetsRes.data.total || datasetsData?.length || 0,
        });
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.name?.split(" ")[0] || "Creator"}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here is what is happening with your projects today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/dashboard/datasets">
              <Plus className="w-4 h-4 mr-2" /> New Dataset
            </Link>
          </Button>
          <Button asChild className="rounded-xl">
            <Link href="/dashboard/projects">
              <Plus className="w-4 h-4 mr-2" /> New Project
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Projects"
          value={stats.apps}
          icon={LayoutGrid}
          description="Active machine learning apps"
          href="/dashboard/projects"
        />
        <StatsCard
          title="Total Datasets"
          value={stats.datasets}
          icon={Database}
          description="Uploaded data sources"
          href="/dashboard/datasets"
        />
        <StatsCard
          title="System Status"
          value="Operational"
          icon={Activity}
          description="All systems normal"
          href="#"
          valueClassName="text-emerald-500 text-2xl"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Projects */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">
              Recent Projects
            </h2>
            <Button variant="link" asChild className="text-primary">
              <Link href="/dashboard/projects">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>

          {recentApps.length > 0 ? (
            <div className="grid gap-4">
              {recentApps.map((app) => (
                <Link
                  key={app.id}
                  href={`/dashboard/projects/${app.id}`}
                  className="group block"
                >
                  <Card className="hover:shadow-md transition-all duration-300 border-border/60 bg-card/50 hover:bg-card">
                    <CardContent className="p-5 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                          <Zap className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold group-hover:text-primary transition-colors">
                            {app.name}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {app.description || "No description"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right hidden sm:block">
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">
                          {app.status}
                        </span>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(app.created_at), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No projects yet"
              description="Create your first ML project to get started."
              href="/dashboard/projects"
              actionText="Create Project"
            />
          )}
        </div>

        {/* Recent Datasets */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">
              Recent Datasets
            </h2>
            <Button variant="link" asChild className="text-primary">
              <Link href="/dashboard/datasets">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>

          {recentDatasets.length > 0 ? (
            <div className="grid gap-4">
              {recentDatasets.map((dataset) => (
                <Link
                  key={dataset.id}
                  href={`/dashboard/datasets/${dataset.id}`}
                  className="group block"
                >
                  <Card className="hover:shadow-md transition-all duration-300 border-border/60 bg-card/50 hover:bg-card">
                    <CardContent className="p-5 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                          <Database className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold group-hover:text-primary transition-colors">
                            {dataset.name}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {dataset.row_count.toLocaleString()} rows
                          </p>
                        </div>
                      </div>
                      <div className="text-right hidden sm:block">
                        <p className="text-[10px] text-muted-foreground">
                          Uploaded{" "}
                          {formatDistanceToNow(new Date(dataset.created_at), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No datasets yet"
              description="Upload your data to start building models."
              href="/dashboard/datasets"
              actionText="Upload Data"
            />
          )}
        </div>
      </div>
    </div>
  );
}