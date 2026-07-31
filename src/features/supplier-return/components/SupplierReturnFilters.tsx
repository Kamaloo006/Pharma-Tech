import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Filter, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSuppliers } from "@/features/suppliers/hooks/useSuppliers";
import type {
  SupplierReturnFilterParams,
  ReturnStatus,
} from "@/features/supplier-return/types/SupplierReturn";

interface SupplierReturnFiltersProps {
  filters: SupplierReturnFilterParams;
  onFilterChange: (updated: Partial<SupplierReturnFilterParams>) => void;
  onReset: () => void;
  isLoading?: boolean;
}

export function SupplierReturnFilters({
  filters,
  onFilterChange,
  onReset,
  isLoading = false,
}: SupplierReturnFiltersProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const { suppliers, isLoading: isLoadingSuppliers } = useSuppliers();

  const [localFilters, setLocalFilters] = useState<SupplierReturnFilterParams>({
    supplier_id: filters.supplier_id || "all",
    status: filters.status || "all",
    date_from: filters.date_from || "",
    date_to: filters.date_to || "",
    per_page: filters.per_page || 15,
    page: 1,
  });

  useEffect(() => {
    setLocalFilters({
      supplier_id: filters.supplier_id || "all",
      status: filters.status || "all",
      date_from: filters.date_from || "",
      date_to: filters.date_to || "",
      per_page: filters.per_page || 15,
      page: filters.page || 1,
    });
  }, [filters]);

  const handleApply = () => {
    onFilterChange({ ...localFilters, page: 1 });
  };

  const handleReset = () => {
    const resetValues: SupplierReturnFilterParams = {
      supplier_id: "all",
      status: "all",
      date_from: "",
      date_to: "",
      per_page: 15,
      page: 1,
    };
    setLocalFilters(resetValues);
    onReset();
  };

  const selectTriggerStyles =
    "h-9 text-xs bg-muted/80 hover:bg-muted text-foreground border-border/80 focus:ring-2 focus:ring-primary/20 focus:bg-background transition-colors font-medium";

  const selectItemStyles =
    "text-xs focus:bg-primary/70 focus:text-foreground cursor-pointer font-medium";

  return (
    <div
      className="bg-card border border-border/60 rounded-xl p-4 mb-6 shadow-xs"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 flex-1">
          {/* Supplier Select */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-muted-foreground">
              {t("supplierReturn.filters.supplier")}
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
                      ? t("common.loading")
                      : t("supplierReturn.filters.allSuppliers")
                  }
                />
              </SelectTrigger>
              <SelectContent className="bg-muted text-popover-foreground border-border shadow-md">
                <SelectItem value="all" className={selectItemStyles}>
                  {t("supplierReturn.filters.allSuppliers")}
                </SelectItem>
                {suppliers?.map((s: { id: string | number; name: string }) => (
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

          {/* Status Select */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-muted-foreground">
              {t("supplierReturn.filters.status")}
            </label>
            <Select
              value={String(localFilters.status || "all")}
              onValueChange={(val) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  status: val as ReturnStatus | "all",
                }))
              }
            >
              <SelectTrigger className={selectTriggerStyles}>
                <SelectValue
                  placeholder={t("supplierReturn.filters.allStatuses")}
                />
              </SelectTrigger>
              <SelectContent className="bg-muted text-popover-foreground border-border shadow-md">
                <SelectItem value="all" className={selectItemStyles}>
                  {t("supplierReturn.filters.allStatuses")}
                </SelectItem>
                <SelectItem value="completed" className={selectItemStyles}>
                  {t("supplierReturn.status.completed")}
                </SelectItem>
                <SelectItem value="approved" className={selectItemStyles}>
                  {t("supplierReturn.status.approved")}
                </SelectItem>
                <SelectItem value="pending" className={selectItemStyles}>
                  {t("supplierReturn.status.pending")}
                </SelectItem>
                <SelectItem value="cancelled" className={selectItemStyles}>
                  {t("supplierReturn.status.cancelled")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date From */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-muted-foreground">
              {t("supplierReturn.filters.dateFrom")}
            </label>
            <Input
              type="date"
              value={localFilters.date_from || ""}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  date_from: e.target.value,
                }))
              }
              className="h-9 text-xs bg-muted/80 hover:bg-muted font-mono border-border/80 focus:bg-background"
            />
          </div>

          {/* Date To */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-muted-foreground">
              {t("supplierReturn.filters.dateTo")}
            </label>
            <Input
              type="date"
              value={localFilters.date_to || ""}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  date_to: e.target.value,
                }))
              }
              className="h-9 text-xs bg-muted/80 hover:bg-muted font-mono border-border/80 focus:bg-background"
            />
          </div>

          {/* Per Page Select */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-muted-foreground">
              {t("supplierReturn.filters.perPage")}
            </label>
            <Select
              value={String(localFilters.per_page || 15)}
              onValueChange={(val) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  per_page: Number(val),
                }))
              }
            >
              <SelectTrigger className={selectTriggerStyles}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-muted text-popover-foreground border-border shadow-md">
                <SelectItem value="10" className={selectItemStyles}>
                  10
                </SelectItem>
                <SelectItem value="15" className={selectItemStyles}>
                  15
                </SelectItem>
                <SelectItem value="25" className={selectItemStyles}>
                  25
                </SelectItem>
                <SelectItem value="50" className={selectItemStyles}>
                  50
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 sm:pt-0">
          <Button
            onClick={handleReset}
            variant="ghost"
            size="sm"
            className="h-9 text-xs font-semibold hover:bg-muted"
            disabled={isLoading}
          >
            <RotateCcw className="h-3.5 w-3.5 me-1 text-muted-foreground" />
            {t("common.reset")}
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
            {t("common.applyFilters")}
          </Button>
        </div>
      </div>
    </div>
  );
}
