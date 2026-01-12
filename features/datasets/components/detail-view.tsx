"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Dataset } from "@/features/datasets/types";
import { formatBytes } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // ถ้ายังไม่มี ใช้ div style แทนได้
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Database,
  HardDrive,
  Calendar,
  Table as TableIcon,
  FileJson,
  MoreHorizontal,
  Trash2,
  Loader2,
  Download,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteDataset, GetDataset } from "../api";
import AuthGuard from "@/features/auth/components/auth-guard";

interface Props {
  id: string;
}

export default function DatasetDetailView({ id }: Props) {
  const router = useRouter();
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Dataset
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await GetDataset(id);
        setDataset(data);
      } catch (err) {
        setError("Failed to load dataset details.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this dataset? This action cannot be undone."
      )
    )
      return;
    try {
      await DeleteDataset(id);
      router.push("/dashboard/datasets");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete dataset.");
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <AuthGuard>
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AuthGuard>
    );
  }

  // Error State
  if (error || !dataset) {
    return (
      <AuthGuard>
        <div className="flex flex-col h-screen items-center justify-center gap-4">
          <h2 className="text-xl font-bold text-red-500">Error</h2>
          <p className="text-muted-foreground">
            {error || "Dataset not found"}
          </p>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/datasets")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Datasets
          </Button>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background pb-12">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="mb-6">
            <Link
              href="/dashboard/datasets"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Datasets
            </Link>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <TableIcon className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">
                  {dataset.name}
                </h1>
                <Badge
                  variant="outline"
                  className="text-xs font-normal bg-muted/50"
                >
                  {dataset.columns?.length || 0} columns
                </Badge>
              </div>
              <p className="text-muted-foreground max-w-2xl">
                {dataset.description || "No description provided."}
              </p>
            </div>

            <div className="flex gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-10 w-10 p-0 border border-border"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                    onClick={handleDelete}
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Delete Dataset
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <StatsCard
              icon={Database}
              label="Row Count"
              value={dataset.row_count.toLocaleString()}
            />
            <StatsCard
              icon={HardDrive}
              label="File Size"
              value={formatBytes(dataset.file_size)}
            />
            <StatsCard
              icon={Calendar}
              label="Created At"
              value={new Date(dataset.created_at).toLocaleDateString()}
            />
          </div>

          <Tabs defaultValue="schema" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="schema" className="gap-2">
                  <FileJson className="w-4 h-4" /> Schema & Metadata
                </TabsTrigger>
                <TabsTrigger value="preview" className="gap-2" disabled>
                  <TableIcon className="w-4 h-4" /> Data Preview (Coming Soon)
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab: Schema */}
            <TabsContent
              value="schema"
              className="animate-in fade-in slide-in-from-bottom-2"
            >
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
                  {dataset.columns?.map((col, idx) => (
                    <div
                      key={idx}
                      className="p-4 flex flex-col gap-2 hover:bg-muted/20"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium font-mono text-sm">
                          {col.name}
                        </div>
                        <Badge
                          variant="secondary"
                          className="text-xs font-normal uppercase"
                        >
                          {col.data_type}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground grid grid-cols-2 gap-2 mt-1">
                        <div>Missing: {col.stats?.missing_count ?? "-"}</div>
                        <div>Unique: {col.stats?.unique_count ?? "-"}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AuthGuard>
  );
}

function StatsCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="p-5 rounded-2xl border border-border/40 bg-card/50 backdrop-blur-md shadow-sm flex items-center gap-5 transition-all hover:shadow-md">
      <div className="p-3.5 rounded-2xl bg-background/80 shadow-sm text-primary">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
      </div>
    </div>
  );
}
