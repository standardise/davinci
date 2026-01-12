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
  Loader2,
} from "lucide-react";
import { App } from "@/features/applications/types";
import { DeleteApp, ListApps } from "@/features/applications/api";
import { CreateProjectDialog } from "@/features/applications/components/create-project-dialog";
import { ApplicationStatusBadge } from "@/features/applications/components/application-status-badge";

export function TabularProjectList() {
  const [apps, setApps] = useState<App[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchApps = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await ListApps({ limit: 100 }); // List all for now, maybe pagination later
      // Handle different response structures if needed, but type says { data: App[], total... }
      const data = Array.isArray(res.data) ? res.data : (res.data as any).data || [];
      
      // Client-side search if API doesn't support it yet or for simplicity
      const filtered = search 
        ? data.filter(a => a.name.toLowerCase().includes(search.toLowerCase())) 
        : data;
        
      setApps(filtered);
    } catch (error) {
      console.error("Failed to fetch apps", error);
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-10 bg-background"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <CreateProjectDialog onSuccess={fetchApps} />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : apps.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-border rounded-3xl bg-muted/5">
          <BrainCircuit className="w-12 h-12 text-muted-foreground/20 mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground">
            No projects found
          </h3>
          <p className="text-sm text-muted-foreground/60 mb-6">
            {search ? "Try adjusting your search." : "Start your first analysis."}
          </p>
          {!search && <CreateProjectDialog onSuccess={fetchApps} />}
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
                      className="text-red-600 focus:text-red-600 cursor-pointer"
                      onClick={() => handleDelete(app.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Card Body: Info */}
              <Link
                href={`/dashboard/projects/${app.id}`}
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
                  <span className="font-mono ml-1 text-foreground bg-muted px-1 rounded max-w-[120px] truncate block">
                    {app.target}
                  </span>
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5 mr-2" />
                  Created: {new Date(app.created_at).toLocaleDateString()}
                </div>
              </div>

              {/* Card Footer: Tags & Action */}
              <div className="mt-6 pt-4 border-t border-border flex justify-between items-center">
                 <span
                  className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider bg-blue-500/10 text-blue-600`}
                >
                  TABULAR
                </span>

                <Button
                  variant="ghost"
                  size="sm"
                  className="group-hover:translate-x-1 transition-transform"
                  asChild
                >
                  <Link href={`/dashboard/projects/${app.id}`}>
                    View <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
