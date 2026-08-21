import { useState } from "react";
import { DollarSign, X, AlertCircle, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePaySupplierDebt } from "@/features/supplier-debt/hooks/useSupplierDebt";
import type { PayDebtPayload } from "@/features/supplier-debt/types/SupplierDebt";

interface PayDebtModalProps {
  supplierDebtId: string | number;
  remainingAmount: number;
  onClose: () => void;
  onSuccess?: () => void;
}

export function PayDebtModal({
  supplierDebtId,
  remainingAmount,
  onClose,
  onSuccess,
}: PayDebtModalProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const todayStr = new Date().toISOString().split("T")[0];

  const [amount, setAmount] = useState<string>("");
  const [paymentDate, setPaymentDate] = useState<string>(todayStr);
  const [notes, setNotes] = useState<string>("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const payDebtMutation = usePaySupplierDebt(supplierDebtId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      setValidationError(
        t(
          "supplierDebt.payModal.validation.invalidAmount",
          "Please enter a valid amount greater than 0.",
        ),
      );
      return;
    }

    if (numAmount > remainingAmount) {
      setValidationError(
        t("supplierDebt.payModal.validation.exceedsRemaining", {
          amount: remainingAmount.toLocaleString(),
          currency: t("common.currency", "SYR"),
          defaultValue: `Amount cannot exceed remaining debt (${remainingAmount.toLocaleString()} SYR).`,
        }),
      );
      return;
    }

    if (!paymentDate) {
      setValidationError(
        t(
          "supplierDebt.payModal.validation.dateRequired",
          "Payment date is required.",
        ),
      );
      return;
    }

    setValidationError(null);

    const payload: PayDebtPayload = {
      amount: numAmount,
      payment_date: paymentDate,
      notes: notes.trim() || undefined,
    };

    payDebtMutation.mutate(payload, {
      onSuccess: () => {
        onSuccess?.();
        onClose();
      },
    });
  };

  const apiErrorMessage =
    payDebtMutation.error && "response" in payDebtMutation.error
      ? (payDebtMutation.error as any).response?.data?.message ||
        t(
          "supplierDebt.payModal.errors.recordFailed",
          "Failed to record payment. Please try again.",
        )
      : payDebtMutation.error
        ? t("common.errors.unexpected", "An unexpected error occurred.")
        : null;

  const displayError = validationError || apiErrorMessage;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="bg-card border border-border w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        dir={isArabic ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-foreground">
              {t("supplierDebt.payModal.title", "Pay Supplier Debt")}
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={payDebtMutation.isPending}
            className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="p-3.5 rounded-xl bg-muted/40 border border-border flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              {t("supplierDebt.payModal.remainingAmount", "Remaining Amount:")}
            </span>
            <span className="text-sm font-bold font-mono text-rose-500">
              {remainingAmount.toLocaleString()} {t("common.currency", "YER")}
            </span>
          </div>

          {displayError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{displayError}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span>{t("supplierDebt.payModal.amountLabel", "Amount *")}</span>
              <button
                type="button"
                onClick={() => {
                  setAmount(remainingAmount.toString());
                  setValidationError(null);
                }}
                className="text-[11px] text-primary hover:underline font-normal"
              >
                {t("supplierDebt.payModal.payFullBalance", "Pay Full Balance")}
              </button>
            </label>
            <input
              type="number"
              step="any"
              placeholder="0.00"
              disabled={payDebtMutation.isPending}
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (validationError) setValidationError(null);
              }}
              className="w-full h-10 px-3 bg-background border border-border rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
            />
          </div>

          <div className="space-y-1.5 flex justify-between">
            <label className="text-xs font-semibold text-foreground">
              {t("supplierDebt.payModal.paymentDateLabel", "Payment Date *")}
            </label>
            <p className="text-sm font-semibold text-primary">{todayStr}</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              {t("supplierDebt.payModal.notesLabel", "Notes")}{" "}
              <span className="text-muted-foreground font-normal">
                ({t("common.optional", "Optional")})
              </span>
            </label>
            <textarea
              rows={3}
              placeholder={t(
                "supplierDebt.payModal.notesPlaceholder",
                "e.g. Partial payment via bank transfer...",
              )}
              disabled={payDebtMutation.isPending}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none disabled:opacity-50"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/60">
            <button
              type="button"
              onClick={onClose}
              disabled={payDebtMutation.isPending}
              className="px-4 py-2 rounded-xl border border-border bg-background hover:bg-muted text-xs font-semibold text-foreground transition-colors disabled:opacity-50"
            >
              {t("common.buttons.cancel", "Cancel")}
            </button>
            <button
              type="submit"
              disabled={payDebtMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-xs disabled:opacity-50"
            >
              {payDebtMutation.isPending && (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              )}
              <span>
                {payDebtMutation.isPending
                  ? t("common.processing", "Processing...")
                  : t(
                      "supplierDebt.payModal.recordPaymentBtn",
                      "Record Payment",
                    )}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
