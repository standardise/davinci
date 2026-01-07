"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  StopCircle,
  Database,
  Clock,
  ExternalLink,
  Rocket,
  Code2,
  Cpu,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { App } from "@/features/applications/types";
import {
  CancelTraining,
  DeleteApp,
  GetApp,
  StartTraining,
} from "@/features/applications/api";
import AuthGuard from "@/features/auth/components/auth-guard";
import { ApplicationStatusBadge } from "@/features/applications/components/application-status-badge";

interface Props {
  id: string;
}

export default function AppDetailView({ id }: Props) {
  const router = useRouter();
  const [app, setApp] = useState<App | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const { data } = await GetApp(id);
      setApp(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (app && (app.status === "TRAINING" || app.status === "QUEUED")) {
      interval = setInterval(fetchData, 3000);
    }
    return () => clearInterval(interval);
  }, [app, fetchData]);

  // Actions
  const handleTrain = async () => {
    setIsActionLoading(true);
    try {
      await StartTraining(id);
      fetchData();
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to start training"
      );
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleCancel = async () => {
    setIsActionLoading(true);
    try {
      await CancelTraining(id);
      fetchData();
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure? This action cannot be undone.")) return;
    try {
      await DeleteApp(id);
      router.push("/dashboard/applications");
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to delete project"
      );
    }
  };

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (!app) return <div>Project not found</div>;

  const isTraining = app.status === "TRAINING" || app.status === "QUEUED";
  const isReady = app.status === "COMPLETED";

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background pb-12">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="mb-8">
            <Link
              href="/dashboard/applications"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
            </Link>

            <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-border pb-8">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold tracking-tight">
                    {app.name}
                  </h1>
                  <ApplicationStatusBadge status={app.status} />
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Code2 className="w-3.5 h-3.5" /> {app.slug}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Version {app.version}
                  </span>
                </div>
                <p className="text-muted-foreground max-w-2xl pt-2">
                  {app.description || "No description provided."}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  size="lg"
                  className={`shadow-xl shadow-primary/20 gap-2 ${
                    isReady
                      ? "animate-in zoom-in-50 duration-300"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                  disabled={!isReady}
                  onClick={() => router.push(`/apps/${app.id}`)}
                >
                  <Rocket className="w-4 h-4" />
                  Launch App
                </Button>

                {isTraining ? (
                  <Button
                    variant="destructive"
                    size="lg"
                    onClick={handleCancel}
                    disabled={isActionLoading}
                  >
                    <StopCircle className="w-4 h-4 mr-2" /> Stop
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleTrain}
                    disabled={isActionLoading}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" /> Retrain
                  </Button>
                )}
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-8 w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger
                value="overview"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
              >
                Overview & Model
              </TabsTrigger>
              <TabsTrigger
                value="configuration"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
              >
                Configuration
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
              >
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {app.status === "FAILED" && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex gap-3 text-red-600">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <div>
                    <h4 className="font-semibold">Build Failed</h4>
                    <p className="text-sm">
                      {app.error_message ||
                        "Unknown error occurred during training."}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-primary" /> Model Performance
                    </CardTitle>
                    <CardDescription>
                      Metrics from the latest successful build.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {app.metrics ? (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {Object.entries(app.metrics).map(([key, value]) => (
                          <div
                            key={key}
                            className="p-4 rounded-xl bg-muted/50 border border-border"
                          >
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                              {key}
                            </p>
                            <p className="text-2xl font-bold tracking-tight">
                              {typeof value === "number"
                                ? value.toFixed(4)
                                : value}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-40 flex flex-col items-center justify-center text-muted-foreground border border-dashed rounded-xl">
                        <p>No metrics available yet.</p>
                        <Button
                          variant="link"
                          onClick={handleTrain}
                          className="text-primary"
                        >
                          Start your first training
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Rocket className="w-5 h-5 text-primary" /> Deployment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">
                        Status
                      </Label>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            isReady ? "bg-green-500" : "bg-yellow-500"
                          }`}
                        />
                        <span className="font-medium">
                          {isReady ? "Active" : "Not Deployed"}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">
                        Access
                      </Label>
                      <div className="text-sm font-medium">
                        {app.is_public ? "Public" : "Private (Whitelist)"}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">
                        Last Updated
                      </Label>
                      <div className="text-sm">
                        {new Date(app.updated_at).toLocaleString()}
                      </div>
                    </div>

                    <Separator />

                    <Button
                      className="w-full"
                      variant="outline"
                      disabled={!isReady}
                      onClick={() => router.push(`/apps/${app.id}`)}
                    >
                      Open App <ExternalLink className="w-3 h-3 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="configuration" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Core Configuration</CardTitle>
                  <CardDescription>
                    These settings define the problem your model solves. To
                    change these, you may need to create a new project.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground uppercase">
                      Problem Type
                    </Label>
                    <div className="font-medium flex items-center gap-2">
                      <Badge variant="secondary">
                        {app.problem_type.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground uppercase">
                      Dataset Reference
                    </Label>
                    <div className="font-medium font-mono flex items-center gap-2">
                      <Database className="w-4 h-4 text-muted-foreground" />
                      <Link
                        href={`/datasets/${app.dataset_reference}`}
                        className="hover:underline hover:text-primary"
                      >
                        {app.dataset_reference}
                      </Link>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground uppercase">
                      Target Column
                    </Label>
                    <div className="font-medium font-mono bg-primary/5 inline-block px-2 py-1 rounded">
                      {app.target_column}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground uppercase">
                      ID Column
                    </Label>
                    <div className="font-medium font-mono">
                      {app.id_column || "-"}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {app.time_series_config && (
                <Card>
                  <CardHeader>
                    <CardTitle>Time Series Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground uppercase">
                        Time Column
                      </Label>
                      <div className="font-medium font-mono">
                        {app.time_series_config.time_column}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground uppercase">
                        Group Column
                      </Label>
                      <div className="font-medium font-mono">
                        {app.time_series_config.group_column || "-"}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground uppercase">
                        Frequency
                      </Label>
                      <div className="font-medium">
                        {app.time_series_config.frequency}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground uppercase">
                        Forecast Horizon
                      </Label>
                      <div className="font-medium">
                        {app.time_series_config.forecast_horizon} steps
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* === TAB: SETTINGS === */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>
                    Manage project details and visibility.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2 max-w-md">
                    <Label>Project Name</Label>
                    <div className="flex gap-2">
                      <Input defaultValue={app.name} />
                      <Button variant="outline">Save</Button>
                    </div>
                  </div>
                  <div className="grid gap-2 max-w-md">
                    <Label>Description</Label>
                    <div className="flex gap-2">
                      <Input defaultValue={app.description} />
                      <Button variant="outline">Save</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-500/20 bg-red-500/5">
                <CardHeader>
                  <CardTitle className="text-red-600">Danger Zone</CardTitle>
                  <CardDescription>Irreversible actions.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Delete Project</h4>
                      <p className="text-sm text-muted-foreground">
                        Once deleted, your app and all associated metrics will
                        be removed permanently.
                      </p>
                    </div>
                    <Button variant="destructive" onClick={handleDelete}>
                      Delete Project
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AuthGuard>
  );
}
