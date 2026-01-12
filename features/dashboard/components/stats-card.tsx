import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description: string;
  href: string;
  valueClassName?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  href,
  valueClassName,
}: StatsCardProps) {
  return (
    <Link href={href} className="block group">
      <Card className="hover:shadow-xl transition-all duration-500 border-border/40 overflow-hidden relative bg-card/50 backdrop-blur-xl hover:scale-[1.02]">
        <div className="absolute right-0 top-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
          <Icon className="w-24 h-24" />
        </div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${
              valueClassName || "text-foreground"
            }`}
          >
            {value}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
