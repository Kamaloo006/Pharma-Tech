import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, AlertOctagon, PackageCheck } from "lucide-react";
import { useStockHealthReport } from "../hooks/useStockHealthReports";

export function StockHealthCard() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const { data: stockHealthResponse, isLoading } = useStockHealthReport();
  const reportData = stockHealthResponse?.data;
  const expiringProducts = reportData?.expiring_soon || [];

  return (
    <Card
      data-aos="fade-left"
      className="lg:col-span-1 border-border shadow-xs rounded-2xl relative overflow-hidden flex flex-col justify-between"
    >
      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500/20 overflow-hidden z-10">
          <div className="h-full bg-amber-500 animate-pulse w-full" />
        </div>
      )}

      <CardHeader className="pb-3 border-b border-border/40 shrink-0 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <AlertOctagon className="h-4 w-4 text-amber-500" />
          <span>
            {isArabic ? "منتجات قريبة الانتهاء" : "Expiring Products"}
          </span>
        </CardTitle>
        <span className="text-[11px] font-semibold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full font-mono">
          {expiringProducts.length}
        </span>
      </CardHeader>

      <CardContent className="p-0 flex-1">
        {expiringProducts.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground text-xs flex flex-col items-center justify-center gap-2 h-full min-h-[180px]">
            <PackageCheck className="h-8 w-8 text-emerald-500/60" />
            <p>
              {isArabic
                ? "لا توجد منتجات قريبة من تاريخ الانتهاء"
                : "No products expiring soon"}
            </p>
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto divide-y divide-border/30 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
            {expiringProducts.map((product) => (
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
                    {isArabic ? "الكمية بالمخزن" : "Stock"}:{" "}
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
