import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  User,
  FileText,
  Calendar,
  CreditCard,
  Phone,
  UserCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type CustomerReturnInvoiceDetail } from "../../types/CustomerReturn";

interface Props {
  details: CustomerReturnInvoiceDetail;
  isArabic: boolean;
}

export function CustomerReturnMetadataGrid({ details, isArabic }: Props) {
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
      <div className="bg-card border border-border/60 rounded-xl p-4 shadow-xs space-y-1.5">
        <span className="text-[11px] font-bold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
          <User className="w-3.5 h-3.5 text-primary" />
          {t("customerReturn.details.customer", "Customer")}
        </span>
        {details.customer ? (
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-foreground truncate">
              {details.customer.full_name}
            </p>
            {details.customer.phone && (
              <p className="text-[11px] text-muted-foreground flex items-center gap-1 font-mono">
                <Phone className="w-3 h-3" />
                {details.customer.phone}
              </p>
            )}
          </div>
        ) : (
          <Badge
            variant="outline"
            className="text-[10px] bg-muted/60 font-medium"
          >
            {t("customerReturn.walkIn", "Walk-in Customer")}
          </Badge>
        )}
      </div>

      <div className="bg-card border border-border/60 rounded-xl p-4 shadow-xs space-y-1">
        <span className="text-[11px] font-bold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
          <FileText className="w-3.5 h-3.5 text-primary" />
          {t(
            "customerReturn.details.originalInvoice",
            "Original Sales Invoice",
          )}
        </span>
        {details.original_sales_invoice_id ? (
          <button
            onClick={() =>
              navigate(
                `/dashboard/sales-invoices/${details.original_sales_invoice_id}`,
              )
            }
            className="text-xs font-bold text-primary hover:underline font-mono"
          >
            #{details.original_sales_invoice_id}
          </button>
        ) : (
          <p className="text-xs text-muted-foreground">N/A</p>
        )}
      </div>

      <div className="bg-card border border-border/60 rounded-xl p-4 shadow-xs space-y-1">
        <span className="text-[11px] font-bold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5 text-primary" />
          {t("customerReturn.details.returnDate", "Return Date")}
        </span>
        <p className="text-xs font-bold text-foreground font-mono">
          {formatDate(details.invoice_date)}
        </p>
      </div>

      <div className="bg-card border border-border/60 rounded-xl p-4 shadow-xs space-y-1">
        <span className="text-[11px] font-bold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
          <CreditCard className="w-3.5 h-3.5 text-primary" />
          {t("customerReturn.details.refundMethod", "Refund Method")}
        </span>
        <p className="text-xs font-bold text-foreground capitalize">
          {details.refund_method}
        </p>
        {details.created_by && (
          <p className="text-[11px] text-muted-foreground flex items-center gap-1 pt-1 border-t border-border/40 mt-1">
            <UserCheck className="w-3 h-3 text-muted-foreground" />
            <span>{t("common.createdBy", "Created by")}:</span>
            <span className="font-semibold">
              {details.created_by.first_name} {details.created_by.last_name}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
