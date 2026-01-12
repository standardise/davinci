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
import { Loader2, RefreshCcw, Download, FileText, AlertCircle } from "lucide-react";
import { ListPredictions, DownloadPrediction } from "@/features/predictions/api";
import { PredictionLog } from "@/features/predictions/types";
import { formatDistanceToNow } from "date-fns";

interface PredictionHistoryListProps {
  projectId: string;
}

export function PredictionHistoryList({ projectId }: PredictionHistoryListProps) {
  const [predictions, setPredictions] = useState<PredictionLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPredictions = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await ListPredictions(projectId, { limit: 20 });
      setPredictions(Array.isArray(res.data) ? res.data : (res.data as any).data || []);
    } catch (error) {
      console.error("Failed to load history", error);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

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

  if (isLoading && predictions.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="ghost" size="sm" onClick={fetchPredictions} disabled={isLoading}>
            <RefreshCcw className={`w-3.5 h-3.5 mr-2 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>
      
      <div className="rounded-2xl border border-border/40 overflow-hidden bg-card/60 backdrop-blur-md shadow-sm">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-[180px]">ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Rows</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {predictions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  No prediction history found.
                </TableCell>
              </TableRow>
            ) : (
              predictions.map((p) => (
                <TableRow key={p.id} className="hover:bg-muted/20">
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {p.id.slice(0, 8)}...
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
  );
}
