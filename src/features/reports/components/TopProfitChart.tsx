import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TopProfitChartProps {
  data: Array<{ display_name: string; total_profit: number }>;
  isLoading?: boolean;
}

export function TopProfitChart({
  data = [],
  isLoading = false,
}: TopProfitChartProps) {
  const { t, i18n } = useTranslation();
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
      data-aos="fade-left"
      className="lg:col-span-1 border-border shadow-xs rounded-2xl relative overflow-hidden"
    >
      <CardHeader className="pb-2 border-b border-border/40">
        <CardTitle className="text-sm font-bold">
          {t("reports.topProfitProducts")}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 pt-4">
        {isLoading ? (
          <div className="w-full h-80 flex flex-col justify-end p-2 gap-3">
            <div className="flex items-end justify-between gap-3 h-[75%] px-2">
              <Skeleton className="w-full h-[60%] rounded-t-md bg-muted-foreground/20 animate-pulse" />
              <Skeleton className="w-full h-[85%] rounded-t-md bg-muted-foreground/20 animate-pulse" />
              <Skeleton className="w-full h-[40%] rounded-t-md bg-muted-foreground/20 animate-pulse" />
              <Skeleton className="w-full h-[70%] rounded-t-md bg-muted-foreground/20 animate-pulse" />
              <Skeleton className="w-full h-[50%] rounded-t-md bg-muted-foreground/20 animate-pulse" />
            </div>

            <Skeleton className="h-4 w-full rounded-md bg-muted-foreground/20 animate-pulse" />
          </div>
        ) : (
          <div className="w-full h-80 font-mono text-xs" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
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
                    const maxLength = 13;

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
                  labelFormatter={(label) => label}
                  formatter={(val: any) => [
                    `${Number(val).toLocaleString()} ${t("common.syp")}`,
                    t("reports.profit"),
                  ]}
                />

                <Bar
                  dataKey="total_profit"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
