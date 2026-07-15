// features/cashbox/components/CashBoxChart.tsx
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { LineChart as ChartIcon, Loader2 } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCashBoxChartData } from "../hooks/useCashbox";

interface CashBoxChartProps {
  cashBoxId: number;
}

export default function CashBoxChart({ cashBoxId }: CashBoxChartProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [period, setPeriod] = useState<"month" | "week">("week");

  const { dateFrom, dateTo } = useMemo(() => {
    const to = new Date();
    const from = new Date();

    const dayCount = period === "month" ? 30 : 7;
    from.setDate(to.getDate() - dayCount);

    return {
      dateFrom: from.toISOString().split("T")[0],
      dateTo: to.toISOString().split("T")[0],
    };
  }, [period]);

  // جلب البيانات الحية للحركات المالية (تتحدث تلقائياً عند تغير تواريخ الـ period)
  const { data: transactions = [], isLoading } = useCashBoxChartData(
    dateFrom,
    dateTo,
    !!cashBoxId,
  );

  // تجميع البيانات وعمل تنظيف وملء للأيام الفارغة (Zero-Filling)
  const chartData = useMemo(() => {
    const groups: Record<
      string,
      { date: string; income: number; expense: number; rawDate: string }
    > = {};

    const start = new Date(dateFrom);
    const end = new Date(dateTo);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const rawDate = d.toISOString().split("T")[0];
      const formattedDate = d.toLocaleDateString(isArabic ? "ar-EG" : "en-US", {
        day: "numeric",
        month: "short",
      });

      groups[rawDate] = {
        date: formattedDate,
        income: 0,
        expense: 0,
        rawDate: rawDate,
      };
    }

    transactions.forEach((tx) => {
      const rawDate = tx.transaction_time.split("T")[0];

      if (groups[rawDate]) {
        const amount = Number(tx.amount) || 0;
        const isOut = tx.transaction_type.endsWith("_out");

        if (!isOut) {
          groups[rawDate].income += amount;
        } else {
          groups[rawDate].expense += amount;
        }
      }
    });

    return Object.values(groups).sort(
      (a, b) => new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime(),
    );
  }, [transactions, dateFrom, dateTo, isArabic]);

  const formatYAxis = (value: any) => {
    const num = Number(value);
    if (isNaN(num)) return String(value);
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}k`;
    return String(num);
  };

  return (
    <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4 relative min-h-87.5">
      <div
        className="flex items-center justify-between border-b border-border/40 pb-3"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <div className="flex items-center gap-2">
          <ChartIcon className="h-5 w-5 text-primary" />
          <div className="space-y-0.5 text-start">
            <h3 className="text-sm font-bold text-foreground">
              {t("cashbox.chart.title")}
            </h3>
            <p className="text-[11px] text-muted-foreground">
              {period === "month"
                ? t("cashbox.chart.subtitleMonth")
                : t("cashbox.chart.subtitleWeek")}
            </p>
          </div>
        </div>

        {/* قائمة الاختيار من شاد سي إن */}
        <div className="w-32.5">
          <Select
            value={period}
            onValueChange={(value: "month" | "week") => setPeriod(value)}
          >
            <SelectTrigger className="h-9 text-xs bg-background border-border text-foreground w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-emerald-500 border border-border text-foreground z-50 shadow-xl">
              <SelectItem
                value="month"
                className="focus:bg-muted focus:text-foreground cursor-pointer text-xs"
              >
                {t("cashbox.chart.periods.month")}
              </SelectItem>
              <SelectItem
                value="week"
                className="focus:bg-muted focus:text-foreground cursor-pointer text-xs"
              >
                {t("cashbox.chart.periods.week")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-card/60 backdrop-blur-[0.5px]">
          <div className="flex flex-col items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span>{t("cashbox.chart.loading")}</span>
          </div>
        </div>
      ) : chartData.length === 0 ? (
        <div className="h-72 flex items-center justify-center text-xs text-muted-foreground">
          {t("cashbox.chart.noData")}
        </div>
      ) : (
        <div className="w-full h-72 pt-4 font-mono text-xs" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--primary, #10b981)"
                    stopOpacity={0.25}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--primary, #10b981)"
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                className="stroke-border/50"
              />
              <XAxis
                dataKey="date"
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
                  textAlign: "left",
                }}
              />

              <Legend
                verticalAlign="top"
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: "11px" }}
              />

              <Area
                name={t("cashbox.chart.legend.income")}
                type="monotone"
                dataKey="income"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorIncome)"
                strokeWidth={2}
                dot={false}
              />

              <Area
                name={t("cashbox.chart.legend.expense")}
                type="monotone"
                dataKey="expense"
                stroke="#ef4444"
                fillOpacity={1}
                fill="url(#colorExpense)"
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
