import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { AlertCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DetailCard } from "@/components/ui/DetailCard";
import { type PurchaseInvoice } from "../../types/purchase-invoice";

interface SupplierDebtCardProps {
  invoice: PurchaseInvoice;
}

export function SupplierDebtCard({ invoice }: SupplierDebtCardProps) {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const isArabic = i18n.language === "ar";

  return (
    <DetailCard
      title={isArabic ? "ديون ذمم المورد" : "Supplier Debt"}
      icon={AlertCircle}
      className="border-destructive/30 bg-secondary/40 dark:bg-destructive/20 shadow-sm"
      headerClassName="border-destructive/20 text-destructive"
      contentClassName="space-y-4 text-start"
    >
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-muted-foreground">
          {isArabic ? "إجمالي الدين المترتب" : "Remaining Debt"}
        </span>
        <p className="text-lg font-black text-destructive">
          {Number(invoice.amount_due).toFixed(2)} ل.س
        </p>
      </div>

      <div className="flex justify-between items-center text-xs pt-2 border-t border-destructive/20">
        <span className="text-muted-foreground">
          {isArabic ? "الحالة" : "Status"}
        </span>
        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold border bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 animate-pulse">
          {isArabic ? "قيد المتابعة (مفتوح)" : "Open Debt"}
        </span>
      </div>

      <Button
        className="w-full h-10 text-xs bg-primary font-bold gap-1.5 shadow-sm mt-1"
        onClick={() =>
          navigate(`/suppliers/debts/${invoice.supplier_debt?.id}`)
        }
      >
        <span>{isArabic ? "فتح سجل ذمم المورد" : "Open Supplier Debt"}</span>
        <ExternalLink className="h-3 w-3" />
      </Button>
    </DetailCard>
  );
}
