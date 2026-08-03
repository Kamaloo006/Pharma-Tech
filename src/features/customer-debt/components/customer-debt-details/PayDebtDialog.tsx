import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

interface PayDebtDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  debtId: string;
  salesInvoiceId: string | number;
  remainingAmount: number;
  formatCurrency: (val: number) => string;
  payMutation: any;
}

export function PayDebtDialog({
  isOpen,
  onOpenChange,
  debtId,
  salesInvoiceId,
  remainingAmount,
  formatCurrency,
  payMutation,
}: PayDebtDialogProps) {
  const { t } = useTranslation();

  const [amount, setAmount] = useState<string>("");
  const [paymentDate, setPaymentDate] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setAmount(String(remainingAmount));
      setPaymentDate(new Date().toISOString().split("T")[0]);
      setNotes("");
      setFormError(null);
    }
  }, [isOpen, remainingAmount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      setFormError(t("customerDebt.errors.invalidAmount"));
      return;
    }

    if (numericAmount > remainingAmount) {
      setFormError(
        t("customerDebt.errors.amountExceedsRemaining", {
          remaining: remainingAmount,
        }),
      );
      return;
    }

    setFormError(null);

    payMutation.mutate(
      {
        debtId,
        payload: {
          amount: numericAmount,
          payment_date: paymentDate,
          notes: notes.trim() || null,
        },
      },
      {
        onSuccess: () => onOpenChange(false),
        onError: (err: any) => {
          setFormError(
            err?.response?.data?.message ||
              t("customerDebt.errors.paymentFailed"),
          );
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t("customerDebt.dialog.title")}</DialogTitle>
            <DialogDescription>
              {t("customerDebt.dialog.desc", { invoiceId: salesInvoiceId })}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div className="p-3 bg-muted rounded-lg flex justify-between items-center text-sm">
              <span className="text-muted-foreground">
                {t("customerDebt.dialog.remainingBalance")}:
              </span>
              <span className="font-bold text-rose-600 text-base">
                {formatCurrency(remainingAmount)}
              </span>
            </div>

            {formError && (
              <div className="p-2.5 text-xs rounded bg-rose-500/10 text-rose-600 border border-rose-500/20 font-medium">
                {formError}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="amount">{t("customerDebt.dialog.amount")}</Label>
              <Input
                id="amount"
                type="number"
                step="any"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                max={remainingAmount}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_date">
                {t("customerDebt.dialog.paymentDate")}
              </Label>
              <Input
                id="payment_date"
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">{t("customerDebt.dialog.notes")}</Label>
              <Textarea
                id="notes"
                placeholder={t("customerDebt.dialog.notesPlaceholder")}
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={payMutation.isPending}
            >
              {t("common.cancel")}
            </Button>

            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 cursor-pointer"
              disabled={payMutation.isPending}
            >
              {payMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin me-2" />
                  {t("customerDebt.dialog.submitting")}
                </>
              ) : (
                t("customerDebt.dialog.pay")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
