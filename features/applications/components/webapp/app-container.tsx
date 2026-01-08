"use client";

import React, { useEffect, useState } from "react";
import { App } from "@/features/applications/types";
import { GetApp } from "@/features/applications/api";
import { AppView } from "./app-view";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppContainerProps {
  appId: string;
}

export const AppContainer = ({ appId }: AppContainerProps) => {
  const [app, setApp] = useState<App | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApp = async () => {
      try {
        setLoading(true);
        const response = await GetApp(appId);
        setApp(response.data);
      } catch (err) {
        console.error(err);
        setError(
          "Failed to load application. It might not exist or you don't have permission."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApp();
  }, [appId]);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground animate-pulse text-sm font-medium">
          Loading Application...
        </p>
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 text-red-500">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold mb-2">Unable to load app</h2>
        <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
          {error || "Application not found"}
        </p>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="min-w-30"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return <AppView app={app} />;
};
