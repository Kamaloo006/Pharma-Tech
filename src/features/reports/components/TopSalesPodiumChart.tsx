import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { PackageCheck } from "lucide-react";

interface PodiumProduct {
  display_name: string;
  total_units_sold: number;
  fillColor?: string;
}

interface TopSalesPodiumChartProps {
  data: PodiumProduct[];
  isLoading: boolean;
}

export function TopSalesPodiumChart({
  data,
  isLoading,
}: TopSalesPodiumChartProps) {
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
      data-aos="fade-up"
      className="border-border shadow-xs rounded-2xl relative overflow-hidden"
    >
      {isLoading && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary/20 overflow-hidden z-10">
          <div className="h-full bg-primary animate-pulse w-full" />
        </div>
      )}
      <CardHeader className="pb-2 border-b border-border/40 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <PackageCheck className="h-4 w-4 text-primary" />
          {isArabic
            ? "المنتجات الأكثر مبيعاً (حسب الوحدات)"
            : "Top Selling Products (By Units)"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-4">
        <div className="w-full h-80 font-mono text-xs" dir="ltr">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -15, bottom: 45 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                className="stroke-border/50"
              />
              <XAxis
                dataKey="display_name"
                tickLine={false}
                axisLine={false}
                interval={0}
                height={65}
                tick={({ x, y, payload }) => {
                  const rawText = payload.value || "";
                  const maxLength = 12;
                  const formattedText =
                    rawText.length > maxLength
                      ? `${rawText.substring(0, maxLength)}...`
                      : rawText;

                  const angle = isArabic ? 35 : -35;
                  const textAnchor = isArabic ? "start" : "end";

                  return (
                    <g transform={`translate(${x},${y})`}>
                      <text
                        x={isArabic ? 40 : 0}
                        y={isArabic ? -20 : 0}
                        dy={isArabic ? 50 : 10}
                        dx={isArabic ? 1 : 0}
                        textAnchor={textAnchor}
                        transform={`rotate(${angle})`}
                        className="fill-muted-foreground text-[10px] font-sans"
                        style={{
                          direction: isArabic ? "rtl" : "ltr",
                          unicodeBidi: "plaintext",
                        }}
                      >
                        {formattedText}
                      </text>
                    </g>
                  );
                }}
              />
              <YAxis
                tickFormatter={formatYAxis}
                tickLine={false}
                axisLine={false}
                className="fill-muted-foreground"
              />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.05)" }}
                contentStyle={{
                  backgroundColor: "var(--card, #0B132B)",
                  borderColor: "var(--border)",
                  borderRadius: "12px",
                  color: "var(--foreground)",
                }}
                formatter={(val: any, name: any) => {
                  if (name === "total_units_sold") {
                    return [
                      `${Number(val).toLocaleString()} ${isArabic ? "قطعة" : "units"}`,
                      isArabic ? "الوحدات المباعة" : "Sold Units",
                    ];
                  }
                  return [val, name];
                }}
              />
              <Bar
                dataKey="total_units_sold"
                fill="#10b981"
                radius={[6, 6, 0, 0]}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.fillColor || "var(--primary, #3b82f6)"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
