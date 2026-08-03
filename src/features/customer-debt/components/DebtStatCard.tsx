import React from "react";
import CountUpModule from "react-countup";
import { Card, CardContent } from "@/components/ui/card";

const CountUp = (CountUpModule as any).default || CountUpModule;

interface DebtStatCardProps {
  title: string;
  value: number;
  textColor: string;
  bgColor: string;
  iconColor: string;
  icon: React.ReactNode;
  formatCurrency: (amount: number) => string;
}

export const DebtStatCard = React.memo(
  ({
    title,
    value,
    textColor,
    bgColor,
    iconColor,
    icon,
    formatCurrency,
  }: DebtStatCardProps) => {
    return (
      <Card className="border-border/60 shadow-xs">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-muted-foreground">
              {title}
            </p>
            <p className={`text-lg font-bold font-mono ${textColor}`}>
              <CountUp
                end={value}
                duration={1.2}
                preserveValue={true}
                formattingFn={(val: number) => formatCurrency(val)}
              />
            </p>
          </div>
          <div
            className={`h-9 w-9 rounded-lg ${bgColor} flex items-center justify-center ${iconColor}`}
          >
            {icon}
          </div>
        </CardContent>
      </Card>
    );
  },
  (prevProps, nextProps) =>
    prevProps.value === nextProps.value && prevProps.title === nextProps.title,
);

DebtStatCard.displayName = "DebtStatCard";
