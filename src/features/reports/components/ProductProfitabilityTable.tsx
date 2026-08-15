import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface FormattedProduct {
  product_id: string | number;
  ar_name: string;
  brand_name: string;
  category?: string;
  total_units_sold: number;
  total_revenue: number;
  total_profit: number;
  profit_margin: string;
}

interface ProductProfitabilityTableProps {
  products?: FormattedProduct[];
  isLoading: boolean;
}

export function ProductProfitabilityTable({
  products = [],
  isLoading,
}: ProductProfitabilityTableProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <Card
      data-aos="fade-right"
      className="lg:col-span-2 border-border shadow-xs rounded-2xl relative overflow-hidden flex flex-col justify-between"
    >
      <CardHeader className="pb-3 border-b border-border/40 shrink-0">
        <CardTitle className="text-sm font-bold">
          {t("reports.productProfitabilityDetails")}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 flex-1">
        <div
          className={`overflow-x-auto ${
            products.length > 5
              ? "max-h-70 overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent"
              : ""
          }`}
        >
          <table className="w-full text-xs text-left rtl:text-right relative border-collapse">
            <thead className="bg-muted/80 backdrop-blur-xs sticky top-0 z-10 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border/40">
              <tr>
                <th className="p-3 px-4 bg-muted/80">{t("reports.product")}</th>

                <th className="p-3 px-4 bg-muted/80">
                  {t("reports.soldUnits")}
                </th>

                <th className="p-3 px-4 bg-muted/80">{t("reports.revenue")}</th>

                <th className="p-3 px-4 bg-muted/80">{t("reports.profit")}</th>

                <th className="p-3 px-4 bg-muted/80">{t("reports.margin")}</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/30 font-medium">
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="p-3 px-4">
                        <Skeleton className="h-4 w-28 mb-1 bg-muted-foreground/20" />
                        <Skeleton className="h-3 w-16 bg-muted-foreground/20" />
                      </td>

                      <td className="p-3 px-4">
                        <Skeleton className="h-4 w-12 bg-muted-foreground/20" />
                      </td>

                      <td className="p-3 px-4">
                        <Skeleton className="h-4 w-20 bg-muted-foreground/20" />
                      </td>

                      <td className="p-3 px-4">
                        <Skeleton className="h-4 w-20 bg-muted-foreground/20" />
                      </td>

                      <td className="p-3 px-4">
                        <Skeleton className="h-5 w-12 rounded-full bg-muted-foreground/20" />
                      </td>
                    </tr>
                  ))
                : products.map((p) => (
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

                      <td className="p-3 px-4 font-mono text-foreground">
                        {p.total_units_sold}
                      </td>

                      <td className="p-3 px-4 font-mono">
                        {p.total_revenue?.toLocaleString()} {t("common.syp")}
                      </td>

                      <td className="p-3 px-4 font-mono font-bold text-emerald-500">
                        {p.total_profit?.toLocaleString()} {t("common.syp")}
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
  );
}
