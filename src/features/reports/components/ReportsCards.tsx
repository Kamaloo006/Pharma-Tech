import { useTranslation } from "react-i18next";
import CountUpModule from "react-countup";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
  isSalesLoading?: boolean;
  isProfitLoading?: boolean;
  isInventoryValueLoading?: boolean;
}

export function ReportsCards({
  summary,
  profitSummary,
  inventoryValue,
  isSalesLoading = false,
  isProfitLoading = false,
  isInventoryValueLoading = false,
}: ReportsCardsProps) {
  const CountUp = (CountUpModule as any).default || CountUpModule;
  const { t } = useTranslation();

  const inventorySummary = inventoryValue?.summary;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Sales Card */}
      <Card
        data-aos="fade-up"
        data-aos-delay="50"
        className="border-border shadow-xs rounded-2xl relative overflow-hidden"
      >
        <CardContent className="p-4 flex flex-col justify-between h-full min-h-27.5">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-muted-foreground">
              {t("reports.cards.totalSales", "إجمالي المبيعات")}
            </span>
            <div className="p-2 bg-primary/10 rounded-xl text-primary">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            {isSalesLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-7 w-32 rounded-md bg-muted-foreground/20 animate-pulse" />
                <Skeleton className="h-4 w-24 rounded-md bg-muted-foreground/20 animate-pulse" />
              </div>
            ) : (
              <>
                <div className="text-xl font-bold font-mono">
                  <CountUp
                    end={summary?.total_revenue ?? 0}
                    duration={0.8}
                    separator=","
                  />{" "}
                  {t("common.syp", "SYP")}
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="flex items-center gap-0.5 text-[11px] font-semibold text-emerald-500">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    <span>12.5%</span>
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {t(
                      "reports.cards.vsPreviousPeriod",
                      "مقارنة بالفترة السابقة",
                    )}
                  </span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Net Profit Card */}
      <Card
        data-aos="fade-up"
        data-aos-delay="100"
        className="border-border shadow-xs rounded-2xl relative overflow-hidden"
      >
        <CardContent className="p-4 flex flex-col justify-between h-full min-h-27.5">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-muted-foreground">
              {t("reports.cards.netProfit", "صافي الأرباح")}
            </span>
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            {isProfitLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-7 w-32 rounded-md bg-muted-foreground/20 animate-pulse" />
                <Skeleton className="h-4 w-28 rounded-md bg-muted-foreground/20 animate-pulse" />
              </div>
            ) : (
              <>
                <div className="text-xl font-bold font-mono text-emerald-500">
                  <CountUp
                    end={profitSummary?.total_profit ?? 0}
                    duration={0.8}
                    separator=","
                  />{" "}
                  {t("common.syp", "SYP")}
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="flex items-center gap-0.5 text-[11px] font-semibold text-emerald-500">
                    <Percent className="h-3 w-3" />
                    <span>{profitSummary?.overall_margin ?? 0}%</span>
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {t(
                      "reports.cards.overallProfitMargin",
                      "هامش الربح الإجمالي",
                    )}
                  </span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Inventory Value Card */}
      <Card
        data-aos="fade-up"
        data-aos-delay="150"
        className="border-border shadow-xs rounded-2xl relative overflow-hidden"
      >
        <CardContent className="p-4 flex flex-col justify-between h-full min-h-27.5">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-muted-foreground">
              {t("reports.cards.inventoryValue", "قيمة المخزون")}
            </span>
            <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500">
              <Boxes className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            {isInventoryValueLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-7 w-32 rounded-md bg-muted-foreground/20 animate-pulse" />
                <Skeleton className="h-4 w-24 rounded-md bg-muted-foreground/20 animate-pulse" />
              </div>
            ) : (
              <>
                <div className="text-xl font-bold font-mono">
                  <CountUp
                    end={inventorySummary?.total_selling_value ?? 0}
                    duration={0.8}
                    separator=","
                  />{" "}
                  {t("common.syp", "SYP")}
                </div>
                <div className="text-[11px] text-muted-foreground mt-1 font-medium">
                  <span className="text-primary">
                    {inventorySummary?.overall_margin ?? 0}
                    {"% "}
                  </span>
                  {t("reports.cards.inventoryMargin", "هامش المخزون")}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Invoices Card */}
      <Card
        data-aos="fade-up"
        data-aos-delay="200"
        className="border-border shadow-xs rounded-2xl relative overflow-hidden"
      >
        <CardContent className="p-4 flex flex-col justify-between h-full min-h-27.5">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-muted-foreground">
              {t("reports.cards.invoices", "الفواتير")}
            </span>
            <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500">
              <Receipt className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            {isSalesLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-7 w-20 rounded-md bg-muted-foreground/20 animate-pulse" />
                <Skeleton className="h-4 w-24 rounded-md bg-muted-foreground/20 animate-pulse" />
              </div>
            ) : (
              <>
                <div className="text-xl font-bold font-mono">
                  {summary?.total_invoices ?? 0}
                </div>
                <div className="text-[11px] text-muted-foreground mt-1 font-medium">
                  {summary?.units_sold ?? 0}{" "}
                  {t("reports.cards.unitsSold", "قطعة مباعة")}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
