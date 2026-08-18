import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { format, subDays } from "date-fns";

import { useAuth } from "@/context/AuthContext";
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
import { StockHealthCard } from "@/features/reports/components/StockHealthCard";
import { SupplierPriceAnalysisTable } from "@/features/reports/components/SupplierPriceAnalysisTable";
import { useSupplierPricesReport } from "@/features/reports/hooks/useSupplierPricesReport";

export default function Reports() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [period, setPeriod] = useState<ReportPeriod>("daily");

  const isAuthorized = user?.role === "pharmacy_owner";

  useEffect(() => {
    if (isAuthorized) {
      AOS.init({
        duration: 500,
        once: true,
        easing: "ease-out-cubic",
      });
    }
  }, [isAuthorized]);

  const dateParams = useMemo(() => {
    const today = new Date();

    switch (period) {
      case "daily":
        return {
          date_from: format(subDays(today, 6), "yyyy-MM-dd"),
          date_to: format(today, "yyyy-MM-dd"),
        };

      case "weekly":
        return {
          date_from: format(subDays(today, 27), "yyyy-MM-dd"),
          date_to: format(today, "yyyy-MM-dd"),
        };

      case "monthly":
        return {
          date_from: format(new Date(today.getFullYear(), 0, 1), "yyyy-MM-dd"),
          date_to: format(today, "yyyy-MM-dd"),
        };

      default:
        return {
          date_from: format(subDays(today, 6), "yyyy-MM-dd"),
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

  const {
    data: supplierPricesData,
    isLoading: isSupplierPricesLoading,
    isRefetching: isSupplierPricesRefetching,
    refetch: refetchSupplierPrices,
  } = useSupplierPricesReport({
    date_from: dateParams.date_from,
    date_to: dateParams.date_to,
  });

  const handleRefresh = () => {
    refetchSales();
    refetchProfit();
    refetchTopProducts();
    refetchInventoryValue();
    refetchSupplierPrices();
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

  const RANK_COLORS: Record<number, string> = {
    1: "#f59e0b",
    2: "#94a3b8",
    3: "#d97706",
  };

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

  const topSalesChartData = useMemo(() => {
    if (!formattedProducts || formattedProducts.length === 0) return [];

    const topItems = formattedProducts.slice(0, 5);

    return generatePodiumOrder(topItems, "total_units_sold");
  }, [formattedProducts]);

  const isAnyRefetching =
    isSalesRefetching ||
    isProfitRefetching ||
    isTopProductsRefetching ||
    isInventoryValueRefetching ||
    isSupplierPricesRefetching;

  const supplierProducts = supplierPricesData?.data?.products || [];

  if (isAuthLoading) {
    return null;
  }

  if (!isAuthorized) {
    return <Navigate to="/unauthorized" replace />;
  }

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

      <div className="grid grid-cols-1 gap-6">
        <SupplierPriceAnalysisTable
          products={supplierProducts}
          isLoading={isSupplierPricesLoading}
        />
      </div>
    </div>
  );
}
