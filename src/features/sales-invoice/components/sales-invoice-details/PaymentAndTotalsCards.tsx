import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, FileCheck2, UserCheck, Clock } from "lucide-react";
import type { SalesInvoiceDetails } from "../../types/salesInvoice";

export function PaymentSummaryCard({
  invoice,
}: {
  invoice: SalesInvoiceDetails;
}) {
  const { t } = useTranslation();

  return (
    <Card className="border-border/60 shadow-xs rounded-2xl overflow-hidden">
      <CardHeader className="bg-muted/20 border-b border-border/60 py-2.5 px-4">
        <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <CreditCard className="h-3.5 w-3.5 text-primary" />
          {t("salesInvoice.payment.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 grid grid-cols-2 gap-4 text-xs">
        <div>
          <div className="text-muted-foreground text-[11px]">
            {t("salesInvoice.table.method")}
          </div>
          <div className="font-bold text-foreground capitalize mt-0.5">
            {invoice.payment_method}
          </div>
        </div>
        <div>
          <div className="text-muted-foreground text-[11px]">
            {t("salesInvoice.table.status")}
          </div>
          <Badge
            variant="outline"
            className="mt-0.5 font-semibold text-[11px] rounded-md capitalize"
          >
            {invoice.payment_status}
          </Badge>
        </div>
        <div>
          <div className="text-muted-foreground text-[11px]">
            {t("salesInvoice.table.paid")}
          </div>
          <div className="font-mono font-bold text-emerald-600 mt-0.5">
            {invoice.amount_paid.toLocaleString()}
          </div>
        </div>
        <div>
          <div className="text-muted-foreground text-[11px]">
            {t("salesInvoice.table.due")}
          </div>
          <div className="font-mono font-bold text-amber-600 mt-0.5">
            {invoice.amount_due.toLocaleString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function TotalsBreakdownCard({
  invoice,
}: {
  invoice: SalesInvoiceDetails;
}) {
  const { t } = useTranslation();

  return (
    <Card className="border-border/60 shadow-xs rounded-2xl overflow-hidden">
      <CardHeader className="bg-muted/20 border-b border-border/60 py-2.5 px-4">
        <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <FileCheck2 className="h-3.5 w-3.5 text-primary" />
          {t("salesInvoice.totals.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-2.5 text-xs">
        <div className="flex justify-between items-center text-muted-foreground">
          <span>{t("salesInvoice.totals.subtotal")}</span>
          <span className="font-mono font-medium text-foreground">
            {invoice.subtotal.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center text-muted-foreground">
          <span>{t("salesInvoice.totals.tax")}</span>
          <span className="font-mono font-medium text-foreground">
            {invoice.tax_total.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center text-muted-foreground">
          <span>{t("salesInvoice.totals.discount")}</span>
          <span className="font-mono font-medium text-foreground">
            {invoice.discount_total.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center font-bold pt-2 border-t border-border/50 text-sm">
          <span className="text-foreground">
            {t("salesInvoice.totals.grandTotal")}
          </span>
          <span className="font-mono text-primary">
            {invoice.grand_total.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center text-emerald-600 font-semibold">
          <span>{t("salesInvoice.table.paid")}</span>
          <span className="font-mono">
            {invoice.amount_paid.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center text-amber-600 font-semibold">
          <span>{t("salesInvoice.table.due")}</span>
          <span className="font-mono">
            {invoice.amount_due.toLocaleString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export function CreatedByCard({
  createdBy,
  createdAt,
  formatDate,
}: {
  createdBy?: { first_name: string; last_name: string };
  createdAt: string;
  formatDate: (date: string) => string;
}) {
  const { t } = useTranslation();

  return (
    <Card className="border-border/60 shadow-xs rounded-2xl overflow-hidden bg-muted/10">
      <CardContent className="p-4 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <UserCheck className="h-3.5 w-3.5 text-primary" />
          {t("salesInvoice.metadata.createdBy")}
          <strong className="text-foreground ml-1 rtl:mr-1 rtl:ml-0">
            {createdBy
              ? `${createdBy.first_name} ${createdBy.last_name}`
              : t("salesInvoice.metadata.system")}
          </strong>
        </span>
        <span className="flex items-center gap-1 font-mono">
          <Clock className="h-3.5 w-3.5" />
          {formatDate(createdAt)}
        </span>
      </CardContent>
    </Card>
  );
}
