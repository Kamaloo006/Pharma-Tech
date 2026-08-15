import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import AOS from "aos";
import "aos/dist/aos.css";
import { format, subDays, startOfMonth } from "date-fns";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  TrendingUp,
  Boxes,
  RefreshCw,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUp,
  ArrowDown,
  Receipt,
  Percent,
  PackageCheck,
} from "lucide-react";

import { useSalesReports } from "@/features/reports/hooks/useSalesReports";
import { useProfitReport } from "@/features/reports/hooks/useProfitReports";

import { useTopProductReports } from "@/features/reports/hooks/useTopProductReports";
import { type ReportPeriod } from "@/features/reports/types/SalesReports";
import CountUpModule from "react-countup";

export default function DashboardHome() {
  const CountUp = (CountUpModule as any).default || CountUpModule;

  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [period, setPeriod] = useState<ReportPeriod>("daily");

  const dateParams = useMemo(() => {
    const today = new Date();

    switch (period) {
      case "daily":
        return {
          date_from: format(today, "yyyy-MM-dd"),
          date_to: format(today, "yyyy-MM-dd"),
        };

      case "weekly":
        return {
          date_from: format(subDays(today, 6), "yyyy-MM-dd"),
          date_to: format(today, "yyyy-MM-dd"),
        };

      case "monthly":
        return {
          date_from: format(startOfMonth(today), "yyyy-MM-dd"),
          date_to: format(today, "yyyy-MM-dd"),
        };

      default:
        return {
          date_from: format(today, "yyyy-MM-dd"),
          date_to: format(today, "yyyy-MM-dd"),
        };
    }
  }, [period]);

  const {
    data: salesData,
    isLoading: isSalesLoading,
    isRefetching: isSalesRefetching,
    refetch: refetchSales,
  } = useSalesReports({
    period,
    date_from: dateParams.date_from,
    date_to: dateParams.date_to,
  });

  const {
    data: profitData,
    isLoading: isProfitLoading,
    isRefetching: isProfitRefetching,
    refetch: refetchProfit,
  } = useProfitReport({
    date_from: dateParams.date_from,
    date_to: dateParams.date_to,
  });

  const {
    data: topProductsData,
    isLoading: isTopProductsLoading,
    isRefetching: isTopProductsRefetching,
    refetch: refetchTopProducts,
  } = useTopProductReports({
    date_from: dateParams.date_from,
    date_to: dateParams.date_to,
    limit: 10,
  });

  const handleRefresh = () => {
    refetchSales();
    refetchProfit();
    refetchTopProducts();
  };

  const report = salesData?.data;
  const summary = report?.summary;
  const breakdown = report?.breakdown || [];

  const profitReport = profitData?.data;
  const profitSummary = profitReport?.summary;

  const rawProducts = topProductsData?.data?.products || [];

  const formattedProducts = useMemo(() => {
    return rawProducts.map((p) => {
      const unitProfit = p.selling_price - p.buying_price;
      const totalProfit = unitProfit * p.total_units_sold;
      const profitMargin =
        p.selling_price > 0
          ? ((unitProfit / p.selling_price) * 100).toFixed(1)
          : "0";

      return {
        ...p,
        display_name: isArabic ? p.ar_name : p.brand_name,
        total_profit: totalProfit,
        profit_margin: profitMargin,
      };
    });
  }, [rawProducts, isArabic]);

  const profitChartData = useMemo(() => {
    return formattedProducts.slice(0, 5);
  }, [formattedProducts]);

  const generatePodiumOrder = <T extends Record<string, any>>(
    data: T[],
    valueKey: keyof T,
  ) => {
    const sorted = [...data].sort(
      (a, b) => Number(b[valueKey]) - Number(a[valueKey]),
    );

    const ranked = sorted.map((item, index) => ({
      ...item,
      rank: index + 1,
      fillColor: RANK_COLORS[index + 1] || "var(--primary, #3b82f6)",
    }));

    const left: typeof ranked = [];
    const right: typeof ranked = [];

    ranked.forEach((item, index) => {
      if (index === 0) {
        return;
      }

      if (index % 2 === 0) {
        left.unshift(item);
      } else {
        right.push(item);
      }
    });

    return [...left, ranked[0], ...right].filter(Boolean);
  };

  const RANK_COLORS: Record<number, string> = {
    1: "#f59e0b", // المركز الأول (ذهبي)
    2: "#94a3b8", // المركز الثاني (فضي)
    3: "#d97706", // المركز الثالث (برونزي)
  };

  const topSalesChartData = useMemo(() => {
    if (!formattedProducts || formattedProducts.length === 0) return [];

    // يمكنك تغيير slice(0, 5) لأي عدد تريد أو إزالتها لعرض كل العناصر
    const topItems = formattedProducts.slice(0, 5);

    return generatePodiumOrder(topItems, "total_units_sold");
  }, [formattedProducts]);

  useEffect(() => {
    AOS.init({
      duration: 500,
      once: true,
      easing: "ease-out-cubic",
    });
  }, []);

  const isAnyRefetching =
    isSalesRefetching || isProfitRefetching || isTopProductsRefetching;

  const stockHealthData = [
    {
      label: isArabic ? "جيد" : "Healthy",
      count: 820,
      color: "#10b981",
      icon: CheckCircle2,
    },
    {
      label: isArabic ? "منخفض" : "Low",
      count: 43,
      color: "#eab308",
      icon: AlertTriangle,
    },
    {
      label: isArabic ? "حرج" : "Critical",
      count: 18,
      color: "#ef4444",
      icon: XCircle,
    },
    {
      label: isArabic ? "قريب الانتهاء" : "Expiring",
      count: 12,
      color: "#f97316",
      icon: Clock,
    },
  ];

  const supplierPriceAnalysis = [
    {
      product: "Augmentin 1g",
      supplier: "Ibn Sina",
      price: "24,500 SYP",
      change: "+4.2%",
      isUp: true,
    },
    {
      product: "Panadol Extra",
      supplier: "Unipharma",
      price: "8,200 SYP",
      change: "0.0%",
      isUp: false,
    },
    {
      product: "Catafast 50mg",
      supplier: "Alpha Pharma",
      price: "12,000 SYP",
      change: "-2.1%",
      isUp: false,
    },
    {
      product: "Omeprazole 20mg",
      supplier: "Thameco",
      price: "15,400 SYP",
      change: "+1.5%",
      isUp: true,
    },
  ];

  const recentActivities = [
    {
      type: "sale",
      title: isArabic ? "فاتورة مبيعات #1042" : "Sale Invoice #1042",
      time: "5m ago",
      amount: "+45,000 SYP",
    },
    {
      type: "return",
      title: isArabic ? "مرتجع مبيعات #803" : "Sales Return #803",
      time: "25m ago",
      amount: "-12,000 SYP",
    },
    {
      type: "sale",
      title: isArabic ? "فاتورة مبيعات #1041" : "Sale Invoice #1041",
      time: "1h ago",
      amount: "+118,000 SYP",
    },
    {
      type: "purchase",
      title: isArabic ? "فاتورة شراء #521" : "Purchase Invoice #521",
      time: "3h ago",
      amount: "-420,000 SYP",
    },
  ];

  const formatYAxis = (value: any) => {
    const num = Number(value);
    if (isNaN(num)) return String(value);
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}k`;
    return String(num);
  };

  return (
    <div className="space-y-6 overflow-hidden">
      <div
        data-aos="fade-down"
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-5 rounded-2xl border border-border shadow-xs"
      >
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            {isArabic ? "مرحباً بعودتك" : "Welcome back"}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isArabic
              ? "إليك ما يحدث في صيدليتك اليوم"
              : "Here's what's happening in your pharmacy"}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select
            value={period}
            onValueChange={(v: ReportPeriod) => setPeriod(v)}
          >
            <SelectTrigger className="h-9 text-xs w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border text-foreground z-50">
              <SelectItem value="daily" className="text-xs">
                {isArabic ? "يومي" : "Daily"}
              </SelectItem>
              <SelectItem value="weekly" className="text-xs">
                {isArabic ? "أسبوعي" : "Weekly"}
              </SelectItem>
              <SelectItem value="monthly" className="text-xs">
                {isArabic ? "شهري" : "Monthly"}
              </SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isAnyRefetching}
            className="h-9 gap-2 text-xs rounded-xl font-medium"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isAnyRefetching ? "animate-spin" : ""}`}
            />
            {isArabic ? "تحديث" : "Refresh"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          data-aos="fade-up"
          data-aos-delay="50"
          className="border-border shadow-xs rounded-2xl relative overflow-hidden"
        >
          {isSalesLoading && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-primary/20 overflow-hidden z-10">
              <div className="h-full bg-primary animate-pulse w-full" />
            </div>
          )}
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-muted-foreground">
                {isArabic ? "إجمالي المبيعات" : "Total Sales"}
              </span>
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <DollarSign className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xl font-bold font-mono">
                <CountUp
                  end={summary?.total_revenue ?? 0}
                  duration={0.8}
                  separator=","
                />{" "}
                SYP
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="flex items-center gap-0.5 text-[11px] font-semibold text-emerald-500">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  <span>12.5%</span>
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {isArabic ? "مقارنة بالفترة السابقة" : "vs previous period"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          data-aos="fade-up"
          data-aos-delay="100"
          className="border-border shadow-xs rounded-2xl relative overflow-hidden"
        >
          {isProfitLoading && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500/20 overflow-hidden z-10">
              <div className="h-full bg-emerald-500 animate-pulse w-full" />
            </div>
          )}
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-muted-foreground">
                {isArabic ? "صافي الأرباح" : "Net Profit"}
              </span>
              <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xl font-bold font-mono text-emerald-500">
                <CountUp
                  end={profitSummary?.total_profit ?? 0}
                  duration={0.8}
                  separator=","
                />{" "}
                SYP
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="flex items-center gap-0.5 text-[11px] font-semibold text-emerald-500">
                  <Percent className="h-3 w-3" />
                  <span>{profitSummary?.overall_margin ?? 0}%</span>
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {isArabic ? "هامش الربح الإجمالي" : "Overall Profit Margin"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          data-aos="fade-up"
          data-aos-delay="150"
          className="border-border shadow-xs rounded-2xl relative overflow-hidden"
        >
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-muted-foreground">
                {isArabic ? "قيمة المخزون" : "Inventory Value"}
              </span>
              <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500">
                <Boxes className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xl font-bold font-mono">485,000 SYP</div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="flex items-center gap-0.5 text-[11px] font-semibold text-emerald-500">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  <span>4.3%</span>
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {isArabic ? "مقارنة بالفترة السابقة" : "vs previous period"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          data-aos="fade-up"
          data-aos-delay="200"
          className="border-border shadow-xs rounded-2xl relative overflow-hidden"
        >
          {isSalesLoading && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-primary/20 overflow-hidden z-10">
              <div className="h-full bg-primary animate-pulse w-full" />
            </div>
          )}
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-muted-foreground">
                {isArabic ? "الفواتير" : "Invoices"}
              </span>
              <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500">
                <Receipt className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xl font-bold font-mono">
                {summary?.total_invoices ?? 0}
              </div>
              <div className="text-[11px] text-muted-foreground mt-1 font-medium">
                {summary?.units_sold ?? 0}{" "}
                {isArabic ? "قطعة مباعة" : "units sold"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card
          data-aos="fade-right"
          className="lg:col-span-2 border-border shadow-xs rounded-2xl relative overflow-hidden"
        >
          {isSalesLoading && (
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

        {/* مخطط أعلى المنتجات ربحية */}
        <Card
          data-aos="fade-left"
          className="lg:col-span-1 border-border shadow-xs rounded-2xl relative overflow-hidden"
        >
          {isTopProductsLoading && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500/20 overflow-hidden z-10">
              <div className="h-full bg-emerald-500 animate-pulse w-full" />
            </div>
          )}
          <CardHeader className="pb-2 border-b border-border/40">
            <CardTitle className="text-sm font-bold">
              {isArabic ? "أعلى المنتجات ربحية" : "Top Profit Products"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-4">
            <div className="w-full h-80 font-mono text-xs" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={profitChartData}
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
                      const isTruncated = rawText.length > maxLength;
                      const formattedText = isTruncated
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
                            className="fill-muted-foreground text-[10px] font-sans "
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
                      `${Number(val).toLocaleString()} ${isArabic ? `ل.س` : "SYP"}`,
                      isArabic ? "الربح" : "Profit",
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
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* جدول تفاصيل أرباح المنتجات */}
        <Card
          data-aos="fade-right"
          className="lg:col-span-2 border-border shadow-xs rounded-2xl relative overflow-hidden flex flex-col justify-between"
        >
          {isTopProductsLoading && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500/20 overflow-hidden z-10">
              <div className="h-full bg-emerald-500 animate-pulse w-full" />
            </div>
          )}

          <CardHeader className="pb-3 border-b border-border/40 shrink-0">
            <CardTitle className="text-sm font-bold">
              {isArabic
                ? "تفاصيل أرباح المنتجات"
                : "Product Profitability Details"}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0 flex-1">
            <div
              className={`overflow-x-auto ${
                formattedProducts.length > 5
                  ? "max-h-70 overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent"
                  : ""
              }`}
            >
              <table className="w-full text-xs text-left rtl:text-right relative border-collapse">
                <thead className="bg-muted/80 backdrop-blur-xs sticky top-0 z-10 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border/40">
                  <tr>
                    <th className="p-3 px-4 bg-muted/80">
                      {isArabic ? "المنتج" : "Product"}
                    </th>
                    <th className="p-3 px-4 bg-muted/80">
                      {isArabic ? "الوحدات المباعة" : "Sold Units"}
                    </th>
                    <th className="p-3 px-4 bg-muted/80">
                      {isArabic ? "الإيرادات" : "Revenue"}
                    </th>
                    <th className="p-3 px-4 bg-muted/80">
                      {isArabic ? "الربح" : "Profit"}
                    </th>
                    <th className="p-3 px-4 bg-muted/80">
                      {isArabic ? "هامش الربح" : "Margin"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30 font-medium">
                  {formattedProducts.map((p) => (
                    <tr
                      key={p.product_id}
                      className="hover:bg-muted/20 transition-colors"
                    >
                      <td className="p-3 px-4 font-semibold">
                        {isArabic ? p.ar_name : p.brand_name}
                        <span className="block text-[10px] text-muted-foreground font-normal">
                          {p.category}
                        </span>
                      </td>
                      <td className="p-3 px-4 font-mono text-white">
                        {p.total_units_sold}
                      </td>
                      <td className="p-3 px-4 font-mono">
                        {p.total_revenue.toLocaleString()} SYP
                      </td>
                      <td className="p-3 px-4 font-mono font-bold text-emerald-500">
                        {p.total_profit.toLocaleString()} SYP
                      </td>
                      <td className="p-3 px-4 font-mono">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500">
                          {p.profit_margin}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card
          data-aos="fade-left"
          className="lg:col-span-1 border-border shadow-xs rounded-2xl relative overflow-hidden"
        >
          <CardHeader className="pb-3 border-b border-border/40">
            <CardTitle className="text-sm font-bold">
              {isArabic ? "حالة المخزون" : "Stock Health"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-3">
            {stockHealthData.map((item, idx) => {
              const ItemIcon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/40"
                >
                  <div className="flex items-center gap-2.5">
                    <ItemIcon
                      className="h-4 w-4"
                      style={{ color: item.color }}
                    />
                    <span className="text-xs font-semibold">{item.label}</span>
                  </div>
                  <span className="font-mono font-bold text-sm">
                    {item.count}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* مخطط الأكثر مبيعاً الجديد بالكامل بدلاً من توزيع قيم المخزون */}
      <Card
        data-aos="fade-up"
        className="border-border shadow-xs rounded-2xl relative overflow-hidden"
      >
        {isTopProductsLoading && (
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
                data={topSalesChartData}
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
                  {topSalesChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fillColor} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card
          data-aos="fade-right"
          className="lg:col-span-2 border-border shadow-xs rounded-2xl relative overflow-hidden"
        >
          <CardHeader className="pb-3 border-b border-border/40">
            <CardTitle className="text-sm font-bold">
              {isArabic ? "تحليل أسعار الموردين" : "Supplier Price Analysis"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-xs text-left rtl:text-right">
              <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border/40">
                <tr>
                  <th className="p-3 px-4">
                    {isArabic ? "المنتج" : "Product"}
                  </th>
                  <th className="p-3 px-4">
                    {isArabic ? "المورد" : "Supplier"}
                  </th>
                  <th className="p-3 px-4">{isArabic ? "السعر" : "Price"}</th>
                  <th className="p-3 px-4">
                    {isArabic ? "التغير" : "Δ Change"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30 font-medium">
                {supplierPriceAnalysis.map((row, idx) => (
                  <tr key={idx} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3 px-4 font-semibold">{row.product}</td>
                    <td className="p-3 px-4 text-muted-foreground">
                      {row.supplier}
                    </td>
                    <td className="p-3 px-4 font-mono">{row.price}</td>
                    <td className="p-3 px-4">
                      <span
                        className={`inline-flex items-center gap-0.5 font-mono text-[11px] font-bold ${
                          row.isUp ? "text-destructive" : "text-emerald-500"
                        }`}
                      >
                        {row.isUp ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        )}
                        {row.change}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card
          data-aos="fade-left"
          className="lg:col-span-1 border-border shadow-xs rounded-2xl relative overflow-hidden"
        >
          <CardHeader className="pb-3 border-b border-border/40">
            <CardTitle className="text-sm font-bold">
              {isArabic ? "النشاط الأخير" : "Recent Activity"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {recentActivities.map((act, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-muted/30 border border-transparent hover:border-border/40 transition-colors"
              >
                <div>
                  <p className="text-xs font-semibold">{act.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {act.time}
                  </p>
                </div>
                <span
                  className={`font-mono text-xs font-bold ${
                    act.amount.startsWith("+")
                      ? "text-emerald-500"
                      : "text-muted-foreground"
                  }`}
                >
                  {act.amount}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
