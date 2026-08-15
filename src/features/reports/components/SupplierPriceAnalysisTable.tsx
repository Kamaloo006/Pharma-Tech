import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Purchase {
  supplier_name?: string;
}

interface SupplierProduct {
  product_id: string | number;
  ar_name: string;
  brand_name: string;
  avg_cost: number;
  min_cost: number;
  max_cost: number;
  purchases: Purchase[];
}

interface SupplierPriceAnalysisTableProps {
  products?: SupplierProduct[];
  isLoading: boolean;
}

export function SupplierPriceAnalysisTable({
  products = [],
  isLoading,
}: SupplierPriceAnalysisTableProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <Card
      data-aos="fade-right"
      className="lg:col-span-2 border-border shadow-xs rounded-2xl relative overflow-hidden"
    >
      <CardHeader className="pb-3 border-b border-border/40">
        <CardTitle className="text-sm font-bold">
          {t("reports.supplierPriceAnalysis")}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider">
            <TableRow className="border-b border-border/40 hover:bg-transparent">
              <TableHead
                className={`p-3 px-4 h-auto text-muted-foreground font-medium ${
                  isArabic ? "text-right" : ""
                }`}
              >
                {t("reports.product")}
              </TableHead>

              <TableHead
                className={`p-3 px-4 h-auto text-muted-foreground font-medium ${
                  isArabic ? "text-right" : ""
                }`}
              >
                {t("reports.supplier")}
              </TableHead>

              <TableHead
                className={`p-3 px-4 h-auto text-muted-foreground font-medium ${
                  isArabic ? "text-right" : ""
                }`}
              >
                {t("reports.price")}
              </TableHead>

              <TableHead
                className={`p-3 px-4 h-auto text-muted-foreground font-medium ${
                  isArabic ? "text-right" : ""
                }`}
              >
                {t("reports.change")}
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-border/30 font-medium text-xs">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="animate-pulse">
                  <TableCell className="p-3 px-4">
                    <Skeleton className="h-4 w-28 bg-muted-foreground/20" />
                  </TableCell>

                  <TableCell className="p-3 px-4">
                    <Skeleton className="h-4 w-24 bg-muted-foreground/20" />
                  </TableCell>

                  <TableCell className="p-3 px-4">
                    <Skeleton className="h-4 w-20 bg-muted-foreground/20" />
                  </TableCell>

                  <TableCell className="p-3 px-4">
                    <Skeleton className="h-4 w-16 bg-muted-foreground/20" />
                  </TableCell>
                </TableRow>
              ))
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="p-4 text-center text-muted-foreground"
                >
                  {t("common.noData")}
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => {
                const latestPurchase = product.purchases?.[0];

                return (
                  <TableRow
                    key={product.product_id}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <TableCell className="p-3 px-4 font-semibold">
                      {isArabic ? product.ar_name : product.brand_name}
                    </TableCell>

                    <TableCell className="p-3 px-4 text-muted-foreground">
                      {latestPurchase?.supplier_name || "-"}
                    </TableCell>

                    <TableCell className="p-3 px-4 font-mono">
                      {product.avg_cost?.toLocaleString()} {t("common.syp")}
                    </TableCell>

                    <TableCell className="p-3 px-4 font-mono text-[11px] text-muted-foreground">
                      {product.min_cost !== product.max_cost ? (
                        <span>
                          {product.min_cost?.toLocaleString()} -{" "}
                          {product.max_cost?.toLocaleString()}
                        </span>
                      ) : (
                        <span>-</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
