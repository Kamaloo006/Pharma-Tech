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
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const isCompleted = invoice.status === "completed";

  const createdByName = invoice.created_by
    ? `${invoice.created_by.first_name} ${invoice.created_by.last_name}`
    : "—";

  return (
    <DetailCard
      title={isArabic ? "معلومات الفاتورة العامة" : "Invoice Information"}
      icon={FileText}
    >
      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-5 gap-x-4 text-start">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
            <FileText className="h-3 w-3" />
            {isArabic ? "رقم الفاتورة" : "Invoice Number"}
          </span>
          <p className="text-xs font-bold text-foreground font-mono">
            {invoice.invoice_number}
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
            <Building2 className="h-3 w-3" />
            {isArabic ? "المورد" : "Supplier"}
          </span>
          <p className="text-xs font-bold text-foreground truncate">
            {invoice.supplier?.name || "—"}
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {isArabic ? "التاريخ" : "Date"}
          </span>
          <p className="text-xs font-bold text-foreground font-mono">
            {invoice.invoice_date}
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
            <User className="h-3 w-3" />
            {isArabic ? "بواسطة" : "Created By"}
          </span>
          <p className="text-xs font-bold text-foreground">{createdByName}</p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground">
            {isArabic ? "الحالة" : "Status"}
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
                  {isArabic ? "مكتملة" : "Completed"}
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3" />
                  {isArabic ? "ملغاة" : "Cancelled"}
                </>
              )}
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground">
            {isArabic ? "حالة الدفع" : "Payment Status"}
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
                (isArabic ? "مدفوعة بالكامل" : "Fully Paid")}
              {invoice.payment_status === "partial" &&
                (isArabic ? "دفعة جزئية" : "Partially Paid")}
              {invoice.payment_status === "unpaid" &&
                (isArabic ? "مسترجعة / غير مدفوعة" : "Refunded / Unpaid")}
            </span>
          </div>
        </div>
      </div>
    </DetailCard>
  );
}
