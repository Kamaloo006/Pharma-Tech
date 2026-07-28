import { useTranslation } from "react-i18next";
import {
  FileText,
  Building2,
  Calendar,
  User,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { DetailCard } from "@/components/ui/DetailCard";
import { type PurchaseInvoice } from "../../types/purchase-invoice";

interface InvoiceInfoCardProps {
  invoice: PurchaseInvoice;
}

export function InvoiceInfoCard({ invoice }: InvoiceInfoCardProps) {
  const { t } = useTranslation();
  const isCompleted = invoice.status === "completed";

  const createdByName = invoice.created_by
    ? `${invoice.created_by.first_name} ${invoice.created_by.last_name}`
    : "—";

  return (
    <DetailCard title={t("purchaseInvoiceDetails.info.title")} icon={FileText}>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-5 gap-x-4 text-start">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
            <FileText className="h-3 w-3" />
            {t("purchaseInvoiceDetails.info.invoiceNumber")}
          </span>
          <p className="text-xs font-bold text-foreground font-mono">
            {invoice.invoice_number}
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
            <Building2 className="h-3 w-3" />
            {t("purchaseInvoiceDetails.info.supplier")}
          </span>
          <p className="text-xs font-bold text-foreground truncate">
            {invoice.supplier?.name || "—"}
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {t("purchaseInvoiceDetails.info.date")}
          </span>
          <p className="text-xs font-bold text-foreground font-mono">
            {invoice.invoice_date}
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
            <User className="h-3 w-3" />
            {t("purchaseInvoiceDetails.info.createdBy")}
          </span>
          <p className="text-xs font-bold text-foreground">{createdByName}</p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground">
            {t("purchaseInvoiceDetails.info.status")}
          </span>
          <div>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                isCompleted
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : "bg-destructive/10 text-destructive border-destructive/20"
              }`}
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 className="h-3 w-3" />
                  {t("purchaseInvoiceDetails.info.statusCompleted")}
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3" />
                  {t("purchaseInvoiceDetails.info.statusCancelled")}
                </>
              )}
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground">
            {t("purchaseInvoiceDetails.info.paymentStatus")}
          </span>
          <div>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                invoice.payment_status === "paid"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : invoice.payment_status === "partial"
                    ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    : "bg-destructive/10 text-destructive border-destructive/20"
              }`}
            >
              {invoice.payment_status === "paid" &&
                t("purchaseInvoiceDetails.info.paymentFullyPaid")}
              {invoice.payment_status === "partial" &&
                t("purchaseInvoiceDetails.info.paymentPartiallyPaid")}
              {invoice.payment_status === "unpaid" &&
                t("purchaseInvoiceDetails.info.paymentRefundedUnpaid")}
            </span>
          </div>
        </div>
      </div>
    </DetailCard>
  );
}
