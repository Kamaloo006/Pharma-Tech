import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, AlertOctagon, PackageCheck } from "lucide-react";
import { useStockHealthReport } from "../hooks/useStockHealthReports";

export function StockHealthCard() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const { data: stockHealthResponse, isLoading } = useStockHealthReport();

  const reportData = stockHealthResponse?.data;
  const expiringProducts = reportData?.expiring_soon || [];

  return (
    <Card
      data-aos="fade-left"
      className="lg:col-span-1 border-border shadow-xs rounded-2xl relative overflow-hidden flex flex-col justify-between"
    >
      <CardHeader className="pb-3 border-b border-border/40 shrink-0 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <AlertOctagon className="h-4 w-4 text-amber-500" />

          <span>{t("reports.expiringProducts")}</span>
        </CardTitle>

        {isLoading ? (
          <Skeleton className="h-5 w-8 rounded-full bg-muted-foreground/20 animate-pulse" />
        ) : (
          <span className="text-[11px] font-semibold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full font-mono">
            {expiringProducts.length}
          </span>
        )}
      </CardHeader>

      <CardContent className="p-0 flex-1">
        {isLoading ? (
          <div className="divide-y divide-border/30">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="p-3 px-4 flex items-center justify-between animate-pulse"
              >
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32 bg-muted-foreground/20" />
                  <Skeleton className="h-3 w-20 bg-muted-foreground/20" />
                </div>

                <div className="space-y-1 text-right rtl:text-left">
                  <Skeleton className="h-4 w-12 ms-auto bg-muted-foreground/20" />
                  <Skeleton className="h-3 w-16 ms-auto bg-muted-foreground/20" />
                </div>
              </div>
            ))}
          </div>
        ) : expiringProducts.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground text-xs flex flex-col items-center justify-center gap-2 h-full min-h-45">
            <PackageCheck className="h-8 w-8 text-emerald-500/60" />

            <p>{t("reports.noExpiringProducts")}</p>
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto divide-y divide-border/30 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
            {expiringProducts.map((product: any) => (
              <div
                key={product.product_id}
                className="p-3 px-4 flex items-center justify-between hover:bg-muted/20 transition-colors"
              >
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-foreground">
                    {isArabic ? product.ar_name : product.brand_name}
                  </p>

                  <p className="text-[10px] text-muted-foreground">
                    {product.category}
                  </p>
                </div>

                <div className="text-right rtl:text-left space-y-0.5">
                  <div className="flex items-center gap-1 text-xs font-bold font-mono text-amber-500 justify-end rtl:justify-start">
                    <Clock className="h-3 w-3" />

                    <span>
                      {product.days_until_expiry ?? product.current_stock}
                    </span>
                  </div>

                  <p className="text-[10px] text-muted-foreground">
                    {t("reports.stock")}:{" "}
                    <span className="font-mono font-medium text-foreground">
                      {product.current_stock}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
