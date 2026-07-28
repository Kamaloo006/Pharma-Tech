import React from "react";
import { type LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DetailCardProps {
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  action?: React.ReactNode;
}

export function DetailCard({
  title,
  icon: Icon,
  children,
  className,
  headerClassName,
  contentClassName,
  action,
}: DetailCardProps) {
  return (
    <Card
      className={cn(
        "border-border bg-card shadow-sm rounded-2xl overflow-hidden",
        className,
      )}
    >
      <CardHeader
        className={cn(
          "pb-3 border-b border-border/40 flex flex-row items-center justify-between space-y-0",
          headerClassName,
        )}
      >
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-primary" />}
          <span>{title}</span>
        </CardTitle>
        {action && <div>{action}</div>}
      </CardHeader>
      <CardContent className={cn("pt-5", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}
