import type React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  trend?: "up" | "down";
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <Card
      className={`bg-card hover:shadow-md transition-shadow border border-border ${className}`}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-2">{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {change !== undefined && (
              <div className="flex items-center gap-1 mt-2">
                {trend === "up" ? (
                  <ArrowUp className="w-4 h-4 text-success" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-error" />
                )}
                <span
                  className={trend === "up" ? "text-success" : "text-error"}
                >
                  {Math.abs(change)}%
                </span>
              </div>
            )}
          </div>
          {icon && <div className="text-primary">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  );
}
