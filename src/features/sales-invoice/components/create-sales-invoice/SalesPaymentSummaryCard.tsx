import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CreditCard } from "lucide-react";

interface PaymentSummaryCardProps {
  isArabic: boolean;
  totals: {
    subtotal: number;
    taxTotal: number;
    discountTotal: number;
    grandTotal: number;
  };
  paymentMethod: "cash" | "credit" | "debt";
  setPaymentMethod: (method: "cash" | "credit" | "debt") => void;
  amountPaid: number | string;
  setAmountPaid: (val: any) => void;
  notes: string;
  setNotes: (val: string) => void;
}

export function PaymentSummaryCard({
  isArabic,
  totals,
  paymentMethod,
  setPaymentMethod,
  amountPaid,
  setAmountPaid,
  notes,
  setNotes,
}: PaymentSummaryCardProps) {
  return (
    <Card className="border-border/60 shadow-xs rounded-2xl overflow-hidden">
      <CardHeader className="bg-muted/20 border-b border-border/60 pb-3">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-primary" />
          {isArabic ? "الدفع والملخص" : "Payment & Summary"}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Totals Section */}
        <div className="space-y-2 text-xs border-b border-border/60 pb-3">
          <div className="flex justify-between text-muted-foreground">
            <span>{isArabic ? "المجموع الفرعي" : "Subtotal"}</span>
            <span className="font-mono font-semibold text-foreground">
              {totals.subtotal.toLocaleString()} SYP
            </span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>{isArabic ? "إجمالي الضريبة" : "Tax"}</span>
            <span className="font-mono font-semibold text-foreground">
              +{totals.taxTotal.toLocaleString()} SYP
            </span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>{isArabic ? "إجمالي الخصم" : "Discount"}</span>
            <span className="font-mono font-semibold text-destructive">
              -{totals.discountTotal.toLocaleString()} SYP
            </span>
          </div>
          <div className="flex justify-between text-sm font-bold pt-2 border-t border-border/40">
            <span>{isArabic ? "المبلغ الإجمالي" : "Grand Total"}</span>
            <span className="font-mono text-primary">
              {totals.grandTotal.toLocaleString()} SYP
            </span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-muted-foreground">
            {isArabic ? "طريقة الدفع" : "Payment Method"}
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {(["cash", "credit", "debt"] as const).map((method) => (
              <Button
                key={method}
                type="button"
                variant={paymentMethod === method ? "default" : "outline"}
                size="sm"
                onClick={() => setPaymentMethod(method)}
                className="h-8 text-xs capitalize rounded-xl font-bold"
              >
                {method}
              </Button>
            ))}
          </div>
        </div>

        {/* Amount Paid */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-muted-foreground">
              {isArabic ? "المبلغ المدفوع" : "Amount Paid"}
            </label>
          </div>
          <Input
            type="number"
            min={0}
            value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value)}
            className="h-9 text-xs font-mono font-bold rounded-xl"
            placeholder="0"
          />
        </div>

        {/* Notes */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-muted-foreground">
            {isArabic ? "ملاحظات" : "Notes"}
          </label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={
              isArabic
                ? "إضافة ملاحظات حول الفاتورة..."
                : "Add notes about this invoice..."
            }
            className="text-xs rounded-xl resize-none h-20"
          />
        </div>
      </CardContent>
    </Card>
  );
}
