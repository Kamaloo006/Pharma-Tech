import { useTranslation } from "react-i18next";
import { AlertCircle, FileText, CreditCard } from "lucide-react";
import { type CustomerReturnInvoiceDetail } from "../../types/CustomerReturn";

interface Props {
  details: CustomerReturnInvoiceDetail;
  isArabic?: boolean;
}

export function CustomerReturnFinancialSummary({ details, isArabic }: Props) {
  const { t } = useTranslation();
  const formatCurrency = (amount: number) =>
    `${amount.toLocaleString()} ${isArabic ? "ل.س" : "SYP"}`;

  return (
    <div className="space-y-4">
      {/* Financial Summary Card */}
      <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-3 text-xs">
        <h3 className="font-bold text-foreground pb-2 border-b border-border/60">
          {t("customerReturn.details.summary", "Refund Summary")}
        </h3>

        <div className="flex justify-between text-muted-foreground">
          <span>{t("customerReturn.details.subtotal", "Subtotal")}</span>
          <span className="font-mono font-semibold text-foreground">
            {formatCurrency(details.subtotal)}
          </span>
        </div>

        <div className="flex justify-between text-muted-foreground">
          <span>{t("customerReturn.details.tax", "Tax Total")}</span>
          <span className="font-mono text-foreground">
            {formatCurrency(details.tax_total)}
          </span>
        </div>

        <div className="flex justify-between text-muted-foreground">
          <span>{t("customerReturn.details.discount", "Discount Total")}</span>
          <span className="font-mono text-foreground">
            {formatCurrency(details.discount_total)}
          </span>
        </div>

        <div className="flex justify-between text-muted-foreground pt-1 border-t border-border/30">
          <span className="flex items-center gap-1">
            <CreditCard className="w-3 h-3 text-primary" />
            {t("customerReturn.details.refundMethod", "Refund Method")}
          </span>
          <span className="font-semibold capitalize text-foreground">
            {details.refund_method}
          </span>
        </div>

        <div className="pt-3 border-t border-border/60 flex justify-between items-center text-sm font-bold">
          <span className="text-foreground">
            {t("customerReturn.details.refundTotal", "Refund Total")}
          </span>
          <span className="font-mono text-primary text-base">
            {formatCurrency(details.refund_total)}
          </span>
        </div>
      </div>

      {/* Reason Card */}
      {details.reason && (
        <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-2">
          <span className="text-[11px] font-bold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
            {t("customerReturn.details.reason", "Reason")}
          </span>
          <p className="text-xs text-foreground bg-muted/40 p-3 rounded-lg border border-border/50">
            {details.reason}
          </p>
        </div>
      )}

      {/* Notes Card */}
      {details.notes && (
        <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-2">
          <span className="text-[11px] font-bold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5 text-primary" />
            {t("customerReturn.details.notes", "Notes")}
          </span>
          <p className="text-xs text-foreground bg-muted/40 p-3 rounded-lg border border-border/50 whitespace-pre-wrap">
            {details.notes}
          </p>
        </div>
      )}
    </div>
  );
}
