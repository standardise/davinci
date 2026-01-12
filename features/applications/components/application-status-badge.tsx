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
  WAITING: {
    label: "Waiting",
    color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    icon: Clock,
  },
  PROCESSING: {
    label: "Processing",
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    icon: Loader2,
  },
  ACTIVE: {
    label: "Active",
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    icon: CheckCircle2,
  },
  FAILED: {
    label: "Failed",
    color: "bg-red-500/10 text-red-600 border-red-500/20",
    icon: XCircle,
  },
};

export function ApplicationStatusBadge({ status }: { status: AppStatus }) {
  const config = statusConfig[status] || statusConfig.WAITING;
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={`gap-1.5 ${config.color} px-2 py-0.5`}>
      <Icon
        className={`w-3.5 h-3.5 ${status === "PROCESSING" ? "animate-spin" : ""}`}
      />
      {config.label}
    </Badge>
  );
}
