import { useTranslation } from "react-i18next";
import { Landmark, Loader2 } from "lucide-react";

import { useCashBox } from "@/features/cashbox/hooks/useCashbox";
import CreateCashBoxForm from "@/features/cashbox/components/CreateCashBoxFrom";
import StatCards from "@/features/cashbox/components/StatCards";
import CashBoxChart from "@/features/cashbox/components/CashBoxChart";
import TransactionsTable from "@/features/cashbox/components/TransactionsTable";

export default function CashBoxPage() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const { cashBox, statistics, isLoading, isSubmitting, createCashBox } =
    useCashBox();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground mt-4">
          {t("cashbox.page.loading")}
        </p>
      </div>
    );
  }

  if (!cashBox) {
    return (
      <CreateCashBoxForm onCreate={createCashBox} isSubmitting={isSubmitting} />
    );
  }

  return (
    <div className="p-6 space-y-6" dir={isArabic ? "rtl" : "ltr"}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          {t("cashbox.page.title")}
          <Landmark className="text-primary" />
        </h1>
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          {t("cashbox.page.statusActive")}
        </span>
      </div>

      <StatCards cashBox={cashBox} statistics={statistics} />

      <CashBoxChart cashBoxId={cashBox.id} />

      <TransactionsTable cashBoxId={cashBox.id} />
    </div>
  );
}
