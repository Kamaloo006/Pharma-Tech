import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreditCard, DollarSign, Save } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PaymentDetailsCardProps {
  paymentMethod: "cash" | "credit" | "debt";
  setPaymentMethod: (val: "cash" | "credit" | "debt") => void;
  amountPaid: number;
  setAmountPaid: (val: number) => void;
  grandTotal: number;
  isAmountPaidExceeded: boolean;
  remainingAmount: number;
  paymentStatus: string;
  isSaveDisabled: boolean;
  onSaveInvoice: () => void;
}

export function PaymentDetailsCard({
  paymentMethod,
  setPaymentMethod,
  amountPaid,
  setAmountPaid,
  grandTotal,
  isAmountPaidExceeded,
  remainingAmount,
  paymentStatus,
  isSaveDisabled,
  onSaveInvoice,
}: PaymentDetailsCardProps) {
  const { t } = useTranslation();

  return (
    <Card className="border-border bg-card shadow-sm rounded-2xl">
      <CardHeader className="pb-3 border-b border-border/40">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-primary" />
          {t("purchaseInvoice.payment.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5 space-y-4">
        {/* اختيار طريقة الدفع */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground">
            {t("purchaseInvoice.payment.methodLabel")}
          </label>
          <Select
            value={paymentMethod}
            onValueChange={(val: "cash" | "credit" | "debt") => {
              setPaymentMethod(val);
              if (val === "cash") setAmountPaid(grandTotal);
              if (val === "debt") setAmountPaid(0);
            }}
          >
            <SelectTrigger className="h-10 text-xs bg-background border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-muted border border-border text-foreground">
              <SelectItem
                value="cash"
                className="text-xs focus:bg-background focus:text-foreground"
              >
                {t("purchaseInvoice.payment.methods.cash")}
              </SelectItem>
              <SelectItem
                value="credit"
                className="text-xs focus:bg-background focus:text-foreground"
              >
                {t("purchaseInvoice.payment.methods.credit")}
              </SelectItem>
              <SelectItem
                value="debt"
                className="text-xs focus:bg-background focus:text-foreground"
              >
                {t("purchaseInvoice.payment.methods.debt")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* المبلغ المدفوع */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground">
            {t("purchaseInvoice.payment.amountPaidLabel")}
          </label>

          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="number"
              step="0.01"
              min="0"
              value={amountPaid}
              onChange={(e) => setAmountPaid(Number(e.target.value))}
              className={`h-10 pl-9 font-bold text-sm bg-background border-border ${
                isAmountPaidExceeded
                  ? "border-destructive text-destructive focus-visible:ring-destructive"
                  : ""
              }`}
            />
          </div>

          {/* رسالة الخطأ المباشرة */}
          {isAmountPaidExceeded && (
            <p className="text-[11px] font-medium text-destructive mt-1 flex items-center gap-1">
              ⚠️ {t("purchaseInvoice.payment.amountExceededError")}
            </p>
          )}
        </div>

        {/* الحساب المتبقي والحالة */}
        <div className="p-3.5 bg-muted/50 rounded-xl border border-border/50 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground font-medium">
              {t("purchaseInvoice.payment.remainingLabel")}
            </span>
            <span
              className={`font-extrabold font-mono text-sm ${
                remainingAmount > 0 ? "text-destructive" : "text-emerald-500"
              }`}
            >
              {remainingAmount.toFixed(2)} {t("common.currency")}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs border-t border-border/40 pt-2">
            <span className="text-muted-foreground font-medium">
              {t("purchaseInvoice.payment.statusLabel")}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
              {paymentStatus}
            </span>
          </div>
        </div>

        {/* زر الحفظ */}
        <Button
          onClick={onSaveInvoice}
          disabled={isSaveDisabled}
          className="w-full h-11 text-xs font-bold gap-2 shadow-sm mt-2"
        >
          <Save className="h-4 w-4" />
          {t("purchaseInvoice.payment.saveInvoiceBtn")}
        </Button>
      </CardContent>
    </Card>
  );
}
