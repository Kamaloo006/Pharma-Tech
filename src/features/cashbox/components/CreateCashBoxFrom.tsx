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
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [openingBalance, setOpeningBalance] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericBalance = Number(openingBalance);

    if (isNaN(numericBalance) || numericBalance < 0) {
      toast.error(t("cashbox.form.validation.invalidBalance"));
      return;
    }

    const result = await onCreate(numericBalance);

    if (result.success) {
      toast.success(t("cashbox.form.notifications.success"));
    } else {
      toast.error(result.error || t("cashbox.form.notifications.error"));
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
            {t("cashbox.form.title")}
          </h2>
          <p className="text-sm text-muted-foreground px-2">
            {t("cashbox.form.description")}
          </p>
        </div>
        <hr className="border-border/60" />
        <form onSubmit={handleSubmit} className="space-y-4 text-right">
          <div className="space-y-2">
            <Label
              htmlFor="opening_balance"
              className={`text-muted-foreground text-xs font-semibold block ${isArabic ? "text-right" : "text-left"}`}
            >
              {t("cashbox.form.label")}
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
            {isSubmitting && (
              <Loader2
                className={`h-4 w-4 animate-spin ${isArabic ? "ml-2" : "mr-2"}`}
              />
            )}
            {t("cashbox.form.submit")}
          </Button>
        </form>
      </div>
    </div>
  );
}
