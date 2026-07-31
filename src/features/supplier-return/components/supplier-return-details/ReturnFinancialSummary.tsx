import { useTranslation } from "react-i18next";
import { AlertCircle } from "lucide-react";
import { type SupplierReturnInvoiceDetail } from "../../types/SupplierReturn";

interface Props {
  details: SupplierReturnInvoiceDetail;
}

export function ReturnFinancialSummary({ details }: Props) {
  const { t } = useTranslation();
  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-3 text-xs">
        <h3 className="font-bold text-foreground pb-2 border-b border-border/60">
          {t("supplierReturn.details.summary", "Financial Summary")}
        </h3>

        <div className="flex justify-between text-muted-foreground">
          <span>{t("supplierReturn.details.subtotal", "Subtotal")}</span>
          <span className="font-mono font-semibold text-foreground">
            {formatCurrency(details.subtotal)}
          </span>
        </div>

        <div className="flex justify-between text-muted-foreground">
          <span>{t("supplierReturn.details.tax", "Tax")}</span>
          <span className="font-mono text-foreground">
            {formatCurrency(details.tax_total)}
          </span>
        </div>

        <div className="flex justify-between text-muted-foreground">
          <span>{t("supplierReturn.details.discount", "Discount")}</span>
          <span className="font-mono text-foreground">
            {formatCurrency(details.discount_total)}
          </span>
        </div>

        <div className="pt-3 border-t border-border/60 flex justify-between items-center text-sm font-bold">
          <span className="text-foreground">
            {t("supplierReturn.details.refundTotal", "Refund Total")}
          </span>
          <span className="font-mono text-primary text-base">
            {formatCurrency(details.refund_total)}
          </span>
        </div>
      </div>

      {details.reason && (
        <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-2">
          <span className="text-[11px] font-bold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
            {t("supplierReturn.details.reason", "Reason")}
          </span>
          <p className="text-xs text-foreground bg-muted/40 p-3 rounded-lg border border-border/50">
            {details.reason}
          </p>
        </div>
      )}
    </div>
  );
}
