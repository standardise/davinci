"use client";

import { useEffect, useState, useCallback } from "react";
import { Dataset } from "@/features/datasets/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Database,
  Calendar,
  HardDrive,
  Table as TableIcon,
  Trash2,
  MoreVertical,
} from "lucide-react";
import { formatBytes } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { DeleteDataset, ListDatasets } from "@/features/datasets/api";
import AuthGuard from "@/features/auth/components/auth-guard";
import { UploadDatasetDialog } from "@/features/datasets/components/upload-dialog";

export default function DatasetPage() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchDatasets = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await ListDatasets({ search: searchTerm });
      setDatasets(
        Array.isArray(response.data) ? response.data : response.data.data || []
      );
    } catch (error) {
      console.error("Failed to fetch datasets", error);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this dataset?")) return;
    try {
      await DeleteDataset(id);
      fetchDatasets();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete dataset");
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, [fetchDatasets]);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background pb-12">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Datasets</h1>
              <p className="text-muted-foreground mt-1">
                Manage and explore your data sources.
              </p>
            </div>
            <UploadDatasetDialog onSuccess={fetchDatasets} />
          </div>

          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search datasets..."
              className="pl-10 max-w-md bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchDatasets()}
            />
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-48 rounded-xl bg-muted/50 animate-pulse"
                />
              ))}
            </div>
          ) : datasets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 border border-dashed border-border rounded-3xl bg-muted/5">
              <div className="p-4 rounded-full bg-muted/30 mb-4">
                <Database className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                No datasets found
              </h3>
              <p className="text-sm text-muted-foreground/60 mb-6 max-w-sm text-center">
                Upload your structured data (CSV, Parquet) to start building models.
              </p>
              <UploadDatasetDialog onSuccess={fetchDatasets} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {datasets.map((dataset) => (
                <div
                  key={dataset.id}
                  className="group relative flex flex-col p-6 rounded-3xl border border-border bg-card hover:shadow-xl hover:border-primary/20 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4 relative z-10">
                    <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                      <TableIcon className="w-6 h-6" />
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-muted"
                        >
                          <MoreVertical className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/datasets/${dataset.id}`}>
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600 focus:bg-red-100 dark:focus:bg-red-900/20"
                          onClick={() => handleDelete(dataset.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <h3
                    className="text-lg font-bold mb-2 line-clamp-1"
                    title={dataset.name}
                  >
                    {dataset.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-6 h-10">
                    {dataset.description || "No description provided."}
                  </p>

                  <div className="mt-auto pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground font-medium">
                    <div
                      className="flex items-center gap-1.5"
                      title="Row Count"
                    >
                      <Database className="w-3.5 h-3.5" />
                      {dataset.row_count.toLocaleString()} rows
                    </div>
                    <div
                      className="flex items-center gap-1.5"
                      title="File Size"
                    >
                      <HardDrive className="w-3.5 h-3.5" />
                      {formatBytes(dataset.file_size)}
                    </div>
                    <div
                      className="flex items-center gap-1.5"
                      title="Created At"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(dataset.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <Link
                    href={`/dashboard/datasets/${dataset.id}`}
                    className="absolute inset-0 z-0 rounded-3xl ring-primary focus:ring-2 opacity-0"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
