import { useTranslation } from "react-i18next";
import { DollarSign } from "lucide-react";
import { DetailCard } from "@/components/ui/DetailCard";
import { type PurchaseInvoice } from "../../types/purchase-invoice";

interface PaymentDetailsCardProps {
  invoice: PurchaseInvoice;
}

export function PaymentDetailsCard2({ invoice }: PaymentDetailsCardProps) {
  const { t } = useTranslation();

  return (
    <DetailCard
      title={t("purchaseInvoiceDetails.payment.title")}
      icon={DollarSign}
      contentClassName="pt-5 space-y-3.5"
    >
      <div className="flex justify-between items-center text-xs">
        <span className="text-muted-foreground">
          {t("purchaseInvoiceDetails.payment.subtotal")}
        </span>
        <span className="font-semibold text-foreground">
          {Number(invoice.subtotal).toFixed(2)} {t("common.currency")}
        </span>
      </div>
      <div className="flex justify-between items-center text-xs">
        <span className="text-muted-foreground">
          {t("purchaseInvoiceDetails.payment.discount")}
        </span>
        <span className="font-semibold text-destructive">
          -{Number(invoice.discount_total).toFixed(2)} {t("common.currency")}
        </span>
      </div>
      <div className="flex justify-between items-center text-xs">
        <span className="text-muted-foreground">
          {t("purchaseInvoiceDetails.payment.taxValue")}
        </span>
        <span className="font-semibold text-foreground">
          +{Number(invoice.tax_total).toFixed(2)} {t("common.currency")}
        </span>
      </div>

      <div className="border-t border-border/60 pt-3 flex justify-between items-center">
        <span className="text-xs font-bold text-foreground">
          {t("purchaseInvoiceDetails.payment.grandTotal")}
        </span>
        <span className="text-sm font-extrabold text-primary">
          {Number(invoice.grand_total).toFixed(2)} {t("common.currency")}
        </span>
      </div>

      <div className="border-t border-border/40 pt-3 flex justify-between items-center text-xs">
        <span className="text-muted-foreground font-semibold">
          {t("purchaseInvoiceDetails.payment.amountPaid")}
        </span>
        <span className="font-bold text-emerald-500">
          {Number(invoice.amount_paid).toFixed(2)} {t("common.currency")}
        </span>
      </div>
      <div className="flex justify-between items-center text-xs">
        <span className="text-muted-foreground font-semibold text-destructive">
          {t("purchaseInvoiceDetails.payment.remainingDue")}
        </span>
        <span className="font-bold text-destructive">
          {Number(invoice.amount_due).toFixed(2)} {t("common.currency")}
        </span>
      </div>
    </DetailCard>
  );
}
