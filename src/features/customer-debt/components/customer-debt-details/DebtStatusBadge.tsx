import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import type { DebtStatus } from "@/features/supplier-debt/types/SupplierDebt";

interface DebtStatusBadgeProps {
  status: DebtStatus;
}

export function DebtStatusBadge({ status }: DebtStatusBadgeProps) {
  const { t } = useTranslation();

  switch (status) {
    case "paid":
      return (
        <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
          {t("customerDebt.status.paid")}
        </Badge>
      );
    case "partial":
      return (
        <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20">
          {t("customerDebt.status.partial")}
        </Badge>
      );
    case "overdue":
      return (
        <Badge className="bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/20">
          {t("customerDebt.status.overdue")}
        </Badge>
      );
    case "cancelled":
      return (
        <Badge className="bg-muted text-muted-foreground border-border">
          {t("customerDebt.status.cancelled")}
        </Badge>
      );
    default:
      return (
        <Badge className="bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20">
          {t("customerDebt.status.open")}
        </Badge>
      );
  }
}
