import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Filter, RotateCcw, Loader2, UserX, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CustomerReturnFilterParams } from "../types/CustomerReturn";
import { useCustomers } from "@/features/customers/hooks/useCustomers";
import type { Customer } from "@/features/customers/types/Customer";

interface CustomerReturnFiltersProps {
  filters: CustomerReturnFilterParams;
  onFilterChange: (updated: Partial<CustomerReturnFilterParams>) => void;
  onReset: () => void;
  isLoading?: boolean;
}

export function CustomerReturnFilters({
  filters,
  onFilterChange,
  onReset,
  isLoading = false,
}: CustomerReturnFiltersProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const { data: customersData, isLoading: isLoadingCustomers } = useCustomers({
    page: 1,
    per_page: 100,
  });

  const customers = customersData?.data || [];

  const [localFilters, setLocalFilters] = useState<CustomerReturnFilterParams>({
    customer_id: filters.customer_id || "all",
    original_sales_invoice_id: filters.original_sales_invoice_id || "",
    status: filters.status || "all",
    date_from: filters.date_from || "",
    date_to: filters.date_to || "",
    per_page: filters.per_page || 15,
    page: 1,
    walk_in: filters.walk_in !== undefined ? filters.walk_in : "all",
  });

  useEffect(() => {
    setLocalFilters({
      customer_id: filters.customer_id || "all",
      original_sales_invoice_id: filters.original_sales_invoice_id || "",
      status: filters.status || "all",
      date_from: filters.date_from || "",
      date_to: filters.date_to || "",
      per_page: filters.per_page || 15,
      page: filters.page || 1,
      walk_in: filters.walk_in !== undefined ? filters.walk_in : "all",
    });
  }, [filters]);

  const handleApply = () => {
    onFilterChange({ ...localFilters, page: 1 });
  };

  const handleReset = () => {
    const resetValues: CustomerReturnFilterParams = {
      customer_id: "all",
      original_sales_invoice_id: "",
      status: "all",
      date_from: "",
      date_to: "",
      per_page: 15,
      page: 1,
      walk_in: "all",
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 flex-1">
          {/* Customer Select */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-muted-foreground">
              {t("customerReturn.filters.customer", "Customer")}
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
                      ? t("common.loading", "Loading...")
                      : t(
                          "customerReturn.filters.allCustomers",
                          "All Customers",
                        )
                  }
                />
              </SelectTrigger>
              <SelectContent className="bg-muted text-popover-foreground border-border shadow-md max-h-60">
                <SelectItem value="all" className={selectItemStyles}>
                  {t("customerReturn.filters.allCustomers", "All Customers")}
                </SelectItem>

                {/* Walk-in Filter Option (walk_in = 1) */}
                <SelectItem
                  value="walk_in"
                  className={`${selectItemStyles} font-bold text-amber-600`}
                >
                  <div className="flex items-center gap-1.5">
                    <UserX className="w-3.5 h-3.5" />
                    {t(
                      "customerReturn.filters.walkInCustomers",
                      "Walk-in Customers (غير مسجل)",
                    )}
                  </div>
                </SelectItem>

                {/* All Registered Filter Option (walk_in = 0) */}
                <SelectItem
                  value="registered"
                  className={`${selectItemStyles} font-bold text-primary`}
                >
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    {t(
                      "customerReturn.filters.allRegistered",
                      "All Registered (كل المسجلين)",
                    )}
                  </div>
                </SelectItem>

                {/* Specific Registered Customers */}
                {customers.map((c: Customer) => (
                  <SelectItem
                    key={c.id}
                    value={String(c.id)}
                    className={selectItemStyles}
                  >
                    {c.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Original Sales Invoice Input */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-muted-foreground">
              {t("customerReturn.filters.originalInvoice", "Sales Invoice #")}
            </label>
            <Input
              type="text"
              placeholder="e.g. INV-2026"
              value={localFilters.original_sales_invoice_id || ""}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  original_sales_invoice_id: e.target.value,
                }))
              }
              className="h-9 text-xs bg-muted/80 hover:bg-muted font-mono border-border/80 focus:bg-background"
            />
          </div>

          {/* Status Select */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-muted-foreground">
              {t("customerReturn.filters.status", "Status")}
            </label>
            <Select
              value={String(localFilters.status || "all")}
              onValueChange={(val) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  status: val,
                }))
              }
            >
              <SelectTrigger className={selectTriggerStyles}>
                <SelectValue
                  placeholder={t(
                    "customerReturn.filters.allStatuses",
                    "All Statuses",
                  )}
                />
              </SelectTrigger>
              <SelectContent className="bg-muted text-popover-foreground border-border shadow-md">
                <SelectItem value="all" className={selectItemStyles}>
                  {t("customerReturn.filters.allStatuses", "All Statuses")}
                </SelectItem>
                <SelectItem value="completed" className={selectItemStyles}>
                  {t("customerReturn.status.completed", "Completed")}
                </SelectItem>
                <SelectItem value="approved" className={selectItemStyles}>
                  {t("customerReturn.status.approved", "Approved")}
                </SelectItem>
                <SelectItem value="pending" className={selectItemStyles}>
                  {t("customerReturn.status.pending", "Pending")}
                </SelectItem>
                <SelectItem value="cancelled" className={selectItemStyles}>
                  {t("customerReturn.status.cancelled", "Cancelled")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date From */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-muted-foreground">
              {t("customerReturn.filters.dateFrom", "Date From")}
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
              {t("customerReturn.filters.dateTo", "Date To")}
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
              {t("customerReturn.filters.perPage", "Per Page")}
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
            {t("common.reset", "Reset")}
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
            {t("common.applyFilters", "Apply")}
          </Button>
        </div>
      </div>
    </div>
  );
}
