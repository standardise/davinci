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
                  {dataset.schema.length} columns
                </Badge>
              </div>
              <p className="text-muted-foreground max-w-2xl">
                {dataset.description || "No description provided."}
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => window.open(dataset.url, "_blank")}
              >
                <Download className="w-4 h-4 mr-2" /> Download
              </Button>

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

          <Tabs defaultValue="preview" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="preview" className="gap-2">
                  <TableIcon className="w-4 h-4" /> Data Preview
                </TabsTrigger>
                <TabsTrigger value="schema" className="gap-2">
                  <FileJson className="w-4 h-4" /> Schema & Metadata
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent
              value="preview"
              className="space-y-4 animate-in fade-in slide-in-from-bottom-2"
            >
              <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                      <tr>
                        {dataset.schema.map((col) => (
                          <th
                            key={col.name}
                            className="px-6 py-4 font-medium whitespace-nowrap"
                          >
                            <div className="flex flex-col gap-1">
                              <span>{col.name}</span>
                              <span className="text-[10px] normal-case opacity-50">
                                {col.type}
                              </span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {dataset.preview && dataset.preview.length > 0 ? (
                        dataset.preview.map((row, idx) => (
                          <tr
                            key={idx}
                            className="border-b border-border hover:bg-muted/20 transition-colors last:border-0"
                          >
                            {dataset.schema.map((col) => (
                              <td
                                key={`${idx}-${col.name}`}
                                className="px-6 py-4 whitespace-nowrap text-foreground/80"
                              >
                                {String(row[col.name] ?? "-")}
                              </td>
                            ))}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={dataset.schema.length}
                            className="px-6 py-12 text-center text-muted-foreground"
                          >
                            No preview data available.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Footer Note */}
                <div className="px-6 py-3 bg-muted/20 border-t border-border text-xs text-muted-foreground">
                  Showing first {dataset.preview?.length || 0} rows of{" "}
                  {dataset.row_count.toLocaleString()}.
                </div>
              </div>
            </TabsContent>

            {/* Tab: Schema */}
            <TabsContent
              value="schema"
              className="animate-in fade-in slide-in-from-bottom-2"
            >
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
                  {dataset.schema.map((col, idx) => (
                    <div
                      key={idx}
                      className="p-4 flex items-center justify-between hover:bg-muted/20"
                    >
                      <div className="font-medium font-mono text-sm">
                        {col.name}
                      </div>
                      <Badge
                        variant="secondary"
                        className="text-xs font-normal"
                      >
                        {col.type}
                      </Badge>
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
    <div className="p-4 rounded-xl border border-border bg-card flex items-center gap-4">
      <div className="p-3 rounded-lg bg-muted text-muted-foreground">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-xl font-bold tracking-tight">{value}</p>
      </div>
    </div>
  );
}
