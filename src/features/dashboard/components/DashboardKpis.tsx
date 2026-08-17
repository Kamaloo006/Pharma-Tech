import { useTranslation } from "react-i18next";
import CountUp from "react-countup";
import {
  TrendingUp,
  Receipt,
  DollarSign,
  Package,
  AlertTriangle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardHeader } from "@/features/dashboard/hooks/useDashboardHeader";
import { useDashboardCards } from "@/features/dashboard/hooks/useDashboardCards";

// معالجة مشكلة Interop لـ react-countup مع Vite/ESM
const SafeCountUp = (CountUp as any).default || CountUp;

function KpiSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-3 w-20 bg-muted-foreground/15 animate-pulse" />
      <Skeleton className="h-7 w-28 bg-muted-foreground/15 animate-pulse" />
    </div>
  );
}

export function DashboardKpis() {
  const { t } = useTranslation();
  const { data: headerData, isLoading: isHeaderLoading } = useDashboardHeader();
  const { data: cardsData, isLoading: isCardsLoading } = useDashboardCards();

  return (
    <div className="space-y-6">
      {/* Today Section */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {t("dashboard.sections.today")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card
            data-aos="fade-up"
            data-aos-delay="100"
            className="border-border/60 shadow-xs"
          >
            <CardContent className="p-4">
              {isHeaderLoading ? (
                <KpiSkeleton />
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-xs font-semibold">
                      {t("dashboard.kpis.revenue")}
                    </span>
                    <DollarSign className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold font-mono">
                      SYP{" "}
                      <SafeCountUp
                        end={headerData?.today_revenue ?? 0}
                        decimals={2}
                        separator=","
                      />
                    </span>
                    <span
                      className={`inline-flex items-center text-xs font-semibold ${
                        (headerData?.today_revenue_change_percent ?? 0) >= 0
                          ? "text-emerald-500"
                          : "text-rose-500"
                      }`}
                    >
                      {(headerData?.today_revenue_change_percent ?? 0) >= 0 ? (
                        <ArrowUpRight className="h-3 w-3 mr-0.5" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 mr-0.5" />
                      )}
                      <SafeCountUp
                        end={Math.abs(
                          headerData?.today_revenue_change_percent ?? 0,
                        )}
                        decimals={1}
                      />
                      %
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card
            data-aos="fade-up"
            data-aos-delay="150"
            className="border-border/60 shadow-xs"
          >
            <CardContent className="p-4">
              {isHeaderLoading ? (
                <KpiSkeleton />
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-xs font-semibold">
                      {t("dashboard.kpis.invoices")}
                    </span>
                    <Receipt className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold font-mono">
                      <SafeCountUp
                        end={headerData?.today_invoice_count ?? 0}
                        separator=","
                      />
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card
            data-aos="fade-up"
            data-aos-delay="200"
            className="border-border/60 shadow-xs"
          >
            <CardContent className="p-4">
              {isHeaderLoading ? (
                <KpiSkeleton />
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-xs font-semibold">
                      {t("dashboard.kpis.avg_invoice")}
                    </span>
                    <TrendingUp className="h-4 w-4 text-indigo-500" />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold font-mono">
                      SYP{" "}
                      <SafeCountUp
                        end={headerData?.today_avg_invoice ?? 0}
                        decimals={2}
                        separator=","
                      />
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card
            data-aos="fade-up"
            data-aos-delay="250"
            className="border-border/60 shadow-xs"
          >
            <CardContent className="p-4">
              {isHeaderLoading ? (
                <KpiSkeleton />
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-xs font-semibold">
                      {t("dashboard.kpis.units_sold")}
                    </span>
                    <Package className="h-4 w-4 text-amber-500" />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold font-mono">
                      <SafeCountUp
                        end={headerData?.today_units_sold ?? 0}
                        separator=","
                      />
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* General Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          data-aos="fade-up"
          data-aos-delay="300"
          className="border-border/60 shadow-xs"
        >
          <CardContent className="p-4">
            {isCardsLoading ? (
              <KpiSkeleton />
            ) : (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-muted-foreground">
                  {t("dashboard.kpis.yesterday_revenue")}
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-bold font-mono">
                    SYP{" "}
                    <SafeCountUp
                      end={cardsData?.yesterday_revenue ?? 0}
                      decimals={2}
                      separator=","
                    />
                  </span>
                  <span
                    className={`inline-flex items-center text-xs font-semibold ${
                      (cardsData?.yesterday_week_change_percent ?? 0) >= 0
                        ? "text-emerald-500"
                        : "text-rose-500"
                    }`}
                  >
                    {(cardsData?.yesterday_week_change_percent ?? 0) >= 0 ? (
                      <ArrowUpRight className="h-3 w-3 mr-0.5" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-0.5" />
                    )}
                    <SafeCountUp
                      end={Math.abs(
                        cardsData?.yesterday_week_change_percent ?? 0,
                      )}
                      decimals={1}
                    />
                    %
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card
          data-aos="fade-up"
          data-aos-delay="350"
          className="border-border/60 shadow-xs"
        >
          <CardContent className="p-4">
            {isCardsLoading ? (
              <KpiSkeleton />
            ) : (
              <div className="space-y-1">
                <span className="text-xs font-semibold text-muted-foreground">
                  {t("dashboard.kpis.products")}
                </span>
                <div className="text-xl font-bold font-mono">
                  <SafeCountUp
                    end={cardsData?.total_products ?? 0}
                    separator=","
                  />
                </div>
                <p className="text-[11px] text-emerald-500 font-medium">
                  {t("dashboard.kpis.in_stock", {
                    count: cardsData?.in_stock_products?.toLocaleString() ?? 0,
                  })}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card
          data-aos="fade-up"
          data-aos-delay="400"
          className="border-border/60 shadow-xs"
        >
          <CardContent className="p-4">
            {isCardsLoading ? (
              <KpiSkeleton />
            ) : (
              <div className="space-y-1">
                <span className="text-xs font-semibold text-muted-foreground">
                  {t("dashboard.kpis.low_stock")}
                </span>
                <div className="flex items-center gap-1.5 text-xl font-bold font-mono text-amber-500">
                  <AlertTriangle className="h-4 w-4" />{" "}
                  <SafeCountUp
                    end={cardsData?.stock_alerts_count ?? 0}
                    separator=","
                  />
                </div>
                <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1">
                  <XCircle className="h-3 w-3" />{" "}
                  {t("dashboard.kpis.out_of_stock", {
                    count: cardsData?.out_of_stock_count ?? 0,
                  })}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card
          data-aos="fade-up"
          data-aos-delay="450"
          className="border-border/60 shadow-xs"
        >
          <CardContent className="p-4">
            {isCardsLoading ? (
              <KpiSkeleton />
            ) : (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-muted-foreground">
                  {t("dashboard.kpis.sales")}
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-bold font-mono">
                    <SafeCountUp
                      end={cardsData?.today_sales_count ?? 0}
                      separator=","
                    />
                  </span>
                  <span
                    className={`inline-flex items-center text-xs font-semibold ${
                      (cardsData?.today_sales_change_percent ?? 0) >= 0
                        ? "text-emerald-500"
                        : "text-rose-500"
                    }`}
                  >
                    {(cardsData?.today_sales_change_percent ?? 0) >= 0 ? (
                      <ArrowUpRight className="h-3 w-3 mr-0.5" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-0.5" />
                    )}
                    <SafeCountUp
                      end={Math.abs(cardsData?.today_sales_change_percent ?? 0)}
                      decimals={1}
                    />
                    %
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
