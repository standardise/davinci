"use client";

import { useState } from "react";
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
import { UploadCloud, Loader2, FileSpreadsheet } from "lucide-react";
import { UploadDataset } from "../api";

interface Props {
  onSuccess: () => void;
}

export function UploadDatasetDialog({ onSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      if (!name) {
        setName(selectedFile.name.split(".").slice(0, -1).join("."));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name) return;

    setIsLoading(true);
    try {
      await UploadDataset({ name, description: desc, file });
      setOpen(false);
      setName("");
      setDesc("");
      setFile(null);
      onSuccess();
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload dataset");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 shadow-lg shadow-primary/20">
          <UploadCloud className="w-4 h-4" /> Upload Dataset
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Dataset</DialogTitle>
          <DialogDescription>
            Upload CSV or Parquet files to create a new dataset.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Customer Churn Data"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="desc">Description</Label>
            <Textarea
              id="desc"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Describe your dataset..."
            />
          </div>

          <div className="grid gap-2">
            <Label>File (CSV, Parquet)</Label>
            <div className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer relative">
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
                onChange={handleFileChange}
                accept=".csv,.parquet"
              />
              {file ? (
                <div className="flex items-center gap-2 text-primary">
                  <FileSpreadsheet className="w-6 h-6" />
                  <span className="font-medium text-sm truncate max-w-50">
                    {file.name}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                  <UploadCloud className="w-8 h-8 mb-2" />
                  <span className="text-sm font-medium">Click to browse</span>
                  <span className="text-xs">Max 100MB</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button type="submit" disabled={isLoading || !file}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                </>
              ) : (
                "Upload"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
