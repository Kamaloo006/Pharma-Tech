import { useTranslation } from "react-i18next";
import { DollarSign } from "lucide-react";
import { DetailCard } from "@/components/ui/DetailCard";
import { type PurchaseInvoice } from "../../types/purchase-invoice";

interface PaymentDetailsCardProps {
  invoice: PurchaseInvoice;
}

export function PaymentDetailsCard2({ invoice }: PaymentDetailsCardProps) {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <DetailCard
      title={isArabic ? "الملخص المالي" : "Financial Totals"}
      icon={DollarSign}
      contentClassName="pt-5 space-y-3.5"
    >
      <div className="flex justify-between items-center text-xs">
        <span className="text-muted-foreground">
          {isArabic ? "المجموع الفرعي" : "Subtotal"}
        </span>
        <span className="font-semibold text-foreground">
          {Number(invoice.subtotal).toFixed(2)} ل.س
        </span>
      </div>
      <div className="flex justify-between items-center text-xs">
        <span className="text-muted-foreground">
          {isArabic ? "الخصم" : "Discount"}
        </span>
        <span className="font-semibold text-destructive">
          -{Number(invoice.discount_total).toFixed(2)} ل.س
        </span>
      </div>
      <div className="flex justify-between items-center text-xs">
        <span className="text-muted-foreground">
          {isArabic ? "الضريبة" : "Tax Value"}
        </span>
        <span className="font-semibold text-foreground">
          +{Number(invoice.tax_total).toFixed(2)} ل.س
        </span>
      </div>

      <div className="border-t border-border/60 pt-3 flex justify-between items-center">
        <span className="text-xs font-bold text-foreground">
          {isArabic ? "المجموع الكلي" : "Grand Total"}
        </span>
        <span className="text-sm font-extrabold text-primary">
          {Number(invoice.grand_total).toFixed(2)} ل.س
        </span>
      </div>

      <div className="border-t border-border/40 pt-3 flex justify-between items-center text-xs">
        <span className="text-muted-foreground font-semibold">
          {isArabic ? "المبلغ المدفوع" : "Amount Paid"}
        </span>
        <span className="font-bold text-emerald-500">
          {Number(invoice.amount_paid).toFixed(2)} ل.س
        </span>
      </div>
      <div className="flex justify-between items-center text-xs">
        <span className="text-muted-foreground font-semibold text-destructive">
          {isArabic ? "المبلغ المتبقي" : "Remaining Due"}
        </span>
        <span className="font-bold text-destructive">
          {Number(invoice.amount_due).toFixed(2)} ل.س
        </span>
      </div>
    </DetailCard>
  );
}
