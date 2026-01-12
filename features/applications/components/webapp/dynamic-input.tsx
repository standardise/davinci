/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { FeatureSchema } from "@/features/applications/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DynamicInputProps {
  feature: FeatureSchema;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

export const DynamicInput = ({
  feature,
  value,
  onChange,
  error,
}: DynamicInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val: any = e.target.value;
    if (feature.data_type === "INT") {
      val = parseInt(val);
      if (isNaN(val)) val = "";
    } else if (feature.data_type === "FLOAT") {
      val = parseFloat(val);
      if (isNaN(val)) val = "";
    }
    onChange(val);
  };

  // Helper to determine input type
  const getInputType = () => {
    switch (feature.data_type) {
      case "INT":
      case "FLOAT":
        return "number";
      case "DATE":
        return "date";
      default:
        return "text";
    }
  };

  // Special handling for Date with a nice picker
  if (feature.data_type === "DATE") {
    return (
      <div className="space-y-2">
        <Label htmlFor={feature.name} className="text-sm font-medium">
          {feature.name}
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal h-11 px-3",
                !value && "text-muted-foreground",
                error && "border-red-500"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {value ? (
                format(new Date(value), "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={value ? new Date(value) : undefined}
              onSelect={(date) => onChange(date?.toISOString())}
              autoFocus
            />
          </PopoverContent>
        </Popover>
        {feature.description && (
          <p className="text-[11px] text-muted-foreground">
            {feature.description}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={feature.name} className="text-sm font-medium capitalize">
        {feature.name.replace(/_/g, " ")}
      </Label>
      <Input
        id={feature.name}
        type={getInputType()}
        placeholder={
          feature.example ? `e.g. ${feature.example}` : `Enter ${feature.name}`
        }
        value={value ?? ""}
        onChange={handleChange}
        className={cn(
          "h-11 px-3 bg-background transition-all focus:ring-2 focus:ring-primary/20",
          error && "border-red-500 focus:ring-red-500/20"
        )}
        step={feature.data_type === "FLOAT" ? "any" : "1"}
      />
      {feature.description && (
        <p className="text-[11px] text-muted-foreground">
          {feature.description}
        </p>
      )}
      {error && <p className="text-[11px] text-red-500">{error}</p>}
    </div>
  );
};
