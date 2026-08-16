// features/dashboard/components/WeeklyRevenueChart.tsx
import { useTranslation } from "react-i18next";
import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useWeeklyRevenue } from "@/features/dashboard/hooks/useDashboardChart";

export function WeeklyRevenueChart() {
  const { t } = useTranslation();
  const { data: weeklyRevenueData, isLoading: isWeeklyRevenueLoading } =
    useWeeklyRevenue();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card
        data-aos="fade-right"
        className="lg:col-span-12 border-border/60 shadow-xs"
      >
        <CardHeader className="pb-2 border-b border-border/40">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            {t("dashboard.chart.weekly_revenue")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-6">
          {isWeeklyRevenueLoading ? (
            <Skeleton className="w-full h-64 rounded-xl bg-muted-foreground/15 animate-pulse" />
          ) : (
            <div className="w-full h-64 font-mono text-xs" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={weeklyRevenueData?.data}
                  margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--primary, #3b82f6)"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--primary, #3b82f6)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    className="stroke-border/40"
                  />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    className="fill-muted-foreground"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    className="fill-muted-foreground"
                    tickFormatter={(v) => `${v} ل.س`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card, #0f172a)",
                      borderColor: "var(--border)",
                      borderRadius: "10px",
                      color: "var(--foreground)",
                    }}
                    formatter={(val: any) => [
                      `${val?.toLocaleString() ?? 0} ل.س`,
                      t("dashboard.chart.tooltip_revenue"),
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--primary, #3b82f6)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#chartGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
