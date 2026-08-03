import React from "react";
import { useTranslation } from "react-i18next";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CustomerDebtsFilterParams } from "@/features/customer-debt/types/customerDebt";

interface DebtPaginationProps {
  meta: {
    from: number | null;
    to: number | null;
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
  };
  isArabic: boolean;
  onPageChange: (newPage: number) => void;
  setFilters: React.Dispatch<React.SetStateAction<CustomerDebtsFilterParams>>;
}

export const DebtPagination: React.FC<DebtPaginationProps> = ({
  meta,
  isArabic,
  onPageChange,
  setFilters,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 py-4 px-2 border-t border-border/40"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span>
          {t("common.showing")}{" "}
          <strong className="text-foreground font-mono">
            {meta.from || 0}
          </strong>{" "}
          -{" "}
          <strong className="text-foreground font-mono">{meta.to || 0}</strong>{" "}
          {t("common.of")}{" "}
          <strong className="text-foreground font-mono">{meta.total}</strong>
        </span>

        <div className="flex items-center gap-2 ms-2">
          <span className="hidden md:inline">{t("common.perPage")}</span>
          <Select
            value={String(meta.per_page)}
            onValueChange={(val) =>
              setFilters((prev) => ({
                ...prev,
                per_page: Number(val),
                page: 1,
              }))
            }
          >
            <SelectTrigger className="h-8 w-18 text-xs font-mono">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-muted">
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="15">15</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 text-xs"
          onClick={() => onPageChange(1)}
          disabled={meta.current_page === 1}
        >
          {isArabic ? (
            <ChevronsRight className="h-4 w-4" />
          ) : (
            <ChevronsLeft className="h-4 w-4" />
          )}
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 text-xs"
          onClick={() => onPageChange(meta.current_page - 1)}
          disabled={meta.current_page === 1}
        >
          {isArabic ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>

        <div className="flex items-center px-3 text-xs font-medium">
          <span className="font-mono font-bold text-foreground me-1">
            {meta.current_page}
          </span>
          <span className="text-muted-foreground">/</span>
          <span className="font-mono text-muted-foreground ms-1">
            {meta.last_page}
          </span>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 text-xs"
          onClick={() => onPageChange(meta.current_page + 1)}
          disabled={meta.current_page === meta.last_page}
        >
          {isArabic ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 text-xs"
          onClick={() => onPageChange(meta.last_page)}
          disabled={meta.current_page === meta.last_page}
        >
          {isArabic ? (
            <ChevronsLeft className="h-4 w-4" />
          ) : (
            <ChevronsRight className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};
