import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  useCustomerDebtDetails,
  usePayCustomerDebt,
} from "@/features/customer-debt/hooks/useCustomerDebtDetails";

import { DebtSummaryCards } from "@/features/customer-debt/components/customer-debt-details/DebtSummaryCards";
import { PaymentHistoryTable } from "@/features/customer-debt/components/customer-debt-details/PaymentHistoryTable";
import { PayDebtDialog } from "@/features/customer-debt/components/customer-debt-details/PayDebtDialog";

export default function CustomerDebtDetails() {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isPayDialogOpen, setIsPayDialogOpen] = useState(false);

  const { data: debt, isLoading, isError } = useCustomerDebtDetails(id);
  const payDebtMutation = usePayCustomerDebt();

  // Helper formatting functions
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(i18n.language === "ar" ? "ar-SY" : "en-US", {
      style: "currency",
      currency: "SYP",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString(
      i18n.language === "ar" ? "ar-SY" : "en-US",
      {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          {t("customerDebt.details.loading")}
        </p>
      </div>
    );
  }

  if (isError || !debt || !id) {
    return (
      <div className="p-6 space-y-6 max-w-8xl mx-auto">
        <p className="text-rose-500 font-semibold">
          {t("customerDebt.details.errorLoading")}
        </p>
        <Button variant="outline" onClick={() => navigate(-1)}>
          {t("common.back")}
        </Button>
      </div>
    );
  }

  return (
    <div className="px-6 space-y-6 max-w-8xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => navigate(-1)}
          >
            <ArrowRight className="h-5 w-5 rtl:rotate-180" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {t("customerDebt.details.title", { id: debt.id })}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("customerDebt.details.subtitle", {
                invoiceId: debt.sales_invoice_id,
              })}
            </p>
          </div>
        </div>

        <Button
          size="lg"
          className="gap-2 font-semibold shadow-sm cursor-pointer"
          onClick={() => setIsPayDialogOpen(true)}
          disabled={debt.remaining_amount <= 0 || debt.status === "paid"}
        >
          <CreditCard className="h-5 w-5" />
          {t("customerDebt.details.payDebt")}
        </Button>
      </div>

      {/* Summary Cards */}
      <DebtSummaryCards
        debt={debt}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
      />

      {/* Payment History */}
      <PaymentHistoryTable
        payments={debt.payments}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
      />

      {/* Payment Dialog */}
      <PayDebtDialog
        isOpen={isPayDialogOpen}
        onOpenChange={setIsPayDialogOpen}
        debtId={id}
        salesInvoiceId={debt.sales_invoice_id}
        remainingAmount={debt.remaining_amount}
        formatCurrency={formatCurrency}
        payMutation={payDebtMutation}
      />
    </div>
  );
}
