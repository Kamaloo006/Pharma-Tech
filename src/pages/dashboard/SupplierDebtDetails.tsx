import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  AlertCircle,
  Receipt,
  Loader2,
} from "lucide-react";
import { useSupplierDebtDetails } from "@/features/supplier-debt/hooks/useSupplierDebt";
import type { SupplierDebtDetailsData } from "@/features/supplier-debt/types/SupplierDebt";
import type { PayDebtPayload } from "@/features/supplier-debt/types/SupplierDebt";
import { SupplierDebtPaymentHistory } from "@/features/supplier-debt/components/supplier-debt-details/SupplierDebtPaymentHistory";
import { PayDebtModal } from "@/features/supplier-debt/components/supplier-debt-details/PayDebtModal";

const SupplierDebtDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);

  const {
    data: debt,
    isLoading,
    isError,
    refetch,
  } = useSupplierDebtDetails(id);

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/dashboard/supplier-debt");
    }
  };

  const getStatusBadge = (status: SupplierDebtDetailsData["status"]) => {
    const styles: Record<
      SupplierDebtDetailsData["status"],
      { bg: string; text: string; label: string }
    > = {
      open: {
        bg: "bg-blue-500/10 border-blue-500/20",
        text: "text-blue-500",
        label: "OPEN",
      },
      partial: {
        bg: "bg-amber-500/10 border-amber-500/20",
        text: "text-amber-500",
        label: "PARTIAL",
      },
      paid: {
        bg: "bg-emerald-500/10 border-emerald-500/20",
        text: "text-emerald-500",
        label: "PAID",
      },
      overdue: {
        bg: "bg-rose-500/10 border-rose-500/20",
        text: "text-rose-500",
        label: "OVERDUE",
      },
      cancelled: {
        bg: "bg-muted border-border",
        text: "text-muted-foreground",
        label: "CANCELLED",
      },
    };

    const current = styles[status] || styles.open;

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider border ${current.bg} ${current.text}`}
      >
        {current.label}
      </span>
    );
  };

  const handleRecordPaymentSuccess = (_payload: PayDebtPayload) => {
    setIsPayModalOpen(false);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading debt details...</p>
      </div>
    );
  }

  if (isError || !debt) {
    return (
      <div className="p-6 max-w-md mx-auto my-12 text-center space-y-4 rounded-2xl border border-border bg-card">
        <div className="p-3 w-fit mx-auto rounded-full bg-rose-500/10 text-rose-500">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Debt Not Found</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Unable to load debt details. It might have been deleted.
          </p>
        </div>
        <button
          onClick={handleBack}
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
        >
          Back to Debts List
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Back to Debts List"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Supplier Debt #{debt.id}
              </h1>
              {getStatusBadge(debt.status)}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
              <Receipt className="w-3.5 h-3.5" />
              <span>
                Purchase Invoice ID:{" "}
                <strong className="font-mono text-foreground">
                  {debt.invoice_number || debt.purchase_invoice_id}
                </strong>
              </span>
              {debt.created_at && (
                <>
                  <span>•</span>
                  <span>
                    Created: {new Date(debt.created_at).toLocaleDateString()}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Pay Debt Button */}
        {debt.remaining_amount > 0 && (
          <button
            onClick={() => setIsPayModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-xs transition-all"
          >
            <DollarSign className="w-4 h-4" />
            <span>Pay Debt</span>
          </button>
        )}
      </div>

      {/* Supplier & Debt Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Supplier Info Card */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/60 pb-3">
            <Building2 className="w-4 h-4 text-primary" />
            <span>Supplier Information</span>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground">Supplier Name</p>
              <p className="text-base font-bold text-foreground mt-0.5">
                {debt.supplier?.name || "N/A"}
              </p>
            </div>

            {debt.supplier?.code && (
              <div>
                <p className="text-xs text-muted-foreground">Supplier Code</p>
                <p className="text-xs font-mono font-medium text-foreground mt-0.5">
                  {debt.supplier.code}
                </p>
              </div>
            )}

            {debt.supplier?.phone && (
              <div>
                <p className="text-xs text-muted-foreground">Phone Number</p>
                <p className="text-xs font-mono text-foreground mt-0.5">
                  {debt.supplier.phone}
                </p>
              </div>
            )}

            {debt.supplier?.email && (
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-xs font-mono text-foreground mt-0.5 truncate">
                  {debt.supplier.email}
                </p>
              </div>
            )}

            {debt.due_date && (
              <div>
                <p className="text-xs text-muted-foreground">Due Date</p>
                <p className="text-xs font-mono font-semibold text-amber-500 mt-0.5">
                  {debt.due_date}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Debt Financial Metrics Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Total Debt */}
          <div className="p-5 rounded-2xl border border-border bg-card shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium uppercase tracking-wider">
                Total Debt
              </span>
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold font-mono text-foreground">
                {debt.total_amount.toLocaleString()}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                YER - Initial Debt Amount
              </p>
            </div>
          </div>

          {/* Paid Amount */}
          <div className="p-5 rounded-2xl border border-border bg-card shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium uppercase tracking-wider">
                Paid
              </span>
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold font-mono text-emerald-500">
                {debt.paid_amount.toLocaleString()}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                YER - Total Payments Made
              </p>
            </div>
          </div>

          {/* Remaining Amount */}
          <div className="p-5 rounded-2xl border border-border bg-card shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium uppercase tracking-wider">
                Remaining
              </span>
              <Clock className="w-5 h-5 text-rose-500" />
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold font-mono text-rose-500">
                {debt.remaining_amount.toLocaleString()}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                YER - Balance Left to Pay
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment History Component */}
      <SupplierDebtPaymentHistory payments={debt.payments} />

      {isPayModalOpen && debt && (
        <PayDebtModal
          supplierDebtId={debt.id}
          remainingAmount={debt.remaining_amount}
          onClose={() => setIsPayModalOpen(false)}
          onSuccess={() => {
            setIsPayModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default SupplierDebtDetails;
