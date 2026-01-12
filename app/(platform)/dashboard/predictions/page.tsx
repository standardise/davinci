"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  RefreshCcw,
  Download,
  FileText,
  AlertCircle,
  Search,
  History,
  LayoutGrid,
} from "lucide-react";
import { ListGlobalPredictions, DownloadPrediction } from "@/features/predictions/api";
import { PredictionLog } from "@/features/predictions/types";
import { formatDistanceToNow } from "date-fns";
import AuthGuard from "@/features/auth/components/auth-guard";

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState<PredictionLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const fetchPredictions = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await ListGlobalPredictions({ page, limit });
      // @ts-ignore: Handle potential data structure difference
      setPredictions(Array.isArray(res.data) ? res.data : (res.data as any).data || []);
    } catch (error) {
      console.error("Failed to load predictions", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchPredictions();
    const interval = setInterval(fetchPredictions, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, [fetchPredictions]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return "bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-200";
      case "FAILED":
        return "bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-200";
      case "PROCESSING":
        return "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-200";
      default:
        return "bg-gray-500/10 text-gray-600 hover:bg-gray-500/20 border-gray-200";
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background pb-12">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Predictions</h1>
              <p className="text-muted-foreground mt-1">
                Global history of all your model predictions across projects.
              </p>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={fetchPredictions} disabled={isLoading}>
                    <RefreshCcw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
                </Button>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-[180px]">ID</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rows</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && predictions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-64 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : predictions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <History className="w-12 h-12 mb-4 opacity-20" />
                            <p className="text-lg font-semibold">No predictions found</p>
                            <p className="text-sm opacity-60">Run a prediction from a project to see it here.</p>
                        </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  predictions.map((p) => (
                    <TableRow key={p.id} className="hover:bg-muted/20 transition-colors">
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        <span className="bg-muted px-1.5 py-0.5 rounded">{p.id.slice(0, 8)}</span>
                      </TableCell>
                      <TableCell>
                        <Link 
                            href={`/dashboard/projects/${p.project_id}`}
                            className="font-medium hover:underline hover:text-primary transition-colors flex items-center gap-2"
                        >
                            <LayoutGrid className="w-3.5 h-3.5 text-muted-foreground" />
                            {p.project_name || "Unknown Project"}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`font-normal ${getStatusColor(p.status)}`}>
                            {p.status === 'PROCESSING' && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
                            {p.status}
                        </Badge>
                        {p.status === 'FAILED' && p.error_msg && (
                            <div className="flex items-center mt-1 text-[10px] text-red-500 max-w-[200px] truncate" title={p.error_msg}>
                                <AlertCircle className="w-3 h-3 mr-1 inline" /> {p.error_msg}
                            </div>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {p.row_count > 0 ? p.row_count.toLocaleString() : "-"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(p.created_at), { addSuffix: true })}
                      </TableCell>
                      <TableCell className="text-right flex items-center justify-end gap-2">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            asChild
                            className="h-8 w-8 p-0"
                        >
                            <Link href={`/dashboard/predictions/${p.id}`}>
                                <FileText className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                            </Link>
                        </Button>
                        {p.status === "SUCCESS" && p.output_url && (
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 rounded-lg gap-2" 
                                onClick={async () => {
                                    try {
                                        const response = await DownloadPrediction(p.project_id, p.id);
                                        const url = window.URL.createObjectURL(new Blob([response.data]));
                                        const link = document.createElement("a");
                                        link.href = url;
                                        const ext = p.output_format === "CSV" ? ".csv" : p.output_format === "JSON" ? ".json" : ".parquet";
                                        link.setAttribute("download", `prediction_${p.id}${ext}`); 
                                        document.body.appendChild(link);
                                        link.click();
                                        link.remove();
                                    } catch (err) {
                                        console.error("Download failed", err);
                                        alert("Failed to download file");
                                    }
                                }}
                            >
                                <Download className="w-3.5 h-3.5" /> Result
                            </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}