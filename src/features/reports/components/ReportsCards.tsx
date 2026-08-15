import { useTranslation } from "react-i18next";
import CountUpModule from "react-countup";
import { Card, CardContent } from "@/components/ui/card";
import {
  DollarSign,
  TrendingUp,
  Boxes,
  Receipt,
  ArrowUpRight,
  Percent,
} from "lucide-react";
import type { InventoryValueResponse } from "../types/InventoryValueReports";
import type { Product } from "@/features/inventory/types/Product";
import type { SalesReportSummary } from "../types/SalesReports";
import type { ProfitSummary } from "../types/ProfitReports";

export interface InventorySummary {
  total_value_cost?: number;
  total_value_selling?: number;
  total_items?: number;
  total_selling_value?: number;
  overall_margin?: number;
}

export interface InventoryValueData {
  summary?: InventorySummary;
  products?: Product[];
}

interface ReportsCardsProps {
  summary?: SalesReportSummary;
  profitSummary?: ProfitSummary;
  inventoryValue?: InventoryValueResponse["data"];
  isSalesLoading: boolean;
  isProfitLoading: boolean;
  isInventoryValueLoading: boolean;
}

export function ReportsCards({
  summary,
  profitSummary,
  inventoryValue,
  isSalesLoading,
  isProfitLoading,
  isInventoryValueLoading,
}: ReportsCardsProps) {
  const CountUp = (CountUpModule as any).default || CountUpModule;
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const inventorySummary = inventoryValue?.summary;

  return (
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
        {isInventoryValueLoading && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500/20 overflow-hidden z-10">
            <div className="h-full bg-blue-500 animate-pulse w-full" />
          </div>
        )}
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
            <div className="text-xl font-bold font-mono">
              <CountUp
                end={inventorySummary?.total_selling_value ?? 0}
                duration={0.8}
                separator=","
              />{" "}
              SYP
            </div>
            <div className="text-[11px] text-muted-foreground mt-1 font-medium">
              <span className="text-primary">
                {inventorySummary?.overall_margin ?? 0}
                {"% "}
              </span>
              {isArabic ? "هامش المخزون" : "Inventory Margin"}
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
  );
}
