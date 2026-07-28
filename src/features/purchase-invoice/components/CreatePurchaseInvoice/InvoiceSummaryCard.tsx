import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Totals {
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  grandTotal: number;
}

interface InvoiceSummaryCardProps {
  totals: Totals;
}

export function InvoiceSummaryCard({ totals }: InvoiceSummaryCardProps) {
  const { t } = useTranslation();

  return (
    <Card className="border-border bg-card shadow-sm rounded-2xl">
      <CardHeader className="pb-3 border-b border-border/40">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <Calculator className="h-4 w-4 text-primary" />
          {t("purchaseInvoice.summary.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5 space-y-3.5 text-xs">
        <div className="flex justify-between items-center text-muted-foreground">
          <span>{t("purchaseInvoice.summary.subtotal")}</span>
          <span className="font-semibold text-foreground font-mono text-sm">
            {totals.subtotal.toFixed(2)} {t("common.currency")}
          </span>
        </div>

        <div className="flex justify-between items-center text-muted-foreground">
          <span>{t("purchaseInvoice.summary.discount")}</span>
          <span className="font-semibold text-emerald-500 font-mono text-sm">
            - {totals.discountTotal.toFixed(2)} {t("common.currency")}
          </span>
        </div>

        <div className="flex justify-between items-center text-muted-foreground">
          <span>{t("purchaseInvoice.summary.tax")}</span>
          <span className="font-semibold text-foreground font-mono text-sm">
            + {totals.taxTotal.toFixed(2)} {t("common.currency")}
          </span>
        </div>

        <div className="border-t border-border/60 pt-3.5 flex justify-between items-center">
          <span className="font-extrabold text-sm text-foreground">
            {t("purchaseInvoice.summary.grandTotal")}
          </span>
          <span className="font-black text-lg text-primary font-mono">
            {totals.grandTotal.toFixed(2)} {t("common.currency")}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
