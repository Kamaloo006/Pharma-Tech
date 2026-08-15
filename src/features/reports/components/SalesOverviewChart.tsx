import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SalesOverviewChartProps {
  breakdown: Array<{ period_label: string; revenue: number }>;
  isLoading: boolean;
}

export function SalesOverviewChart({
  breakdown,
  isLoading,
}: SalesOverviewChartProps) {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const formatYAxis = (value: any) => {
    const num = Number(value);
    if (isNaN(num)) return String(value);
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}k`;
    return String(num);
  };

  return (
    <Card
      data-aos="fade-right"
      className="lg:col-span-2 border-border shadow-xs rounded-2xl relative overflow-hidden"
    >
      {isLoading && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary/20 overflow-hidden z-10">
          <div className="h-full bg-primary animate-pulse w-full" />
        </div>
      )}
      <CardHeader className="pb-2 border-b border-border/40 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-bold">
          {isArabic ? "نظرة عامة على المبيعات" : "Sales Overview"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-4">
        <div className="w-full h-72 font-mono text-xs" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={breakdown}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--primary, #10b981)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--primary, #10b981)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                className="stroke-border/50"
              />
              <XAxis
                dataKey="period_label"
                tickLine={false}
                axisLine={false}
                className="fill-muted-foreground"
              />
              <YAxis
                tickFormatter={formatYAxis}
                tickLine={false}
                axisLine={false}
                className="fill-muted-foreground"
              />
              <Tooltip
                cursor={{ className: "stroke-border/80" }}
                contentStyle={{
                  backgroundColor: "var(--card, #0B132B)",
                  borderColor: "var(--border)",
                  borderRadius: "12px",
                  color: "var(--foreground)",
                }}
                formatter={(val: any) => [
                  `${Number(val).toLocaleString()} SYP`,
                  isArabic ? "الإيرادات" : "Revenue",
                ]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--primary, #10b981)"
                fillOpacity={1}
                fill="url(#salesGrad)"
                strokeWidth={2}
                dot={{
                  r: breakdown?.length === 1 ? 6 : 0,
                  fill: "var(--primary, #10b981)",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
                activeDot={{ r: 7, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
