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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { Dataset } from "@/features/datasets/types";
import { ListDatasets } from "@/features/datasets/api"; // สมมติว่ามี GetDataset ถ้า List ไม่ส่ง schema มา
import { CreateApp } from "../api";

const ColumnItem = ({ name, type }: { name: string; type: string }) => (
  <div className="flex items-center justify-between w-full">
    <span>{name}</span>
    <span className="text-[10px] text-muted-foreground uppercase bg-muted px-1.5 py-0.5 rounded font-mono">
      {type}
    </span>
  </div>
);

export function CreateProjectDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Data
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [availableColumns, setAvailableColumns] = useState<
    { name: string; type: string }[]
  >([]); // 👈 เก็บ Columns ของ Dataset ที่เลือก

  // Form State
  const [isTimeSeries, setIsTimeSeries] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    dataset_reference: "",
    target_column: "",
    id_column: "",
  });

  const [tsData, setTsData] = useState({
    time_column: "",
    group_column: "",
    frequency: "D",
    forecast_horizon: 7,
  });

  // Load Datasets
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

  // Handle Dataset Selection
  const handleDatasetChange = (datasetId: string) => {
    // 1. Update Form
    setFormData((prev) => ({
      ...prev,
      dataset_reference: datasetId,
      target_column: "", // Reset columns when dataset changes
      id_column: "",
    }));
    setTsData((prev) => ({ ...prev, time_column: "", group_column: "" }));

    // 2. Find selected dataset to get columns
    const selected = datasets.find((d) => d.id === datasetId);
    if (selected && selected.schema) {
      setAvailableColumns(selected.schema);
    } else {
      setAvailableColumns([]);
    }
  };

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
    setAvailableColumns([]);
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
              onValueChange={handleDatasetChange}
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
              {/* เปลี่ยนเป็น Select */}
              <Select
                value={formData.target_column}
                onValueChange={(val) =>
                  setFormData({ ...formData, target_column: val })
                }
                disabled={!formData.dataset_reference}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      formData.dataset_reference
                        ? "Select column"
                        : "Select dataset first"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {availableColumns.map((col) => (
                    <SelectItem key={col.name} value={col.name}>
                      <ColumnItem name={col.name} type={col.type} />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>ID Column (Optional)</Label>
              {/* เปลี่ยนเป็น Select */}
              <Select
                value={formData.id_column}
                onValueChange={(val) =>
                  setFormData({ ...formData, id_column: val })
                }
                disabled={!formData.dataset_reference}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select column (Unique ID)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="none_id_col"
                    className="text-muted-foreground italic"
                  >
                    None
                  </SelectItem>
                  {availableColumns.map((col) => (
                    <SelectItem key={col.name} value={col.name}>
                      <ColumnItem name={col.name} type={col.type} />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Time Series Toggle */}
          <div className="flex items-center justify-between rounded-lg border p-4 bg-muted/10">
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
            <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-dashed animate-in slide-in-from-top-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Time Column</Label>
                  {/* เปลี่ยนเป็น Select */}
                  <Select
                    value={tsData.time_column}
                    onValueChange={(val) =>
                      setTsData({ ...tsData, time_column: val })
                    }
                    disabled={!formData.dataset_reference}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Date/Time column" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableColumns.map((col) => (
                        <SelectItem key={col.name} value={col.name}>
                          <ColumnItem name={col.name} type={col.type} />
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Group Column (Optional)</Label>
                  {/* เปลี่ยนเป็น Select */}
                  <Select
                    value={tsData.group_column}
                    onValueChange={(val) =>
                      setTsData({ ...tsData, group_column: val })
                    }
                    disabled={!formData.dataset_reference}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="e.g. store_id" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        value="none_grp_col"
                        className="text-muted-foreground italic"
                      >
                        None
                      </SelectItem>
                      {availableColumns.map((col) => (
                        <SelectItem key={col.name} value={col.name}>
                          <ColumnItem name={col.name} type={col.type} />
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
