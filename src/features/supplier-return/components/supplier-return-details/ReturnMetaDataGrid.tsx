import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Building2, FileText, Calendar, CreditCard } from "lucide-react";
import { type SupplierReturnInvoiceDetail } from "../../types/SupplierReturn";

interface Props {
  details: SupplierReturnInvoiceDetail;
  isArabic: boolean;
}

export function ReturnMetadataGrid({ details, isArabic }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString(
      isArabic ? "ar-EG" : "en-US",
      { year: "numeric", month: "short", day: "numeric" },
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Supplier */}
      <div className="bg-card border border-border/60 rounded-xl p-4 shadow-xs space-y-1">
        <span className="text-[11px] font-bold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
          <Building2 className="w-3.5 h-3.5 text-primary" />
          {t("supplierReturn.details.supplier")}
        </span>
        <p className="text-xs font-bold text-foreground truncate">
          {details.supplier?.name}
        </p>
      </div>

      {/* Original Purchase Invoice */}
      <div className="bg-card border border-border/60 rounded-xl p-4 shadow-xs space-y-1">
        <span className="text-[11px] font-bold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
          <FileText className="w-3.5 h-3.5 text-primary" />
          {t("supplierReturn.details.originalInvoice")}
        </span>
        <button
          onClick={() =>
            navigate(
              `/dashboard/purchase-invoices/${details.original_purchase_invoice_id}`,
            )
          }
          className="text-xs font-bold text-primary hover:underline font-mono"
        >
          #{details.original_purchase_invoice_id}
        </button>
      </div>

      {/* Return Date */}
      <div className="bg-card border border-border/60 rounded-xl p-4 shadow-xs space-y-1">
        <span className="text-[11px] font-bold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5 text-primary" />
          {t("supplierReturn.details.returnDate")}
        </span>
        <p className="text-xs font-bold text-foreground font-mono">
          {formatDate(details.invoice_date)}
        </p>
      </div>

      {/* Refund Method */}
      <div className="bg-card border border-border/60 rounded-xl p-4 shadow-xs space-y-1">
        <span className="text-[11px] font-bold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
          <CreditCard className="w-3.5 h-3.5 text-primary" />
          {t("supplierReturn.details.refundMethod")}
        </span>
        <p className="text-xs font-bold text-foreground capitalize">
          {details.refund_method}
        </p>
      </div>
    </div>
  );
}
