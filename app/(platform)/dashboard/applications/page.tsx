"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  BrainCircuit,
  MoreVertical,
  Trash2,
  Calendar,
  Target,
  ArrowRight,
  Clock,
} from "lucide-react";
import { App } from "@/features/applications/types";
import { DeleteApp, ListApps } from "@/features/applications/api";
import AuthGuard from "@/features/auth/components/auth-guard";
import { CreateProjectDialog } from "@/features/applications/components/create-project-dialog";
import { ApplicationStatusBadge } from "@/features/applications/components/application-status-badge";

export default function ProjectsPage() {
  const [apps, setApps] = useState<App[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchApps = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await ListApps({ search });
      setApps(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch apps", error);
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to archive this project?")) return;
    try {
      await DeleteApp(id);
      fetchApps();
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to delete project"
      );
    }
  };

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background pb-12">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
              <p className="text-muted-foreground mt-1">
                Build, train, and deploy your machine learning models.
              </p>
            </div>
            <CreateProjectDialog onSuccess={fetchApps} />
          </div>

          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              className="pl-10 max-w-md bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchApps()}
            />
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-64 bg-muted/50 rounded-3xl animate-pulse"
                />
              ))}
            </div>
          ) : apps.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border rounded-3xl bg-muted/5">
              <BrainCircuit className="w-16 h-16 text-muted-foreground/20 mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground">
                No projects yet
              </h3>
              <p className="text-sm text-muted-foreground/60 mb-6">
                Create your first ML project to get started.
              </p>
              <CreateProjectDialog onSuccess={fetchApps} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {apps.map((app) => (
                <div
                  key={app.id}
                  className="group relative flex flex-col p-6 rounded-3xl border border-border bg-card hover:shadow-xl hover:border-primary/20 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <ApplicationStatusBadge status={app.status} />

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => handleDelete(app.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Archive
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Card Body: Info */}
                  <Link
                    href={`/dashboard/applications/${app.id}`}
                    className="block group-hover:text-primary transition-colors"
                  >
                    <h3 className="text-xl font-bold mb-2 line-clamp-1">
                      {app.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-6 h-10">
                    {app.description || "No description provided."}
                  </p>

                  {/* Metadata */}
                  <div className="mt-auto space-y-3">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Target className="w-3.5 h-3.5 mr-2" />
                      Target:{" "}
                      <span className="font-mono ml-1 text-foreground bg-muted px-1 rounded">
                        {app.target_column}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5 mr-2" />
                      Created: {new Date(app.created_at).toLocaleDateString()}
                    </div>
                    {/* ถ้าเป็น TimeSeries โชว์ความถี่ */}
                    {app.problem_type === "TIME_SERIES" &&
                      app.time_series_config && (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="w-3.5 h-3.5 mr-2" />
                          Freq:{" "}
                          <span className="font-mono ml-1">
                            {app.time_series_config.frequency}
                          </span>
                        </div>
                      )}
                  </div>

                  {/* Card Footer: Tags & Action */}
                  <div className="mt-6 pt-4 border-t border-border flex justify-between items-center">
                    <span
                      className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                        app.problem_type === "TIME_SERIES"
                          ? "bg-purple-500/10 text-purple-600"
                          : "bg-blue-500/10 text-blue-600"
                      }`}
                    >
                      {app.problem_type?.replace("_", " ") || "REGRESSION"}
                    </span>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="group-hover:translate-x-1 transition-transform"
                      asChild
                    >
                      <Link href={`/dashboard/applications/${app.id}`}>
                        View <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
