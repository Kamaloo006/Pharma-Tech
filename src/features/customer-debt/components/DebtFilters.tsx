import React from "react";
import { useTranslation } from "react-i18next";
import { Filter, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  CustomerDebtsFilterParams,
  DebtStatus,
} from "@/features/customer-debt/types/customerDebt";

interface DebtFiltersProps {
  localFilters: CustomerDebtsFilterParams;
  setLocalFilters: React.Dispatch<
    React.SetStateAction<CustomerDebtsFilterParams>
  >;
  customersList: unknown[];
  isLoadingCustomers: boolean;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

const selectTriggerStyles =
  "h-9 text-xs bg-muted/80 hover:bg-muted text-foreground border-border/80 focus:ring-2 focus:ring-primary/20 focus:bg-background transition-colors font-medium";

const selectItemStyles =
  "text-xs focus:bg-primary/70 focus:text-foreground cursor-pointer font-medium";

export const DebtFilters: React.FC<DebtFiltersProps> = ({
  localFilters,
  setLocalFilters,
  customersList,
  isLoadingCustomers,
  onApplyFilters,
  onResetFilters,
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-card border border-border/60 rounded-xl p-4 mb-6 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-70">
          {/* Customer Filter */}
          <div className="w-full sm:w-52 space-y-1">
            <label className="text-[11px] font-bold text-muted-foreground">
              {t("customerDebt.filters.customer")}
            </label>
            <Select
              value={String(localFilters.customer_id || "all")}
              onValueChange={(val) =>
                setLocalFilters((prev) => ({ ...prev, customer_id: val }))
              }
              disabled={isLoadingCustomers}
            >
              <SelectTrigger className={selectTriggerStyles}>
                <SelectValue
                  placeholder={
                    isLoadingCustomers
                      ? t("common.loading")
                      : t("customerDebt.filters.allCustomers")
                  }
                />
              </SelectTrigger>
              <SelectContent className="bg-muted text-popover-foreground border-border shadow-md">
                <SelectItem value="all" className={selectItemStyles}>
                  {t("customerDebt.filters.allCustomers")}
                </SelectItem>
                {customersList.map((c: any) => (
                  <SelectItem
                    key={c.id}
                    value={String(c.id)}
                    className={selectItemStyles}
                  >
                    {c.full_name || c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="w-full sm:w-44 space-y-1">
            <label className="text-[11px] font-bold text-muted-foreground">
              {t("customerDebt.filters.status")}
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
                  placeholder={t("customerDebt.filters.allStatuses")}
                />
              </SelectTrigger>
              <SelectContent className="bg-muted text-popover-foreground border-border shadow-md">
                <SelectItem value="all" className={selectItemStyles}>
                  {t("customerDebt.filters.allStatuses")}
                </SelectItem>
                <SelectItem value="open" className={selectItemStyles}>
                  {t("customerDebt.status.open")}
                </SelectItem>
                <SelectItem value="partial" className={selectItemStyles}>
                  {t("customerDebt.status.partial")}
                </SelectItem>
                <SelectItem value="paid" className={selectItemStyles}>
                  {t("customerDebt.status.paid")}
                </SelectItem>
                <SelectItem value="overdue" className={selectItemStyles}>
                  {t("customerDebt.status.overdue")}
                </SelectItem>
                <SelectItem value="cancelled" className={selectItemStyles}>
                  {t("customerDebt.status.cancelled")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-4 sm:pt-0">
          <Button
            onClick={onResetFilters}
            variant="ghost"
            size="sm"
            className="h-9 text-xs font-semibold hover:bg-muted"
          >
            <RotateCcw className="h-3.5 w-3.5 me-1 text-muted-foreground" />
            {t("common.reset")}
          </Button>

          <Button
            onClick={onApplyFilters}
            size="sm"
            className="h-9 text-xs font-bold px-4"
          >
            <Filter className="h-3.5 w-3.5 me-1.5" />
            {t("common.applyFilters")}
          </Button>
        </div>
      </div>
    </div>
  );
};
