"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Database,
  Clock,
  Rocket,
  Code2,
  RefreshCw,
  AlertCircle,
  Settings,
  MoreHorizontal,
  Play,
  History,
  Trash2,
  Zap,
  Loader2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { App } from "@/features/applications/types";
import {
  DeleteApp,
  GetApp,
  StartTraining,
  UpdateApp,
} from "@/features/applications/api";
import AuthGuard from "@/features/auth/components/auth-guard";
import { ApplicationStatusBadge } from "@/features/applications/components/application-status-badge";
import { PredictionTab } from "@/features/predictions/components/prediction-tab";
import { PredictionHistoryList } from "@/features/predictions/components/prediction-history-list";

interface Props {
  id: string;
}

export default function AppDetailView({ id }: Props) {
  const router = useRouter();
  const [app, setApp] = useState<App | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Settings State
  const [settingsForm, setSettingsForm] = useState({
    name: "",
    description: "",
  });

  const fetchData = useCallback(async () => {
    try {
      const { data } = await GetApp(id);
      setApp(data);
      setSettingsForm({
        name: data.name,
        description: data.description,
      });
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
    if (app && (app.status === "PROCESSING" || app.status === "WAITING")) {
      interval = setInterval(fetchData, 3000);
    }
    return () => clearInterval(interval);
  }, [app, fetchData]);

  // Actions
  const handleTrain = async () => {
    setIsActionLoading(true);
    try {
      await StartTraining(id);
      await fetchData();
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to start training"
      );
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleUpdateSettings = async () => {
    setIsActionLoading(true);
    try {
      await UpdateApp(id, settingsForm);
      fetchData();
      alert("Settings updated successfully");
    } catch (error) {
      alert("Failed to update settings");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure? This action cannot be undone.")) return;
    try {
      await DeleteApp(id);
      router.push("/dashboard/projects");
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to delete project"
      );
    }
  };

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center bg-muted/10">
        <div className="flex flex-col items-center gap-3 animate-pulse">
          <div className="h-12 w-12 rounded-xl bg-muted"></div>
          <div className="h-4 w-32 rounded bg-muted"></div>
        </div>
      </div>
    );

  if (!app)
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-bold">Project not found</h2>
        <Button onClick={() => router.push("/dashboard/projects")}>
          Back to Dashboard
        </Button>
      </div>
    );

  const isTraining = app.status === "PROCESSING" || app.status === "WAITING";
  const isReady = app.status === "ACTIVE";

  // Determine effective ready status
  const canPredict = isReady;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-muted/5 pb-20">
        {/* Header / Breadcrumb Area */}
        <div className="bg-background border-b border-border/60 sticky top-0 z-20 backdrop-blur-xl">
          <div className="container mx-auto px-4 lg:px-8 max-w-6xl h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => router.push("/dashboard/projects")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="h-4 w-px bg-border/60 mx-1 hidden sm:block"></div>
              <div className="flex items-center gap-2">
                <span className="font-semibold tracking-tight hidden sm:inline-block text-sm">
                  {app.name}
                </span>
                <ApplicationStatusBadge status={app.status} />
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Primary Actions */}
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex rounded-full border-border/60"
                onClick={handleTrain}
                disabled={isTraining || isActionLoading}
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 mr-2 ${
                    isTraining || isActionLoading
                      ? "animate-spin"
                      : "text-muted-foreground"
                  }`}
                />
                {isTraining ? "Training..." : "Retrain Model"}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-xl">
                  <DropdownMenuLabel>Project Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleTrain} disabled={isTraining}>
                    <RefreshCw className="h-4 w-4 mr-2" /> Retrain Model
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("settings")}>
                    <Settings className="h-4 w-4 mr-2" /> Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600"
                    onClick={handleDelete}
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Delete Project
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl pt-8 space-y-8">
          {/* Hero Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">
                  {app.name}
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {app.description || "No description provided."}
                </p>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background border border-border/60 shadow-sm">
                  <Database className="h-4 w-4 text-blue-500" />
                  <span className="font-medium text-foreground">
                    {app.dataset_id}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background border border-border/60 shadow-sm">
                  <Zap className="h-4 w-4 text-amber-500" />
                  Target:{" "}
                  <span className="font-medium text-foreground">
                    {app.target}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background border border-border/60 shadow-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  Updated {formatDistanceToNow(new Date(app.updated_at))} ago
                </div>
              </div>
            </div>

            <Card className="border-none shadow-xl shadow-primary/5 bg-linear-to-br from-primary/5 via-background to-background ring-1 ring-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <Button
                  className="w-full h-11 rounded-xl shadow-lg shadow-primary/20 font-semibold"
                  disabled={!canPredict}
                  onClick={() => setActiveTab("predict")}
                >
                  <Play className="h-4 w-4 mr-2 fill-current" />
                  Make Prediction
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-11 rounded-xl border-border/60 hover:bg-muted/50"
                  onClick={() => setActiveTab("history")}
                >
                  <History className="h-4 w-4 mr-2" />
                  View History
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="bg-transparent border-b border-border/60 w-full justify-start h-auto p-0 rounded-none mb-8 space-x-6">
              <TabsTrigger
                value="overview"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3 font-medium text-muted-foreground data-[state=active]:text-foreground transition-all hover:text-foreground/80"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="predict"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3 font-medium text-muted-foreground data-[state=active]:text-foreground transition-all hover:text-foreground/80"
              >
                Predict
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3 font-medium text-muted-foreground data-[state=active]:text-foreground transition-all hover:text-foreground/80"
              >
                History
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3 font-medium text-muted-foreground data-[state=active]:text-foreground transition-all hover:text-foreground/80"
              >
                Settings
              </TabsTrigger>
            </TabsList>

            {/* OVERVIEW CONTENT */}
            <TabsContent
              value="overview"
              className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500"
            >
              {app.status === "FAILED" && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex gap-4 text-red-600 items-start">
                  <div className="p-2 bg-red-500/20 rounded-full shrink-0">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Training Failed</h4>
                    <p className="opacity-90">
                      The last model training session encountered an error.
                      Please check your dataset compatibility or try retraining.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 border-red-200 hover:bg-red-50 text-red-700"
                      onClick={handleTrain}
                    >
                      Retry Training
                    </Button>
                  </div>
                </div>
              )}

              {!canPredict && !isTraining && app.status !== "FAILED" && (
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-8 flex flex-col items-center text-center gap-4">
                  <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600">
                    <Rocket className="w-8 h-8" />
                  </div>
                  <div className="max-w-md">
                    <h3 className="font-bold text-xl mb-2">Ready to Train?</h3>
                    <p className="text-muted-foreground mb-6">
                      Your project is set up. Start training your model to
                      generate predictions.
                    </p>
                    <Button
                      size="lg"
                      className="rounded-full px-8 shadow-xl shadow-blue-500/20"
                      onClick={handleTrain}
                      disabled={isActionLoading}
                    >
                      {isActionLoading && (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      )}
                      Start Training
                    </Button>
                  </div>
                </div>
              )}

              {isTraining && (
                <Card className="border-blue-500/20 bg-blue-500/5 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-blue-200">
                    <div className="h-full bg-blue-500 animate-progress origin-left"></div>
                  </div>
                  <CardContent className="pt-8 pb-8 flex flex-col items-center text-center">
                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                    <h3 className="font-bold text-lg">Training in Progress</h3>
                    <p className="text-muted-foreground">
                      We are optimizing your model. This may take a few minutes.
                    </p>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="shadow-sm border-border/60">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold">
                      Project Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between py-2 border-b border-border/40">
                      <span className="text-muted-foreground text-sm">
                        Project ID
                      </span>
                      <span className="font-mono text-xs">{app.id}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border/40">
                      <span className="text-muted-foreground text-sm">
                        Visibility
                      </span>
                      <span className="font-medium text-sm">
                        {app.visibility || "Private"}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border/40">
                      <span className="text-muted-foreground text-sm">
                        Created
                      </span>
                      <span className="font-medium text-sm">
                        {new Date(app.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Placeholder for metrics if we had them */}
                <Card className="shadow-sm border-border/60 bg-muted/5">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold">
                      Model Health
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center h-48 text-center p-6">
                    <div className="p-3 bg-muted rounded-full mb-3">
                      <Zap className="w-6 h-6 text-muted-foreground/40" />
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      Metrics unavailable
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Train the model to view accuracy scores.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* PREDICT TAB */}
            <TabsContent
              value="predict"
              className="animate-in fade-in slide-in-from-bottom-2 duration-500"
            >
              {!canPredict ? (
                <div className="h-64 flex flex-col items-center justify-center text-center border-2 border-dashed border-border/60 rounded-2xl bg-muted/5">
                  <p className="text-muted-foreground font-medium mb-2">
                    Model not ready
                  </p>
                  <p className="text-sm text-muted-foreground/60 mb-4">
                    You need to train the model successfully before making
                    predictions.
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleTrain}
                    disabled={isTraining}
                  >
                    {isTraining ? "Training..." : "Train Model Now"}
                  </Button>
                </div>
              ) : (
                <PredictionTab
                  projectId={id}
                  onPredictionCreated={() => setActiveTab("history")}
                />
              )}
            </TabsContent>

            {/* HISTORY TAB */}
            <TabsContent
              value="history"
              className="animate-in fade-in slide-in-from-bottom-2 duration-500"
            >
              <PredictionHistoryList projectId={id} />
            </TabsContent>

            {/* SETTINGS TAB */}
            <TabsContent
              value="settings"
              className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500"
            >
              <Card className="shadow-sm border-border/60">
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Manage project details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 max-w-xl">
                  <div className="space-y-2">
                    <Label>Project Name</Label>
                    <Input
                      value={settingsForm.name}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      value={settingsForm.description}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border/40 py-4 bg-muted/5">
                  <Button
                    onClick={handleUpdateSettings}
                    disabled={isActionLoading}
                  >
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-red-500/20 bg-red-500/5 shadow-none">
                <CardHeader>
                  <CardTitle className="text-red-600">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">Delete Project</p>
                    <p className="text-sm text-muted-foreground">
                      Irreversible action. All data will be lost.
                    </p>
                  </div>
                  <Button variant="destructive" onClick={handleDelete}>
                    Delete Project.
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AuthGuard>
  );
}
