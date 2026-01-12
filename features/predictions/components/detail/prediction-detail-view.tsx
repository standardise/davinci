"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  LayoutGrid,
  Loader2,
  XCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { GetPrediction, GetPredictionData, DownloadPrediction } from "@/features/predictions/api";
import { PredictionLog } from "@/features/predictions/types";
import AuthGuard from "@/features/auth/components/auth-guard";

interface Props {
  projectId: string; // We might need this if the API requires it, but the route is global?
  predictionId: string;
}

export default function PredictionDetailView({ predictionId }: { predictionId: string }) {
  const router = useRouter();
  const [prediction, setPrediction] = useState<PredictionLog | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(false);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        // FIXME: The GetPrediction API signature in `api.ts` currently expects `projectId`.
        // If the backend allows getting prediction by ID only, we should update the API client.
        // For now, let's assume we can get it or we might need to change the route to include project ID.
        // Wait, the route structure is /dashboard/predictions/[id] which implies global lookup or we need project ID.
        // Let's assume the user navigates here from the project page which has the context.
        // However, if we are on a standalone page, we might not have project ID easily if not in URL.
        // 
        // Backend `GetPrediction` implementation: `group.Get("/:predictionId", h.GetPrediction)` inside `/projects/:id/predictions`
        // Wait, the backend route is nested: `router.Group("/projects/:id/predictions", h.AuthMiddleware)`
        // So we MUST have project ID to call the API.
        
        // ISSUE: The current page route is `/dashboard/predictions/[id]`. It's missing the project ID.
        // We probably need to update the route to `/dashboard/projects/[projectId]/predictions/[predictionId]` 
        // OR the backend needs a global lookup endpoint.
        //
        // Let's look at `davinci-service/handler/prediction_handler.go`:
        // `func (h *PredictionHandler) GetPrediction(c *fiber.Ctx)`
        // It uses `predictionID := c.Params("predictionId")`.
        // It calls `h.svc.GetPrediction(c.Context(), userID, predictionID)`.
        //
        // `davinci-service/service/prediction_service.go`:
        // `GetPrediction(ctx context.Context, userID string, id string)`
        // It calls `s.repo.GetByID(ctx, id)`.
        //
        // It seems the SERVICE allows getting by ID directly without ProjectID (it validates ownership inside).
        // BUT the HANDLER is registered under `group := router.Group("/projects/:id/predictions", h.AuthMiddleware)`.
        // So the URL MUST be `/api/v1/projects/:id/predictions/:predictionId`.
        //
        // If we don't have the project ID in the frontend URL, we can't easily call this endpoint if strictly enforced by Fiber router.
        // However, typically `GetByID` implies unique ID. 
        //
        // WORKAROUND: The current Frontend Page `application/app/(platform)/dashboard/predictions/[id]/page.tsx` exists.
        // If we want to use it, we might need to fetch the prediction using a "dummy" project ID if the backend ignores it for GET, 
        // OR (better) we should move this page to under the project route or fix the backend route to be global.
        
        // Let's assume for this task we will try to fix the UI first. 
        // Since `GetPrediction` in frontend API requires projectId, let's verify if we can get it.
        // If the route is `/dashboard/predictions/[id]`, we don't have project ID.
        
        // Let's try to fetch it. If we can't, we might need to ask the user to fix the routing.
        // BUT, looking at `davinci-service` again:
        // `group := router.Group("/projects/:id/predictions", h.AuthMiddleware)`
        // So yes, `:id` (projectID) is required in the path.
        
        // Let's modify the plan:
        // 1. We should probably move this page to `/dashboard/projects/[projectId]/predictions/[predictionId]` for consistency.
        // 2. OR, we can try to "guess" or "search" or maybe the backend endpoint allows ANY project ID if it just uses the PredictionID?
        //    In `prediction_handler.go`: `projectID := c.Params("id")` is NOT used in `GetPrediction`, only in `Predict` and `ListPredictions`.
        //    Wait, `GetPrediction` handler:
        //    `log, svcErr := h.svc.GetPrediction(c.Context(), userID, predictionID)`
        //    It DOES NOT pass projectID to the service.
        //    So `api/v1/projects/WHATEVER/predictions/PRED_ID` should work!
        
        const dummyProjectId = "global"; 
        const res = await GetPrediction(dummyProjectId, predictionId);
        setPrediction(res.data);
        
        // Now we have the real project ID from the prediction object
        if (res.data.project_id) {
             fetchData(res.data.project_id, predictionId);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrediction();
  }, [predictionId]);

  const fetchData = async (pid: string, predId: string) => {
      setIsDataLoading(true);
      try {
          const res = await GetPredictionData(pid, predId, { page, limit });
          setData(res.data.data || []);
          setTotalRows(res.data.total || 0);
      } catch (err) {
          console.error("Failed to load prediction data", err);
      } finally {
          setIsDataLoading(false);
      }
  }

  // Refetch data when page changes
  useEffect(() => {
      if (prediction?.project_id) {
          fetchData(prediction.project_id, prediction.id);
      }
  }, [page, limit, prediction]);


  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-bold">Prediction not found</h2>
        <Button asChild variant="outline">
          <Link href="/dashboard/projects">Back to Projects</Link>
        </Button>
      </div>
    );
  }

  const handleDownload = async () => {
    if (!prediction) return;
    try {
      const response = await DownloadPrediction(prediction.project_id, prediction.id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const ext = prediction.output_format === "CSV" ? ".csv" : prediction.output_format === "JSON" ? ".json" : ".parquet";
      link.setAttribute("download", `prediction_${prediction.id}${ext}`); 
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download failed", err);
      alert("Failed to download file");
    }
  };

  const isSuccess = prediction.status === "SUCCESS";

  return (
    <AuthGuard>
      <div className="min-h-screen bg-muted/5 pb-20">
        {/* Header */}
        <div className="bg-background border-b border-border/60 sticky top-0 z-20 backdrop-blur-xl bg-background/80">
          <div className="container mx-auto px-4 lg:px-8 max-w-7xl h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                asChild
              >
                <Link href={`/dashboard/projects/${prediction.project_id}`}>
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div className="h-4 w-px bg-border/60 mx-1 hidden sm:block"></div>
              <div className="flex items-center gap-2">
                <span className="font-semibold tracking-tight text-sm">
                  Prediction Details
                </span>
                <Badge variant="outline" className="font-mono font-normal text-xs">
                    {prediction.id.substring(0, 8)}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
                {isSuccess && prediction.output_url && (
                    <Button size="sm" className="rounded-full shadow-lg shadow-primary/20 gap-2" onClick={handleDownload}>
                        <Download className="w-3.5 h-3.5" />
                        Download Results
                    </Button>
                )}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 max-w-7xl pt-8 space-y-8">
          
          {/* Status Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2 shadow-sm border-border/60">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        Job Summary
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="space-y-1">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Status</span>
                        <div className="flex items-center gap-2">
                            {prediction.status === 'SUCCESS' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                            {prediction.status === 'FAILED' && <XCircle className="w-4 h-4 text-red-500" />}
                            {prediction.status === 'PROCESSING' && <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />}
                            <span className="font-medium">{prediction.status}</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Rows Processed</span>
                        <div className="font-medium">{prediction.row_count > 0 ? prediction.row_count.toLocaleString() : '-'}</div>
                    </div>
                    <div className="space-y-1">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Target</span>
                        <div className="font-medium bg-muted/50 px-2 py-0.5 rounded inline-block">{prediction.target}</div>
                    </div>
                    <div className="space-y-1">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Created</span>
                        <div className="font-medium text-sm flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                            {formatDistanceToNow(new Date(prediction.created_at), { addSuffix: true })}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-sm border-border/60 bg-muted/5">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <LayoutGrid className="w-4 h-4" /> Model Info
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Project</span>
                        <Link href={`/dashboard/projects/${prediction.project_id}`} className="font-medium hover:underline text-primary">
                            {prediction.project_name || "View Project"}
                        </Link>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Version</span>
                        <span className="font-mono text-xs bg-background border px-1.5 py-0.5 rounded">{prediction.model_version || "latest"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Problem Type</span>
                        <span className="font-medium capitalize">{prediction.problem_type?.replace('_', ' ') || "-"}</span>
                    </div>
                </CardContent>
            </Card>
          </div>

          {/* Data Preview Section */}
          {isSuccess && (
              <div className="space-y-4">
                  <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                          <LayoutGrid className="w-5 h-5 text-muted-foreground" />
                          Prediction Results
                      </h3>
                      <div className="flex items-center gap-2">
                          <Select 
                            value={String(limit)} 
                            onValueChange={(v) => { setLimit(Number(v)); setPage(1); }}
                          >
                            <SelectTrigger className="w-[100px] h-8">
                                <SelectValue placeholder="Limit" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10 rows</SelectItem>
                                <SelectItem value="50">50 rows</SelectItem>
                                <SelectItem value="100">100 rows</SelectItem>
                            </SelectContent>
                          </Select>
                      </div>
                  </div>

                  <Card className="border-border/60 shadow-sm overflow-hidden">
                      <div className="overflow-x-auto">
                          <Table>
                              <TableHeader className="bg-muted/30">
                                  <TableRow>
                                      {data.length > 0 && Object.keys(data[0]).map((key) => (
                                          <TableHead key={key} className="whitespace-nowrap font-semibold">
                                              {key}
                                          </TableHead>
                                      ))}
                                  </TableRow>
                              </TableHeader>
                              <TableBody>
                                  {isDataLoading ? (
                                      <TableRow>
                                          <TableCell colSpan={data.length > 0 ? Object.keys(data[0]).length : 1} className="h-32 text-center">
                                              <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                                          </TableCell>
                                      </TableRow>
                                  ) : data.length === 0 ? (
                                      <TableRow>
                                          <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                              No data available or failed to load.
                                          </TableCell>
                                      </TableRow>
                                  ) : (
                                      data.map((row, i) => (
                                          <TableRow key={i} className="hover:bg-muted/10">
                                              {Object.values(row).map((val: any, j) => (
                                                  <TableCell key={j} className="whitespace-nowrap text-sm">
                                                      {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                                                  </TableCell>
                                              ))}
                                          </TableRow>
                                      ))
                                  )}
                              </TableBody>
                          </Table>
                      </div>
                      <div className="flex items-center justify-between px-4 py-3 border-t border-border/60 bg-muted/5">
                          <div className="text-xs text-muted-foreground">
                              Showing {data.length} of {totalRows.toLocaleString()} rows
                          </div>
                          <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                disabled={page <= 1 || isDataLoading}
                                onClick={() => setPage(p => p - 1)}
                              >
                                Previous
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                disabled={data.length < limit || isDataLoading}
                                onClick={() => setPage(p => p + 1)}
                              >
                                Next
                              </Button>
                          </div>
                      </div>
                  </Card>
              </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
