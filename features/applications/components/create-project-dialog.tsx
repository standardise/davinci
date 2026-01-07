"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch"; // ใช้เปิด/ปิด Time Series
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { Dataset } from "@/features/datasets/types";
import { ListDatasets } from "@/features/datasets/api";
import { CreateApp } from "../api";

export function CreateProjectDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [datasets, setDatasets] = useState<Dataset[]>([]);

  // State หลัก
  const [isTimeSeries, setIsTimeSeries] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    dataset_reference: "",
    target_column: "",
    id_column: "",
  });

  // State สำหรับ Time Series Config
  const [tsData, setTsData] = useState({
    time_column: "",
    group_column: "",
    frequency: "D", // Default Day
    forecast_horizon: 7,
  });

  // Load Datasets ตอนเปิด Dialog
  useEffect(() => {
    if (open) {
      ListDatasets()
        .then((res) => {
          const data = Array.isArray(res.data) ? res.data : res.data.data || [];
          setDatasets(data);
        })
        .catch(console.error);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.dataset_reference ||
      !formData.target_column
    )
      return;

    setIsLoading(true);
    try {
      await CreateApp({
        ...formData,
        id_column: formData.id_column || undefined,
        time_series_config: isTimeSeries
          ? {
              ...tsData,
              forecast_horizon: Number(tsData.forecast_horizon),
            }
          : undefined,
      });

      setOpen(false);
      resetForm();
      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Failed to create project");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      dataset_reference: "",
      target_column: "",
      id_column: "",
    });
    setIsTimeSeries(false);
    setTsData({
      time_column: "",
      group_column: "",
      frequency: "D",
      forecast_horizon: 7,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" /> New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-150 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Setup your machine learning experiment.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          {/* Basic Info */}
          <div className="grid gap-2">
            <Label>
              Project Name <span className="text-red-500">*</span>
            </Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g. Sales Prediction Q1"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="What are we solving?"
            />
          </div>

          <div className="grid gap-2">
            <Label>
              Dataset <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.dataset_reference}
              onValueChange={(val) =>
                setFormData({ ...formData, dataset_reference: val })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a dataset..." />
              </SelectTrigger>
              <SelectContent>
                {datasets.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>
                Target Column <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.target_column}
                onChange={(e) =>
                  setFormData({ ...formData, target_column: e.target.value })
                }
                placeholder="Column to predict"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>ID Column (Optional)</Label>
              <Input
                value={formData.id_column}
                onChange={(e) =>
                  setFormData({ ...formData, id_column: e.target.value })
                }
                placeholder="Unique ID column"
              />
            </div>
          </div>

          {/* Time Series Toggle */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Time Series Forecasting</Label>
              <p className="text-xs text-muted-foreground">
                Enable if your data has a time component.
              </p>
            </div>
            <Switch checked={isTimeSeries} onCheckedChange={setIsTimeSeries} />
          </div>

          {/* Time Series Config (Show if Toggled) */}
          {isTimeSeries && (
            <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-dashed">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Time Column</Label>
                  <Input
                    value={tsData.time_column}
                    onChange={(e) =>
                      setTsData({ ...tsData, time_column: e.target.value })
                    }
                    placeholder="Date/Time column"
                    required={isTimeSeries}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Group Column (Optional)</Label>
                  <Input
                    value={tsData.group_column}
                    onChange={(e) =>
                      setTsData({ ...tsData, group_column: e.target.value })
                    }
                    placeholder="e.g. store_id, region"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Frequency</Label>
                  <Select
                    value={tsData.frequency}
                    onValueChange={(val) =>
                      setTsData({ ...tsData, frequency: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="D">Daily</SelectItem>
                      <SelectItem value="W">Weekly</SelectItem>
                      <SelectItem value="M">Monthly</SelectItem>
                      <SelectItem value="H">Hourly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Forecast Horizon</Label>
                  <Input
                    type="number"
                    value={tsData.forecast_horizon}
                    onChange={(e) =>
                      setTsData({
                        ...tsData,
                        forecast_horizon: Number(e.target.value),
                      })
                    }
                    placeholder="Steps to predict"
                    required={isTimeSeries}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Create Project
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
