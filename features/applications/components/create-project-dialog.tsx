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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { Dataset } from "@/features/datasets/types";
import { ListDatasets, GetDataset } from "@/features/datasets/api";
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
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    dataset_id: "",
    target: "",
    visibility: "PRIVATE",
    colour: "blue", // default
    icon: "default", // default
  });

  // Load Datasets
  useEffect(() => {
    if (open) {
      ListDatasets()
        .then((res) => {
          // Handle both pagination structures
          const data = Array.isArray(res.data) ? res.data : (res.data as any).data || [];
          setDatasets(data);
        })
        .catch(console.error);
    }
  }, [open]);

  // Handle Dataset Selection
  const handleDatasetChange = async (datasetId: string) => {
    // 1. Update Form
    setFormData((prev) => ({
      ...prev,
      dataset_id: datasetId,
      target: "", // Reset columns when dataset changes
    }));
    setAvailableColumns([]); // Reset columns while loading

    // 2. Fetch selected dataset details to get columns
    try {
      const res = await GetDataset(datasetId);
      if (res.data && res.data.columns) {
        setAvailableColumns(
          res.data.columns.map((c) => ({ name: c.name, type: c.data_type }))
        );
      }
    } catch (error) {
      console.error("Failed to fetch dataset details", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.dataset_id ||
      !formData.target
    )
      return;

    setIsLoading(true);
    try {
      await CreateApp({
        name: formData.name,
        description: formData.description,
        dataset_id: formData.dataset_id,
        target: formData.target,
        visibility: formData.visibility as "PRIVATE" | "PUBLIC",
        colour: formData.colour,
        icon: formData.icon,
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
      dataset_id: "",
      target: "",
      visibility: "PRIVATE",
      colour: "blue",
      icon: "default",
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
              value={formData.dataset_id}
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
              <Select
                value={formData.target}
                onValueChange={(val) =>
                  setFormData({ ...formData, target: val })
                }
                disabled={!formData.dataset_id}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      formData.dataset_id
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
              <Label>Visibility</Label>
              <Select
                value={formData.visibility}
                onValueChange={(val) =>
                  setFormData({ ...formData, visibility: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PRIVATE">Private</SelectItem>
                  <SelectItem value="PUBLIC">Public</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

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
