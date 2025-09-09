import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  variant?: "default" | "primary" | "warning" | "success";
}

const variants = {
  default: {
    card: "expense-card",
    icon: "text-muted-foreground",
    value: "text-foreground"
  },
  primary: {
    card: "expense-card border-primary/20",
    icon: "text-primary",
    value: "text-foreground"
  },
  warning: {
    card: "expense-card border-accent-warning/20",
    icon: "text-accent-warning",
    value: "text-foreground"
  },
  success: {
    card: "expense-card border-status-approved/20",
    icon: "text-status-approved",
    value: "text-foreground"
  }
};

export const KPICard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  variant = "default" 
}: KPICardProps) => {
  const styles = variants[variant];

  return (
    <Card className={cn(styles.card, "transition-all duration-200 hover:scale-[1.02]")}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={cn("h-5 w-5", styles.icon)} />
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className={cn("text-2xl font-bold", styles.value)}>
            {value}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground">
              {subtitle}
            </p>
          )}
          {trend && (
            <div className="flex items-center space-x-2">
              <Badge 
                variant={trend.isPositive ? "default" : "destructive"}
                className="text-xs"
              >
                {trend.isPositive ? "+" : ""}{trend.value}%
              </Badge>
              <span className="text-xs text-muted-foreground">
                {trend.label}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};