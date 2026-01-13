"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import AuthGuard from "@/features/auth/components/auth-guard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import {
  ArrowLeft,
  Download,
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
  LayoutGrid,
  FileText,
} from "lucide-react";

import {
  GetPrediction,
  GetPredictionData,
  DownloadPrediction,
} from "@/features/predictions/api";
import { PredictionLog } from "@/features/predictions/types";
import { ClassificationPreview } from "../visualization/classification-preview";
import { RegressionPreview } from "../visualization/regression-preview";

export default function PredictionDetailView({
  predictionId,
}: {
  predictionId: string;
}) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [prediction, setPrediction] = useState<PredictionLog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  // Helper to format chart data
  const getChartData = () => {
    if (!prediction?.metadata?.distribution) return [];

    // Check if regression stats
    if ("min" in prediction.metadata.distribution) {
      const d = prediction.metadata.distribution;
      return [
        { name: "Min", value: d.min },
        { name: "P25", value: d.p25 },
        { name: "Median", value: d.p50 },
        { name: "Mean", value: d.mean },
        { name: "P75", value: d.p75 },
        { name: "Max", value: d.max },
      ];
    }

    // Assume Classification (dict of class -> prob)
    return Object.entries(prediction.metadata.distribution)
      .map(([name, value]) => ({ name, value: Number(value) }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Top 10 classes
  };

  const chartData = getChartData();

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const dummyProjectId = "global";
        const res = await GetPrediction(dummyProjectId, predictionId);
        setPrediction(res.data);
      } catch (err) {
        console.error("Failed to fetch prediction", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrediction();
  }, [predictionId]);

  // Fetch Data when page/limit changes
  useEffect(() => {
    if (prediction?.project_id) {
      const fetchData = async () => {
        setIsDataLoading(true);
        try {
          const res = await GetPredictionData(
            prediction.project_id,
            predictionId,
            { page, limit }
          );
          setData(res.data.data || []);
          setTotalRows(res.data.total || 0);
        } catch (err) {
          console.error("Failed to load prediction data", err);
        } finally {
          setIsDataLoading(false);
        }
      };
      fetchData();
    }
  }, [prediction, predictionId, page, limit]);

  const handleDownload = async () => {
    if (!prediction) return;
    try {
      const response = await DownloadPrediction(
        prediction.project_id,
        prediction.id
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const ext =
        prediction.output_format === "CSV"
          ? ".csv"
          : prediction.output_format === "JSON"
          ? ".json"
          : ".parquet";
      link.setAttribute("download", `prediction_${prediction.id}${ext}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download failed", err);
      alert("Failed to download file");
    }
  };

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

  const isSuccess = prediction.status === "SUCCESS";

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <div className="bg-background border-b sticky top-0 z-20 backdrop-blur-xl bg-background/80">
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
              <div className="h-4 w-px bg-border mx-1 hidden sm:block"></div>
              <div className="flex items-center gap-2">
                <span className="font-semibold tracking-tight">
                  Prediction Details
                </span>
                <Badge
                  variant="outline"
                  className="font-mono font-normal text-xs"
                >
                  {prediction.id.substring(0, 8)}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isSuccess && prediction.output_url && (
                <Button
                  size="sm"
                  className="rounded-full gap-2"
                  onClick={handleDownload}
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 max-w-7xl pt-12 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Status Card */}
            <Card className="lg:col-span-8 border-border/40 overflow-hidden">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold tracking-tight">
                  Job Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Status Banner */}
                <div
                  className={`relative overflow-hidden rounded-2xl p-6 ${
                    prediction.status === "SUCCESS"
                      ? "bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent"
                      : prediction.status === "FAILED"
                      ? "bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent"
                      : "bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent"
                  }`}
                >
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        Status
                      </div>
                      <div className="flex items-center gap-3">
                        {prediction.status === "SUCCESS" && (
                          <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        )}
                        {prediction.status === "FAILED" && (
                          <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                        )}
                        {prediction.status === "PROCESSING" && (
                          <Loader2 className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-spin" />
                        )}
                        <span className="text-2xl font-bold">
                          {prediction.status}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l ${
                        prediction.status === "SUCCESS"
                          ? "from-emerald-500/20"
                          : prediction.status === "FAILED"
                          ? "from-red-500/20"
                          : "from-blue-500/20"
                      } to-transparent`}
                    ></div>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      Rows Processed
                    </div>
                    <div className="text-3xl font-bold tabular-nums">
                      {prediction.row_count > 0
                        ? prediction.row_count.toLocaleString()
                        : "—"}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      Target Column
                    </div>
                    <div className="text-xl font-semibold bg-muted/50 px-3 py-2 rounded-lg inline-block">
                      {prediction.target}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      Created
                    </div>
                    <div className="text-lg font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      {formatDistanceToNow(new Date(prediction.created_at), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Model Info Card */}
            <Card className="lg:col-span-4 border-border/40">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-2 text-xl font-bold">
                  <LayoutGrid className="w-5 h-5" /> Model
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Project
                  </div>
                  <Link
                    href={`/dashboard/projects/${prediction.project_id}`}
                    className="block text-base font-medium hover:text-primary transition-colors"
                  >
                    {prediction.project_name || "View Project"} →
                  </Link>
                </div>
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Version
                  </div>
                  <div className="font-mono text-sm bg-muted border px-2.5 py-1.5 rounded-lg inline-block">
                    {prediction.model_version || "latest"}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Problem Type
                  </div>
                  <div className="font-medium capitalize text-base">
                    {prediction.problem_type?.replace("_", " ") || "—"}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Visualization Section */}
          {isSuccess && chartData.length > 0 && (
            <div className="grid grid-cols-1 gap-6">
              <Card className="border-border/40 overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-bold">
                    Prediction Distribution
                  </CardTitle>
                  <CardDescription>
                    {prediction.problem_type?.includes("CLASSIFICATION")
                      ? "Top predicted classes probability"
                      : "Statistical summary of predicted values"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="var(--border)"
                      />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                      />
                      <Tooltip
                        cursor={{ fill: "var(--muted)", opacity: 0.3 }}
                        contentStyle={{
                          borderRadius: "12px",
                          border: "1px solid var(--border)",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                          backgroundColor: "var(--card)",
                          color: "var(--foreground)",
                        }}
                      />
                      <Bar
                        dataKey="value"
                        fill="var(--primary)"
                        radius={[6, 6, 0, 0]}
                        barSize={40}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}

          {isSuccess && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight">
                    Prediction Results
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {totalRows.toLocaleString()} total predictions
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Select
                    value={String(limit)}
                    onValueChange={(v) => {
                      setLimit(Number(v));
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="w-[120px] h-9 rounded-full">
                      <SelectValue placeholder="Limit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 rows</SelectItem>
                      <SelectItem value="50">50 rows</SelectItem>
                      <SelectItem value="100">100 rows</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-full">
                    <Button
                      variant={viewMode === "cards" ? "default" : "ghost"}
                      size="sm"
                      className="h-7 px-3 rounded-full text-xs"
                      onClick={() => setViewMode("cards")}
                    >
                      Cards
                    </Button>
                    <Button
                      variant={viewMode === "table" ? "default" : "ghost"}
                      size="sm"
                      className="h-7 px-3 rounded-full text-xs"
                      onClick={() => setViewMode("table")}
                    >
                      Table
                    </Button>
                  </div>
                </div>
              </div>

              {isDataLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : data.length === 0 ? (
                <Card className="border-border/40">
                  <CardContent className="flex flex-col items-center justify-center py-20">
                    <FileText className="w-12 h-12 text-muted-foreground/50 mb-3" />
                    <p className="text-muted-foreground">
                      No prediction data available
                    </p>
                  </CardContent>
                </Card>
              ) : viewMode === "cards" ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {data.map((row, i) => {
                    const entries = Object.entries(row);
                    const predictionKey = entries.find(
                      ([key]) =>
                        key.toLowerCase().includes("prediction") ||
                        key.toLowerCase().includes("predict")
                    );
                    const predictionValue = predictionKey
                      ? (predictionKey[1] as string | number)
                      : null;

                    return (
                      <Card
                        key={i}
                        className="border-border/40 overflow-hidden hover:shadow-xl transition-all duration-500 group rounded-[2rem] bg-card/50 backdrop-blur-md"
                      >
                        <CardContent className="p-6 space-y-6">
                          {/* Row Number Badge */}
                          <div className="flex items-center justify-between">
                            <Badge
                              variant="outline"
                              className="font-mono text-[10px] uppercase tracking-wider bg-muted/30"
                            >
                              Entry #{(page - 1) * limit + i + 1}
                            </Badge>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                              {prediction.problem_type}
                            </span>
                          </div>

                          {/* Visualization Area */}
                          <div className="bg-muted/30 rounded-2xl p-5 border border-border/50 shadow-inner">
                            {prediction.problem_type
                              ?.toUpperCase()
                              .includes("CLASSIFICATION") ? (
                              <ClassificationPreview
                                probabilities={Object.fromEntries(
                                  Object.entries(row)
                                    .filter(([k]) => k.startsWith("prob_"))
                                    .map(([k, v]) => [
                                      k.replace("prob_", ""),
                                      Number(v),
                                    ])
                                )}
                              />
                            ) : (
                              <RegressionPreview
                                value={Number(predictionValue)}
                                min={prediction.metadata?.distribution?.min}
                                max={prediction.metadata?.distribution?.max}
                                label="Predicted Output"
                              />
                            )}
                          </div>

                          {/* Data Fields */}
                          <div className="space-y-3 pt-2">
                            {entries
                              .filter(
                                ([key]) =>
                                  !key.toLowerCase().includes("prediction")
                              )
                              .slice(0, 4)
                              .map(([key, val]) => (
                                <div
                                  key={key}
                                  className="flex justify-between items-start gap-3 text-sm"
                                >
                                  <span className="text-muted-foreground font-medium truncate flex-shrink-0 max-w-[40%]">
                                    {key}
                                  </span>
                                  <span className="font-semibold text-right break-words">
                                    {typeof val === "object"
                                      ? JSON.stringify(val)
                                      : String(val)}
                                  </span>
                                </div>
                              ))}
                            {entries.length > 5 && (
                              <div className="text-xs text-muted-foreground text-center pt-2 border-t">
                                +{entries.length - 5} more fields
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card className="border-border/40 overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-muted/30">
                        <TableRow>
                          {data.length > 0 &&
                            Object.keys(data[0]).map((key) => (
                              <TableHead
                                key={key}
                                className="whitespace-nowrap font-semibold"
                              >
                                {key}
                              </TableHead>
                            ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.map((row, i) => (
                          <TableRow key={i} className="hover:bg-muted/10">
                            {Object.values(row).map((val: any, j) => (
                              <TableCell
                                key={j}
                                className="whitespace-nowrap text-sm"
                              >
                                {typeof val === "object"
                                  ? JSON.stringify(val)
                                  : String(val)}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </Card>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="text-sm text-muted-foreground">
                  Showing{" "}
                  <span className="font-semibold text-foreground">
                    {(page - 1) * limit + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-foreground">
                    {Math.min(page * limit, totalRows)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-foreground">
                    {totalRows.toLocaleString()}
                  </span>{" "}
                  results
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1 || isDataLoading}
                    onClick={() => setPage((p) => p - 1)}
                    className="rounded-full"
                  >
                    Previous
                  </Button>
                  <div className="px-3 py-1 bg-muted/50 rounded-full text-sm font-medium">
                    Page {page}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={data.length < limit || isDataLoading}
                    onClick={() => setPage((p) => p + 1)}
                    className="rounded-full"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
