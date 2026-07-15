// features/finance/components/CreateCashBoxForm.tsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Coins } from "lucide-react";

interface CreateCashBoxFormProps {
  onCreate: (
    openingBalance: number,
  ) => Promise<{ success: boolean; error?: string }>;
  isSubmitting: boolean;
}

export default function CreateCashBoxForm({
  onCreate,
  isSubmitting,
}: CreateCashBoxFormProps) {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [openingBalance, setOpeningBalance] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericBalance = Number(openingBalance);

    if (isNaN(numericBalance) || numericBalance < 0) {
      toast.error(
        isArabic
          ? "يرجى إدخال رصيد افتتاحي صحيح"
          : "Please enter a valid opening balance",
      );
      return;
    }

    const result = await onCreate(numericBalance);

    if (result.success) {
      toast.success(
        isArabic
          ? "تم فتح صندوق الصيدلية بنجاح"
          : "Cash box created successfully",
      );
    } else {
      toast.error(
        result.error ||
          (isArabic
            ? "حدث خطأ أثناء إنشاء الصندوق"
            : "Error creating cash box"),
      );
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[75vh] p-4"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="max-w-md w-full rounded-2xl border border-border bg-card p-8 space-y-6 shadow-md text-center animate-in fade-in zoom-in-95 duration-150">
        <div className="mx-auto w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500">
          <Coins className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">
            {isArabic ? "💰 إعداد الصندوق المالي" : "💰 Cash Box Setup"}
          </h2>
          <p className="text-sm text-muted-foreground px-2">
            {isArabic
              ? "لم يتم العثور على صندوق مالي نشط لهذه الصيدلية. يرجى تعيين الرصيد الافتتاحي لفتح الصندوق وبدء العمليات."
              : "No active cash box found for this pharmacy. Please set the opening balance to initialize the cash box."}
          </p>
        </div>
        <hr className="border-border/60" />
        <form onSubmit={handleSubmit} className="space-y-4 text-right">
          <div className="space-y-2">
            <Label
              htmlFor="opening_balance"
              className="text-muted-foreground text-xs font-semibold block"
            >
              {isArabic
                ? "الرصيد الافتتاحي للصندوق"
                : "Cash Box Opening Balance"}
            </Label>
            <Input
              id="opening_balance"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={openingBalance}
              onChange={(e) => setOpeningBalance(e.target.value)}
              className="text-center font-mono text-lg bg-background border-border text-foreground"
              disabled={isSubmitting}
              required
              autoFocus
            />
          </div>
          <Button
            type="submit"
            className="w-full text-sm font-semibold h-11"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            {isArabic ? "تأكيد وفتح الصندوق" : "Confirm & Open Box"}
          </Button>
        </form>
      </div>
    </div>
  );
}
