"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Database,
  Clock,
  Rocket,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { App } from "@/features/applications/types";
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
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm font-medium text-muted-foreground">
            Loading...
          </p>
        </div>
      </div>
    );

  if (!app)
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-6 bg-background">
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-semibold text-foreground">
            Project not found
          </h2>
          <p className="text-muted-foreground">
            This project doesn{"'"}t exist or you don{"'"}t have access.
          </p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/projects")}
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 h-11 font-semibold shadow-lg shadow-primary/20"
        >
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
      <div className="min-h-screen bg-background">
        <div className="bg-background/80 backdrop-blur-xl border-b border-border sticky top-0 z-20">
          <div className="container mx-auto px-6 lg:px-12 max-w-7xl h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
                onClick={() => router.push("/dashboard/projects")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-3 ml-2">
                <span className="font-semibold text-foreground text-base tracking-tight">
                  {app.name}
                </span>
                <ApplicationStatusBadge status={app.status} />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex rounded-full text-muted-foreground hover:bg-muted hover:text-foreground font-medium"
                onClick={handleTrain}
                disabled={isTraining || isActionLoading}
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 mr-2 ${
                    isTraining || isActionLoading ? "animate-spin" : ""
                  }`}
                />
                {isTraining ? "Training..." : "Retrain"}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-8 w-8 hover:bg-muted"
                  >
                    <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 rounded-2xl shadow-xl border-border"
                >
                  <DropdownMenuLabel className="text-muted-foreground text-xs font-medium">
                    Actions
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleTrain}
                    disabled={isTraining}
                    className="rounded-lg"
                  >
                    <RefreshCw className="h-4 w-4 mr-3 text-muted-foreground" />{" "}
                    Retrain Model
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setActiveTab("settings")}
                    className="rounded-lg"
                  >
                    <Settings className="h-4 w-4 mr-3 text-muted-foreground" />{" "}
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive rounded-lg"
                    onClick={handleDelete}
                  >
                    <Trash2 className="h-4 w-4 mr-3" /> Delete Project
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 lg:px-12 max-w-7xl pt-12 pb-24">
          <div className="mb-16">
            <div className="max-w-3xl space-y-6">
              <div className="space-y-3">
                <h1 className="text-5xl font-bold tracking-tight text-foreground leading-tight text-balance">
                  {app.name}
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed font-normal text-pretty">
                  {app.description || "No description provided."}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border">
                  <Database className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    {app.dataset_id}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border">
                  <Zap className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Target:</span>
                  <span className="text-sm font-medium text-foreground">
                    {app.target}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Updated {formatDistanceToNow(new Date(app.updated_at))} ago
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
            <Card className="border-border shadow-lg bg-foreground text-background overflow-hidden">
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <Play className="h-8 w-8 opacity-90" />
                  <h3 className="text-xl font-semibold">Make Prediction</h3>
                  <p className="text-sm opacity-70 leading-relaxed">
                    Run predictions with your trained model
                  </p>
                </div>
                <Button
                  className="w-full bg-background text-foreground hover:bg-background/90 rounded-full h-11 font-semibold shadow-sm"
                  disabled={!canPredict}
                  onClick={() => setActiveTab("predict")}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm bg-muted/30 overflow-hidden">
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <History className="h-8 w-8 text-foreground" />
                  <h3 className="text-xl font-semibold text-foreground">
                    History
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    View all past predictions and results
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-border hover:bg-background rounded-full h-11 font-semibold text-foreground bg-transparent"
                  onClick={() => setActiveTab("history")}
                >
                  View History
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm overflow-hidden bg-card">
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <Rocket className="h-8 w-8 text-foreground" />
                  <h3 className="text-xl font-semibold text-foreground">
                    Model Status
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {isReady
                      ? "Your model is ready to use"
                      : "Train your model to get started"}
                  </p>
                </div>
                {!isReady && (
                  <Button
                    variant="outline"
                    className="w-full border-border hover:bg-muted rounded-full h-11 font-semibold text-foreground bg-transparent"
                    onClick={handleTrain}
                    disabled={isTraining || isActionLoading}
                  >
                    {isTraining ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Training...
                      </>
                    ) : (
                      "Start Training"
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="bg-muted/50 p-1 rounded-full w-fit mb-12 border border-border/40 backdrop-blur-sm">
              <TabsList className="bg-transparent h-auto p-0 gap-1">
                {["overview", "predict", "history", "settings"].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="rounded-full px-8 py-2 text-sm font-semibold text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 transition-all duration-300"
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent
              value="overview"
              className="space-y-8 animate-in fade-in duration-500"
            >
              {app.status === "FAILED" && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-8 flex gap-5">
                  <div className="p-2.5 bg-destructive/20 rounded-full shrink-0 h-fit">
                    <AlertCircle className="w-5 h-5 text-destructive" />
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-lg text-destructive">
                      Training Failed
                    </h4>
                    <p className="text-destructive-foreground leading-relaxed">
                      The last model training session encountered an error.
                      Please check your dataset compatibility or try retraining.
                    </p>
                    <Button
                      className="mt-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full px-6"
                      onClick={handleTrain}
                    >
                      Retry Training
                    </Button>
                  </div>
                </div>
              )}

              {!canPredict && !isTraining && app.status !== "FAILED" && (
                <div className="bg-muted/30 border border-border rounded-3xl p-12 flex flex-col items-center text-center">
                  <div className="p-5 bg-muted rounded-full mb-6">
                    <Rocket className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <div className="max-w-md space-y-4">
                    <h3 className="font-semibold text-2xl text-foreground">
                      Ready to Train?
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Your project is set up. Start training your model to
                      generate predictions.
                    </p>
                    <Button
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 h-12 font-semibold mt-6 shadow-lg shadow-primary/25"
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
                <div className="bg-primary/10 border border-primary/20 rounded-3xl p-12 flex flex-col items-center text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-primary/20">
                    <div className="h-full bg-primary animate-progress origin-left"></div>
                  </div>
                  <Loader2 className="w-12 h-12 text-primary animate-spin mb-6" />
                  <h3 className="font-semibold text-xl text-foreground mb-2">
                    Training in Progress
                  </h3>
                  <p className="text-muted-foreground">
                    We are optimizing your model. This may take a few minutes.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
                <Card className="border-border shadow-sm bg-card overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-foreground">
                        Project Details
                      </CardTitle>
                      <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase px-2.5 py-1 bg-muted/50 rounded-full">
                        {"ML Model"}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between p-4 bg-muted/30 rounded-2xl border border-border/50">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                              Project ID
                            </span>
                          </div>
                          <p className="font-mono text-sm text-foreground font-medium pl-4">
                            {app.id}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-background border border-border rounded-full text-xs font-semibold text-foreground">
                          Active
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/50">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                            Visibility
                          </p>
                          <p className="text-sm font-semibold text-foreground">
                            {app.visibility || "Private"}
                          </p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-foreground/5 flex items-center justify-center">
                          <Database className="h-5 w-5 text-foreground/60" />
                        </div>
                      </div>

                      <div className="p-4 bg-linear-to-br from-muted/40 to-muted/20 rounded-2xl border border-border/50">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                              Created Date
                            </p>
                            <p className="text-sm font-semibold text-foreground">
                              {new Date(app.created_at).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </p>
                          </div>
                          <Clock className="h-5 w-5 text-foreground/40" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border shadow-sm bg-card overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-foreground">
                        Model Performance
                      </CardTitle>
                      <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase px-2.5 py-1 bg-muted/50 rounded-full">
                        {isReady ? "Ready" : "Not Trained"}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {isReady ? (
                      <div className="space-y-4">
                        <div className="p-5 bg-linear-to-br from-emerald-500/10 to-emerald-600/5 rounded-2xl border border-emerald-500/20">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                              Status
                            </span>
                            <div className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                                Operational
                              </span>
                            </div>
                          </div>
                          <div className="flex items-end justify-between">
                            <div>
                              <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">
                                98.5%
                              </p>
                              <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mt-0.5">
                                Accuracy Score
                              </p>
                            </div>
                            <div className="px-3 py-1.5 bg-emerald-500/20 rounded-full">
                              <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                                A+
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-4 bg-muted/40 rounded-xl border border-border/50">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                              Predictions
                            </p>
                            <p className="text-2xl font-bold text-foreground">
                              1,247
                            </p>
                          </div>
                          <div className="p-4 bg-muted/40 rounded-xl border border-border/50">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                              Uptime
                            </p>
                            <p className="text-2xl font-bold text-foreground">
                              99.9%
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="p-6 bg-muted/30 rounded-2xl border border-border/50 flex flex-col items-center text-center">
                          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                            <Zap className="w-6 h-6 text-muted-foreground" />
                          </div>
                          <p className="text-sm font-semibold text-foreground mb-1">
                            No Data Available
                          </p>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Train your model to view performance metrics and
                            accuracy scores.
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-4 bg-muted/20 rounded-xl border border-dashed border-border">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                              Predictions
                            </p>
                            <p className="text-2xl font-bold text-muted-foreground/40">
                              --
                            </p>
                          </div>
                          <div className="p-4 bg-muted/20 rounded-xl border border-dashed border-border">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                              Accuracy
                            </p>
                            <p className="text-2xl font-bold text-muted-foreground/40">
                              --
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent
              value="predict"
              className="animate-in fade-in duration-500"
            >
              {!canPredict ? (
                <div className="h-80 flex flex-col items-center justify-center text-center border-2 border-dashed border-border rounded-3xl bg-muted/30">
                  <p className="text-foreground font-semibold mb-2">
                    Model not ready
                  </p>
                  <p className="text-sm text-muted-foreground mb-6 max-w-sm leading-relaxed">
                    You need to train the model successfully before making
                    predictions.
                  </p>
                  <Button
                    className="bg-foreground hover:bg-foreground/90 text-background rounded-full px-6"
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

            <TabsContent
              value="history"
              className="animate-in fade-in duration-500"
            >
              <PredictionHistoryList projectId={id} />
            </TabsContent>

            <TabsContent
              value="settings"
              className="space-y-8 animate-in fade-in duration-500"
            >
              <Card className="border-border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    General
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Update your project{"'"}s basic information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-sm font-medium text-foreground"
                    >
                      Project Name
                    </Label>
                    <Input
                      id="name"
                      value={settingsForm.name}
                      onChange={(e) =>
                        setSettingsForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="border-border rounded-xl h-11 focus:border-ring focus:ring-ring"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="description"
                      className="text-sm font-medium text-foreground"
                    >
                      Description
                    </Label>
                    <Input
                      id="description"
                      value={settingsForm.description}
                      onChange={(e) =>
                        setSettingsForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className="border-border rounded-xl h-11 focus:border-ring focus:ring-ring"
                    />
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border/60 bg-muted/30">
                  <Button
                    onClick={handleUpdateSettings}
                    disabled={isActionLoading}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 h-11 font-semibold shadow-lg shadow-primary/20"
                  >
                    {isActionLoading && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-destructive/20 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-destructive">
                    Danger Zone
                  </CardTitle>
                  <CardDescription className="text-destructive-foreground">
                    Irreversible actions that affect your project
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start justify-between p-6 bg-destructive/10 rounded-2xl border border-destructive/20">
                    <div>
                      <h4 className="font-semibold text-destructive mb-1">
                        Delete this project
                      </h4>
                      <p className="text-sm text-destructive-foreground">
                        Once deleted, it will be gone forever. Please be
                        certain.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="border-destructive/30 text-destructive hover:bg-destructive/20 rounded-full px-6 ml-4 bg-transparent"
                      onClick={handleDelete}
                    >
                      Delete
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
