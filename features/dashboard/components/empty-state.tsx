import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  href: string;
  actionText: string;
}

export function EmptyState({
  title,
  description,
  href,
  actionText,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 border border-dashed border-border rounded-3xl bg-muted/5 text-center h-75">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
        <LayoutGrid className="w-6 h-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs mt-1 mb-6">
        {description}
      </p>
      <Button asChild variant="outline" size="sm">
        <Link href={href}>{actionText}</Link>
      </Button>
    </div>
  );
}
