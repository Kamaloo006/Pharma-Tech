import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, Filter, Loader2, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type TransactionsFilterParams } from "../types/cashBox";

interface TransactionsFiltersProps {
  defaultFilters: TransactionsFilterParams;
  isLoading: boolean;
  onApply: (filters: TransactionsFilterParams) => void;
}

export default function TransactionsFilters({
  defaultFilters,
  isLoading,
  onApply,
}: TransactionsFiltersProps) {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [tempFilters, setTempFilters] = useState<TransactionsFilterParams>({
    ...defaultFilters,
  });

  const handleTempFilterChange = (
    key: keyof TransactionsFilterParams,
    value: any,
  ) => {
    setTempFilters((prev) => {
      if (key === "date_from" && prev.date_to && value > prev.date_to) {
        return { ...prev, [key]: value, date_to: "" };
      }
      if (key === "date_to" && prev.date_from && value < prev.date_from) {
        return { ...prev, [key]: value, date_from: "" };
      }
      return { ...prev, [key]: value };
    });
  };

  const TRANSACTION_TYPES = [
    { value: "all", ar: "الكل", en: "All" },
    { value: "sale_in", ar: "مبيعات (دخل)", en: "Sale In" },
    { value: "purchase_out", ar: "مشتريات (خرج)", en: "Purchase Out" },
    {
      value: "customer_return_out",
      ar: "مرتجع عميل (خرج)",
      en: "Customer Return Out",
    },
    {
      value: "supplier_return_in",
      ar: "مرتجع مورد (دخل)",
      en: "Supplier Return In",
    },
    {
      value: "customer_debt_payment_in",
      ar: "سداد ديون عميل (دخل)",
      en: "Customer Debt Payment In",
    },
    {
      value: "supplier_debt_payment_out",
      ar: "سداد ديون مورد (خرج)",
      en: "Supplier Debt Payment Out",
    },
    { value: "manual_in", ar: "إدخال يدوي (دخل)", en: "Manual In" },
    { value: "manual_out", ar: "إخراج يدوي (خرج)", en: "Manual Out" },
  ] as const;

  const handleApply = () => {
    onApply(tempFilters);
  };

  const handleReset = () => {
    setTempFilters({ ...defaultFilters });
    onApply(defaultFilters);
  };

  return (
    <div className="space-y-6">
      {/* هيدر التحكم */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-bold text-foreground">
            {isArabic ? "تصفية الحركات المالية" : "Filter Transactions"}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="h-9 text-xs gap-1.5"
            disabled={isLoading}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            {isArabic ? "إعادة تعيين" : "Reset"}
          </Button>
          <Button
            size="sm"
            onClick={handleApply}
            className="h-9 text-xs gap-1.5 px-4 font-semibold min-w-27.5"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                {isArabic ? "جاري البحث..." : "Applying..."}
              </>
            ) : (
              <>
                <Search className="h-3.5 w-3.5" />
                {isArabic ? "بحث وتطبيق" : "Apply Filters"}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* حقول المدخلات */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 items-end text-right">
        {/* بحث بالكلمة */}
        <div className="space-y-2 flex flex-col justify-end">
          <Label className="text-xs font-medium text-muted-foreground text-start">
            {isArabic ? "بحث بالكلمة" : "Search Keyword"}
          </Label>
          <div className="relative w-full">
            <Search
              className={`absolute top-3 h-4 w-4 text-muted-foreground ${isArabic ? "right-3" : "left-3"}`}
            />
            <Input
              placeholder={
                isArabic ? "ملاحظات، كود المستند..." : "Notes, doc code..."
              }
              value={tempFilters.search}
              onChange={(e) => handleTempFilterChange("search", e.target.value)}
              className={`h-10 text-xs bg-background border-border w-full ${isArabic ? "pr-9 text-right" : "pl-9"}`}
            />
          </div>
        </div>

        {/* نوع العملية */}
        <div className="space-y-2 flex flex-col justify-end">
          <Label className="text-xs font-medium text-muted-foreground text-start">
            {isArabic ? "نوع العملية" : "Transaction Type"}
          </Label>
          <Select
            value={tempFilters.type}
            onValueChange={(v) => handleTempFilterChange("type", v)}
          >
            <SelectTrigger className="h-10 text-xs bg-background border-border text-foreground w-full">
              <SelectValue
                placeholder={isArabic ? "اختر النوع" : "Select Type"}
              />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border border-border text-foreground z-50 shadow-xl max-h-75 overflow-y-auto">
              {TRANSACTION_TYPES.map((typeOption) => (
                <SelectItem
                  key={typeOption.value}
                  value={typeOption.value}
                  className="focus:bg-muted focus:text-foreground cursor-pointer text-xs"
                >
                  {isArabic ? typeOption.ar : typeOption.en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* من تاريخ */}
        <div className="space-y-2 flex flex-col justify-end">
          <Label className="text-xs font-medium text-muted-foreground text-start">
            {isArabic ? "من تاريخ" : "Date From"}
          </Label>
          <Input
            type="date"
            value={tempFilters.date_from}
            max={tempFilters.date_to || undefined}
            onChange={(e) =>
              handleTempFilterChange("date_from", e.target.value)
            }
            className="h-10 text-xs bg-background border-border text-center text-foreground font-mono w-full"
          />
        </div>

        {/* إلى تاريخ */}
        <div className="space-y-2 flex flex-col justify-end">
          <Label className="text-xs font-medium text-muted-foreground text-start">
            {isArabic ? "إلى تاريخ" : "Date To"}
          </Label>
          <Input
            type="date"
            value={tempFilters.date_to}
            min={tempFilters.date_from || undefined}
            onChange={(e) => handleTempFilterChange("date_to", e.target.value)}
            className="h-10 text-xs bg-background border-border text-center text-foreground font-mono w-full"
          />
        </div>

        {/* العناصر لكل صفحة */}
        <div className="space-y-2 flex flex-col justify-end">
          <Label className="text-xs font-medium text-muted-foreground text-start">
            {isArabic ? "العناصر لكل صفحة" : "Per Page"}
          </Label>
          <Select
            value={tempFilters.per_page}
            onValueChange={(v) => handleTempFilterChange("per_page", v)}
          >
            <SelectTrigger className="h-10 text-xs bg-background border-border text-foreground w-full">
              <SelectValue placeholder="15" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border border-border text-foreground z-50 shadow-xl">
              <SelectItem
                value="15"
                className="focus:bg-muted focus:text-foreground cursor-pointer"
              >
                15
              </SelectItem>
              <SelectItem
                value="30"
                className="focus:bg-muted focus:text-foreground cursor-pointer"
              >
                30
              </SelectItem>
              <SelectItem
                value="50"
                className="focus:bg-muted focus:text-foreground cursor-pointer"
              >
                50
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
