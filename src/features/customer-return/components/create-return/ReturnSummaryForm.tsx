import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { DollarSign, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Props {
  refundMethod: "cash" | "credit";
  reason: string;
  notes: string;
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  refundTotal: number;
  isPending: boolean;
  onRefundMethodChange: (val: "cash" | "credit") => void;
  onReasonChange: (val: string) => void;
  onNotesChange: (val: string) => void;
  formatCurrency: (amount: number) => string;
}

export function ReturnSummaryForm({
  refundMethod,
  reason,
  notes,
  subtotal,
  taxTotal,
  discountTotal,
  refundTotal,
  isPending,
  onRefundMethodChange,
  onReasonChange,
  onNotesChange,
  formatCurrency,
}: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-4">
        <div className="space-y-2">
          <Label className="text-xs font-bold text-muted-foreground">
            {t("customerReturn.create.refundMethod", "Refund Method")}
          </Label>
          <RadioGroup
            value={refundMethod}
            onValueChange={(val) =>
              onRefundMethodChange(val as "cash" | "credit")
            }
            className="flex items-center gap-6 pt-1"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="cash" id="cash" disabled={isPending} />
              <Label
                htmlFor="cash"
                className="text-xs font-semibold cursor-pointer"
              >
                {t("customerReturn.create.cash", "Cash")}
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="credit" id="credit" disabled={isPending} />
              <Label
                htmlFor="credit"
                className="text-xs font-semibold cursor-pointer"
              >
                {t("customerReturn.create.credit", "Credit Account")}
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-1.5 pt-2">
          <Label className="text-xs font-bold text-muted-foreground">
            {t("customerReturn.create.reason", "Return Reason")}
          </Label>
          <Textarea
            placeholder={t(
              "customerReturn.create.reasonPlaceholder",
              "Enter reason for return...",
            )}
            value={reason}
            onChange={(e) => onReasonChange(e.target.value)}
            disabled={isPending}
            className="text-xs bg-muted/40 border-border/80 min-h-20 focus:bg-background"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-muted-foreground">
            {t("customerReturn.create.notes", "Notes")}
          </Label>
          <Textarea
            placeholder={t(
              "customerReturn.create.notesPlaceholder",
              "Additional notes...",
            )}
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            disabled={isPending}
            className="text-xs bg-muted/40 border-border/80 min-h-20 focus:bg-background"
          />
        </div>
      </div>

      <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-4 flex flex-col justify-between">
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground pb-2 border-b border-border/60 flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-emerald-500" />
            {t("customerReturn.create.refundSummary", "Refund Summary")}
          </h2>

          <div className="space-y-2 text-xs pt-1">
            <div className="flex justify-between items-center text-muted-foreground">
              <span>{t("customerReturn.create.subtotal", "Subtotal")}</span>
              <span className="font-mono font-semibold text-foreground">
                {formatCurrency(subtotal)}
              </span>
            </div>
            <div className="flex justify-between items-center text-muted-foreground">
              <span>{t("customerReturn.create.tax", "Tax")}</span>
              <span className="font-mono font-semibold text-foreground">
                {formatCurrency(taxTotal)}
              </span>
            </div>
            <div className="flex justify-between items-center text-muted-foreground">
              <span>{t("customerReturn.create.discount", "Discount")}</span>
              <span className="font-mono font-semibold text-foreground">
                {formatCurrency(discountTotal)}
              </span>
            </div>
            <div className="pt-3 border-t border-border/80 flex justify-between items-center text-sm">
              <span className="font-bold text-foreground">
                {t("customerReturn.create.refundTotal", "Total Refund")}
              </span>
              <span className="font-mono font-extrabold text-emerald-500 text-base">
                {formatCurrency(refundTotal)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/60">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={() => navigate("/dashboard/customer-returns")}
            className="h-9 px-4 text-xs font-semibold hover:bg-muted"
          >
            {t("common.cancel", "Cancel")}
          </Button>

          <Button
            type="submit"
            size="sm"
            disabled={isPending}
            className="h-9 px-5 text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs flex items-center gap-2"
          >
            {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {t("customerReturn.create.submit", "Create Return")}
          </Button>
        </div>
      </div>
    </div>
  );
}
