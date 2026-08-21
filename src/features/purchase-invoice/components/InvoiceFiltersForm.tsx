import {
  type Control,
  Controller,
  type UseFormHandleSubmit,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Search, RotateCcw, Filter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type InvoiceFilters } from "../types/purchase-invoice";
import type { Supplier } from "@/features/suppliers/types/Supplier";

interface InvoiceFiltersFormProps {
  control: Control<InvoiceFilters>;
  handleSubmit: UseFormHandleSubmit<InvoiceFilters>;
  onSubmit: (formData: InvoiceFilters) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  hasActiveFilters: boolean;
  handleResetFilters: () => void;
  isFiltersChanged: boolean;
  showFilterLoading: boolean;
  isLoadingSuppliers: boolean;
  suppliers: Supplier[];
  isArabic: boolean;
  fromDateValue?: string;
  toDateValue?: string;
}

export function InvoiceFiltersForm({
  control,
  handleSubmit,
  onSubmit,
  searchTerm,
  setSearchTerm,
  hasActiveFilters,
  handleResetFilters,
  isFiltersChanged,
  showFilterLoading,
  isLoadingSuppliers,
  suppliers,
  fromDateValue,
  toDateValue,
}: InvoiceFiltersFormProps) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-4 bg-muted/20 border-b border-border/60 text-start space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-xs">
            <Search
              className={`absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground ${
                isRtl ? "right-3" : "left-3"
              }`}
            />
            <Input
              placeholder={t("purchaseInvoice.filters.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`h-9 text-xs rounded-xl ${
                isRtl ? "pr-9 pl-4" : "pl-9 pr-4"
              }`}
            />
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            {hasActiveFilters && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleResetFilters}
                disabled={showFilterLoading}
                className="h-9 px-3 text-xs font-bold text-destructive hover:bg-destructive/5 gap-1.5 rounded-xl"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>{t("purchaseInvoice.filters.reset")}</span>
              </Button>
            )}

            <Button
              type="submit"
              disabled={!isFiltersChanged || showFilterLoading}
              className="h-9 px-4 text-xs font-bold gap-1.5 shadow-sm rounded-xl transition-all"
            >
              {showFilterLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Filter className="h-3.5 w-3.5" />
              )}
              <span>{t("purchaseInvoice.filters.apply")}</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-1">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground">
              {t("purchaseInvoice.filters.supplier")}
            </span>
            <Controller
              name="supplier_id"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value || "all"}
                >
                  <SelectTrigger className="h-9 w-full rounded-xl border border-input bg-muted hover:bg-secondary/80 text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary">
                    <SelectValue
                      placeholder={t("purchaseInvoice.filters.selectSupplier")}
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-muted border-border shadow-md">
                    <SelectItem
                      value="all"
                      className="text-xs font-semibold cursor-pointer hover:bg-primary/70"
                    >
                      {isLoadingSuppliers
                        ? t("common.loading")
                        : t("purchaseInvoice.filters.allSuppliers")}
                    </SelectItem>
                    {suppliers.map((s: any) => (
                      <SelectItem
                        key={s.id}
                        value={s.id.toString()}
                        className="text-xs font-semibold cursor-pointer hover:bg-primary/70"
                      >
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground">
              {t("purchaseInvoice.filters.status")}
            </span>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value || "all"}
                >
                  <SelectTrigger className="h-9 w-full rounded-xl border border-input bg-muted hover:bg-secondary/80 text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-muted border-border shadow-md">
                    <SelectItem
                      value="all"
                      className="text-xs font-semibold cursor-pointer hover:bg-primary/70"
                    >
                      {t("purchaseInvoice.filters.allStatuses")}
                    </SelectItem>
                    <SelectItem
                      value="completed"
                      className="text-xs font-semibold cursor-pointer hover:bg-primary/70"
                    >
                      {t("purchaseInvoice.status.completed")}
                    </SelectItem>
                    <SelectItem
                      value="cancelled"
                      className="text-xs font-semibold cursor-pointer"
                    >
                      {t("purchaseInvoice.status.cancelled")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground">
              {t("purchaseInvoice.filters.paymentStatus")}
            </span>
            <Controller
              name="payment_status"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value || "all"}
                >
                  <SelectTrigger className="h-9 w-full rounded-xl border border-input bg-muted hover:bg-secondary/80 text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-muted border-border shadow-md ">
                    <SelectItem
                      value="all"
                      className="text-xs font-semibold cursor-pointer hover:bg-primary/70"
                    >
                      {t("purchaseInvoice.filters.allPayments")}
                    </SelectItem>
                    <SelectItem
                      value="paid"
                      className="text-xs font-semibold cursor-pointer hover:bg-primary/70"
                    >
                      {t("purchaseInvoice.paymentStatus.paid")}
                    </SelectItem>
                    <SelectItem
                      value="partial"
                      className="text-xs font-semibold cursor-pointer hover:bg-primary/70"
                    >
                      {t("purchaseInvoice.paymentStatus.partial")}
                    </SelectItem>
                    <SelectItem
                      value="unpaid"
                      className="text-xs font-semibold cursor-pointer hover:bg-primary/70"
                    >
                      {t("purchaseInvoice.paymentStatus.unpaid")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground">
              {t("purchaseInvoice.filters.fromDate")}
            </span>
            <Controller
              name="from_date"
              control={control}
              render={({ field }) => (
                <Input
                  type="date"
                  value={field.value || ""}
                  onChange={(e) => {
                    const nextFromDate = e.target.value;
                    field.onChange(nextFromDate);
                  }}
                  max={toDateValue || undefined}
                  className="h-9 text-xs font-semibold rounded-xl bg-muted text-foreground border-input"
                />
              )}
            />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground">
              {t("purchaseInvoice.filters.toDate")}
            </span>
            <Controller
              name="to_date"
              control={control}
              render={({ field }) => (
                <Input
                  type="date"
                  value={field.value || ""}
                  onChange={(e) => {
                    const nextToDate = e.target.value;
                    if (fromDateValue && nextToDate <= fromDateValue) {
                      field.onChange("");
                      return;
                    }
                    field.onChange(nextToDate);
                  }}
                  min={fromDateValue || ""}
                  className="h-9 text-xs font-semibold rounded-xl bg-muted text-foreground border-input"
                />
              )}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
