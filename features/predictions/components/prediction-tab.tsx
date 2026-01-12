"use client";

import { useState } from "react";
import { UploadCloud, FileSpreadsheet, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CreatePrediction } from "@/features/predictions/api";
import { PredictionLog } from "@/features/predictions/types";

interface PredictionTabProps {
  projectId: string;
  onPredictionCreated?: () => void;
}

export function PredictionTab({ projectId, onPredictionCreated }: PredictionTabProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionLog | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setResult(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await CreatePrediction(projectId, file);
      setResult(res.data);
      if (onPredictionCreated) onPredictionCreated();
    } catch (err) {
      console.error(err);
      setError("Failed to start prediction task. Please check your file format.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="md:col-span-2 border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle>Run Prediction</CardTitle>
          <CardDescription>
            Upload a CSV file matching your dataset schema to generate predictions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid w-full max-w-sm items-center gap-2">
            <Label htmlFor="file">Input Data (CSV)</Label>
            <div className="relative border-2 border-dashed border-border/60 rounded-xl p-8 hover:bg-muted/30 transition-colors flex flex-col items-center justify-center text-center cursor-pointer group">
              <input
                type="file"
                id="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                accept=".csv"
                onChange={handleFileChange}
              />
              <div className="bg-primary/5 p-4 rounded-full mb-3 group-hover:scale-110 transition-transform">
                {file ? (
                  <FileSpreadsheet className="w-8 h-8 text-primary" />
                ) : (
                  <UploadCloud className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              {file ? (
                <div className="space-y-1">
                  <p className="font-medium text-sm text-foreground">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="font-medium text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground/60">
                    CSV files only (max 50MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            {file && (
              <Button
                variant="ghost"
                onClick={() => {
                  setFile(null);
                  setResult(null);
                  setError(null);
                }}
                disabled={isLoading}
              >
                Clear
              </Button>
            )}
            <Button
              onClick={handleSubmit}
              disabled={!file || isLoading}
              className="min-w-[120px] rounded-full font-semibold shadow-lg shadow-primary/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing
                </>
              ) : (
                "Run Prediction"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 flex gap-3 items-start animate-in fade-in slide-in-from-bottom-2">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold">Error</p>
              <p className="opacity-90">{error}</p>
            </div>
          </div>
        )}

        {result && (
          <Card className="border-green-500/20 bg-green-500/5 shadow-sm animate-in fade-in slide-in-from-bottom-2">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-green-600 mb-1">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-bold text-sm uppercase tracking-wide">Success</span>
              </div>
              <CardTitle className="text-lg">Job Started</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Your prediction job <strong>#{result.id.slice(0, 8)}</strong> has been queued.
                You can track its progress in the History tab.
              </p>
            </CardContent>
          </Card>
        )}
        
        {!result && !error && (
            <Card className="border-border/60 shadow-sm bg-muted/10">
                <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Instructions</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                    <p>1. Ensure your CSV has the same columns as your training dataset (excluding the target column).</p>
                    <p>2. The file should not exceed 50MB.</p>
                    <p>3. Results will be available for download once processing is complete.</p>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
