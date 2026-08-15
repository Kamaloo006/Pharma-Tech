import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import AOS from "aos";
import "aos/dist/aos.css";
import { format, subDays, startOfMonth } from "date-fns";

import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

import { useSalesReports } from "@/features/reports/hooks/useSalesReports";
import { useProfitReport } from "@/features/reports/hooks/useProfitReports";
import { useTopProductReports } from "@/features/reports/hooks/useTopProductReports";
import { useInventoryValue } from "@/features/reports/hooks/useInventoryValueReports";
import { type ReportPeriod } from "@/features/reports/types/SalesReports";
import { ReportsHeader } from "@/features/reports/components/ReportsHeader";
import { ReportsCards } from "@/features/reports/components/ReportsCards";
import { SalesOverviewChart } from "@/features/reports/components/SalesOverviewChart";
import { InventoryTable } from "@/features/reports/components/InventoryTable";
import { TopProfitChart } from "@/features/reports/components/TopProfitChart";
import { ProductProfitabilityTable } from "@/features/reports/components/ProductProfitabilityTable";
import { TopSalesPodiumChart } from "@/features/reports/components/TopSalesPodiumChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StockHealthCard } from "@/features/reports/components/StockHealthCard";

export default function Reports() {
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

  const {
    data: inventoryValueData,
    isLoading: isInventoryValueLoading,
    isRefetching: isInventoryValueRefetching,
    refetch: refetchInventoryValue,
  } = useInventoryValue();

  const handleRefresh = () => {
    refetchSales();
    refetchProfit();
    refetchTopProducts();
    refetchInventoryValue();
  };

  const report = salesData?.data;
  const summary = report?.summary;
  const breakdown = report?.breakdown || [];

  const profitReport = profitData?.data;
  const profitSummary = profitReport?.summary;

  const inventoryValue = inventoryValueData?.data;
  const rawInventoryProducts = inventoryValueData?.data?.products || [];

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
    1: "#f59e0b",
    2: "#94a3b8",
    3: "#d97706",
  };

  const topSalesChartData = useMemo(() => {
    if (!formattedProducts || formattedProducts.length === 0) return [];

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
    isSalesRefetching ||
    isProfitRefetching ||
    isTopProductsRefetching ||
    isInventoryValueRefetching;

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

  return (
    <div className="space-y-6 overflow-hidden">
      <ReportsHeader
        period={period}
        setPeriod={setPeriod}
        onRefresh={handleRefresh}
        isRefreshing={isAnyRefetching}
      />

      <ReportsCards
        summary={summary}
        profitSummary={profitSummary}
        inventoryValue={inventoryValue}
        isSalesLoading={isSalesLoading}
        isProfitLoading={isProfitLoading}
        isInventoryValueLoading={isInventoryValueLoading}
      />

      <InventoryTable
        products={rawInventoryProducts}
        isLoading={isInventoryValueLoading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SalesOverviewChart breakdown={breakdown} isLoading={isSalesLoading} />
        <TopProfitChart
          data={profitChartData}
          isLoading={isTopProductsLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ProductProfitabilityTable
          products={formattedProducts}
          isLoading={isTopProductsLoading}
        />
        <StockHealthCard />
      </div>

      <TopSalesPodiumChart
        data={topSalesChartData}
        isLoading={isTopProductsLoading}
      />

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
