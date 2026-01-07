import { Badge } from "@/components/ui/badge";
import { AppStatus } from "../types";
import { Loader2, CheckCircle2, XCircle, Clock, FileEdit } from "lucide-react";

const statusConfig: Record<
  AppStatus,
  {
    label: string;
    color: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  DRAFT: {
    label: "Draft",
    color: "bg-slate-500/10 text-slate-500 border-slate-500/20",
    icon: FileEdit,
  },
  QUEUED: {
    label: "Queued",
    color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    icon: Clock,
  },
  TRAINING: {
    label: "Training",
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    icon: Loader2,
  },
  COMPLETED: {
    label: "Ready",
    color: "bg-green-500/10 text-green-500 border-green-500/20",
    icon: CheckCircle2,
  },
  FAILED: {
    label: "Failed",
    color: "bg-red-500/10 text-red-500 border-red-500/20",
    icon: XCircle,
  },
};

export function ApplicationStatusBadge({ status }: { status: AppStatus }) {
  const config = statusConfig[status] || statusConfig.DRAFT;
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={`gap-1.5 ${config.color} px-2 py-0.5`}>
      <Icon
        className={`w-3.5 h-3.5 ${status === "TRAINING" ? "animate-spin" : ""}`}
      />
      {config.label}
    </Badge>
  );
}
