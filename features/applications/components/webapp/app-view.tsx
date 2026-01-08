"use client";

import React, { useState } from "react";
import { App, FeatureSchema } from "@/features/applications/types";
import { DynamicInput } from "./dynamic-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PredictApp } from "@/features/applications/api";
import { Loader2, Sparkles, FileText } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AppViewProps {
  app: App;
}

export const AppView = ({ app }: AppViewProps) => {
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleInputChange = (name: string, value: any) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handlePredict = async () => {
    try {
      setLoading(true);
      setResult(null);

      // Basic validation
      const missingFields = app.input_schema?.filter(
        (f) => inputs[f.name] === undefined || inputs[f.name] === ""
      );
      if (missingFields && missingFields.length > 0) {
        toast.error(
          `Please fill in all fields: ${missingFields
            .map((f) => f.name)
            .join(", ")}`
        );
        return;
      }

      const response = await PredictApp(app.id, inputs);
      setResult(response.data);
      toast.success("Prediction generated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* --- Left Column: Input Form --- */}
      <div className="lg:col-span-5 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge
              variant="outline"
              className="px-2 py-0.5 text-[10px] tracking-wider uppercase bg-primary/5 text-primary border-primary/20"
            >
              Input Data
            </Badge>
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Details</h2>
          <p className="text-muted-foreground text-sm">
            Provide the necessary information below to generate a new prediction
            report.
          </p>
        </div>

        <Card className="border-0 shadow-lg shadow-primary/5 bg-card/50 backdrop-blur-sm ring-1 ring-border/50">
          <CardContent className="p-6 space-y-5">
            {app.input_schema && app.input_schema.length > 0 ? (
              app.input_schema.map((feature: FeatureSchema) => (
                <DynamicInput
                  key={feature.name}
                  feature={feature}
                  value={inputs[feature.name]}
                  onChange={(val) => handleInputChange(feature.name, val)}
                />
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                <p>No input schema defined for this application.</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="p-6 pt-0">
            <Button
              onClick={handlePredict}
              disabled={loading || !app.input_schema?.length}
              className="w-full h-12 text-base font-medium shadow-md transition-all hover:shadow-lg hover:translate-y-[-1px]"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Data...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Prediction
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* --- Right Column: Result / Document --- */}
      <div className="lg:col-span-7">
        <div className="mb-6 lg:mb-10 lg:pl-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge
              variant="outline"
              className="px-2 py-0.5 text-[10px] tracking-wider uppercase bg-muted text-muted-foreground"
            >
              Result
            </Badge>
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">
            Prediction Report
          </h2>
          <p className="text-muted-foreground text-sm">
            AI-generated analysis based on the provided inputs.
          </p>
        </div>

        <div
          className={cn(
            "relative transition-all duration-500 ease-in-out lg:pl-4",
            result ? "opacity-100 translate-y-0" : "opacity-100"
          )}
        >
          {result ? (
            <Card className="overflow-hidden border-border/60 shadow-xl shadow-primary/5">
              {/* Document Header */}
              <div className="bg-primary/5 p-8 border-b border-primary/10 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 text-primary font-bold text-lg mb-1">
                    <FileText className="w-5 h-5" />
                    <span>Analysis Report</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                    ID: {result.timestamp || new Date().getTime()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {new Date().toLocaleDateString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </div>

              <CardContent className="p-8 space-y-8">
                {/* Result Section */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                    Prediction Outcome
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-extrabold tracking-tight text-foreground">
                      {typeof result.prediction === "number"
                        ? result.prediction.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })
                        : result.prediction}
                    </span>
                    {app.problem_type === "CLASSIFICATION" &&
                      result.probability && (
                        <span className="text-lg font-medium text-muted-foreground">
                          (
                          {(
                            Math.max(
                              ...(Object.values(result.probability) as number[])
                            ) * 100
                          ).toFixed(1)}
                          % confidence)
                        </span>
                      )}
                  </div>
                  {app.target_column && (
                    <p className="text-sm text-muted-foreground">
                      Predicted value for{" "}
                      <span className="font-semibold text-foreground">
                        {app.target_column}
                      </span>
                    </p>
                  )}
                </div>

                <Separator />

                {/* Explanation Section (Mockup if not real) */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                    Summary
                  </h3>
                  <p className="leading-relaxed text-foreground/80">
                    Based on the input parameters, the model predicts a value of{" "}
                    <strong>{result.prediction}</strong>.
                    {result.explanation ||
                      "This result is calculated using an ensemble of machine learning models optimized for this specific dataset."}
                  </p>
                </div>

                {/* Input Summary Section */}
                <div className="bg-muted/30 rounded-lg p-6 border">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                    Input Parameters
                  </h3>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                    {Object.entries(inputs).map(([key, val]) => (
                      <div key={key}>
                        <dt className="text-xs text-muted-foreground capitalize mb-1">
                          {key.replace(/_/g, " ")}
                        </dt>
                        <dd
                          className="font-medium text-sm truncate"
                          title={String(val)}
                        >
                          {String(val)}
                        </dd>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>

              <div className="bg-muted/50 p-4 border-t text-center">
                <p className="text-[10px] text-muted-foreground">
                  Generated by Davinci AI • This document is for informational
                  purposes only.
                </p>
              </div>
            </Card>
          ) : (
            <div className="h-[400px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-muted-foreground/20 rounded-xl bg-muted/5">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-medium mb-2">Ready to Analyze</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-6">
                Fill out the form on the left and click "Generate Prediction" to
                see the results here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
