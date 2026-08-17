import { useTranslation } from "react-i18next";
import {
  User,
  FileText,
  Calendar as CalendarIcon,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DebtStatusBadge } from "./DebtStatusBadge";
import type { DebtStatus } from "../../types/customerDebt";

interface Customer {
  full_name: string;
  phone?: string | null;
}

interface DebtDetails {
  id: string | number;
  sales_invoice_id: string | number;
  created_at: string;
  total_amount: number;
  paid_amount: number;
  remaining_amount: number;
  status: DebtStatus;
  customer: Customer;
}

interface DebtSummaryCardsProps {
  debt: DebtDetails;
  formatCurrency: (val: number) => string;
  formatDate: (dateString?: string | null) => string;
}

export function DebtSummaryCards({
  debt,
  formatCurrency,
  formatDate,
}: DebtSummaryCardsProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Customer Card */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base font-semibold">
            {t("customerDebt.details.customer")}
          </CardTitle>
          <User className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-lg font-bold">{debt.customer.full_name}</div>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <span className="font-medium">
              {t("customerDebt.details.phone")}:
            </span>
            <span dir="ltr">{debt.customer.phone || "-"}</span>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Card */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base font-semibold">
            {t("customerDebt.details.invoice")}
          </CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-lg font-bold">INV-{debt.sales_invoice_id}</div>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <CalendarIcon className="h-3.5 w-3.5" />
            <span>
              {t("customerDebt.details.debtDate")}:{" "}
              {formatDate(debt.created_at)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Summary Financials Card */}
      <Card className="border-border/60 shadow-sm bg-muted/30">
        <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base font-semibold">
            {t("customerDebt.details.summary")}
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">
              {t("customerDebt.details.totalAmount")}:
            </span>
            <span className="font-semibold">
              {formatCurrency(debt.total_amount)}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">
              {t("customerDebt.details.paidAmount")}:
            </span>
            <span className="font-semibold text-emerald-600">
              {formatCurrency(debt.paid_amount)}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm border-t border-border pt-2">
            <span className="font-bold">
              {t("customerDebt.details.remaining")}:
            </span>
            <span className="font-bold text-base text-rose-600">
              {formatCurrency(debt.remaining_amount)}
            </span>
          </div>
          <div className="flex justify-between items-center pt-1">
            <span className="text-xs text-muted-foreground">
              {t("customerDebt.details.statusLabel")}:
            </span>
            <DebtStatusBadge status={debt.status} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
