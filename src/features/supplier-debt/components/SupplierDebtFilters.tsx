import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Filter, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSuppliers } from "@/features/suppliers/hooks/useSuppliers";
import type {
  DebtsFilterParams,
  DebtStatus,
} from "@/features/supplier-debt/types/SupplierDebt";

interface SupplierDebtFiltersProps {
  filters: DebtsFilterParams;
  onApplyFilters: (newFilters: DebtsFilterParams) => void;
  onResetFilters: () => void;
  isLoading?: boolean;
}

export function SupplierDebtFilters({
  filters,
  onApplyFilters,
  onResetFilters,
  isLoading = false,
}: SupplierDebtFiltersProps) {
  const { t } = useTranslation();

  const { suppliers, isLoading: isLoadingSuppliers } = useSuppliers();

  const [localFilters, setLocalFilters] = useState<DebtsFilterParams>({
    supplier_id: filters.supplier_id || "all",
    status: filters.status || "all",
  });

  const handleApply = () => {
    onApplyFilters(localFilters);
  };

  const handleReset = () => {
    const resetValues: DebtsFilterParams = {
      supplier_id: "all",
      status: "all",
    };
    setLocalFilters(resetValues);
    onResetFilters();
  };

  const selectTriggerStyles =
    "h-9 text-xs bg-muted/80 hover:bg-muted text-foreground border-border/80 focus:ring-2 focus:ring-primary/20 focus:bg-background transition-colors font-medium";

  const selectItemStyles =
    "text-xs focus:bg-primary/70 focus:text-foreground cursor-pointer font-medium";

  return (
    <div className="bg-card border border-border/60 rounded-xl p-4 mb-6 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-70">
          <div className="w-full sm:w-52 space-y-1">
            <label className="text-[11px] font-bold text-muted-foreground">
              {t("supplierDebt.filters.supplier", "المورد")}
            </label>
            <Select
              value={String(localFilters.supplier_id || "all")}
              onValueChange={(val) =>
                setLocalFilters((prev) => ({ ...prev, supplier_id: val }))
              }
              disabled={isLoadingSuppliers}
            >
              <SelectTrigger className={selectTriggerStyles}>
                <SelectValue
                  placeholder={
                    isLoadingSuppliers
                      ? t("common.loading", "جاري التحميل...")
                      : t("supplierDebt.filters.allSuppliers", "جميع الموردين")
                  }
                />
              </SelectTrigger>
              <SelectContent className="bg-muted text-popover-foreground border-border shadow-md">
                <SelectItem value="all" className={selectItemStyles}>
                  {t("supplierDebt.filters.allSuppliers", "جميع الموردين")}
                </SelectItem>
                {suppliers.map((s: { id: string | number; name: string }) => (
                  <SelectItem
                    key={s.id}
                    value={String(s.id)}
                    className={selectItemStyles}
                  >
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-44 space-y-1">
            <label className="text-[11px] font-bold text-muted-foreground">
              {t("supplierDebt.filters.status", "حالة الدين")}
            </label>
            <Select
              value={String(localFilters.status || "all")}
              onValueChange={(val) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  status: val as DebtStatus | "all",
                }))
              }
            >
              <SelectTrigger className={selectTriggerStyles}>
                <SelectValue
                  placeholder={t(
                    "supplierDebt.filters.allStatuses",
                    "جميع الحالات",
                  )}
                />
              </SelectTrigger>
              <SelectContent className="bg-muted text-popover-foreground border-border shadow-md">
                <SelectItem value="all" className={selectItemStyles}>
                  {t("supplierDebt.filters.allStatuses", "جميع الحالات")}
                </SelectItem>
                <SelectItem value="open" className={selectItemStyles}>
                  {t("supplierDebt.status.open", "غير مدفوع")}
                </SelectItem>
                <SelectItem value="partial" className={selectItemStyles}>
                  {t("supplierDebt.status.partial", "مدفوع جزئياً")}
                </SelectItem>
                <SelectItem value="paid" className={selectItemStyles}>
                  {t("supplierDebt.status.paid", "مكتمل")}
                </SelectItem>
                <SelectItem value="overdue" className={selectItemStyles}>
                  {t("supplierDebt.status.overdue", "متأخر")}
                </SelectItem>
                <SelectItem value="cancelled" className={selectItemStyles}>
                  {t("supplierDebt.status.cancelled", "ملغى")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-4 sm:pt-0">
          <Button
            onClick={handleReset}
            variant="ghost"
            size="sm"
            className="h-9 text-xs font-semibold hover:bg-muted"
            disabled={isLoading}
          >
            <RotateCcw className="h-3.5 w-3.5 me-1 text-muted-foreground" />
            {t("common.reset", "إعادة ضبط")}
          </Button>

          <Button
            onClick={handleApply}
            size="sm"
            className="h-9 text-xs font-bold px-4"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-3.5 w-3.5 me-1.5 animate-spin" />
            ) : (
              <Filter className="h-3.5 w-3.5 me-1.5" />
            )}
            {t("common.applyFilters", "تطبيق الفلاتر")}
          </Button>
        </div>
      </div>
    </div>
  );
}
