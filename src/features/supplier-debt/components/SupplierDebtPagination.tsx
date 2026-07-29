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
import type { PaginationMeta } from "@/features/supplier-debt/types/SupplierDebt";

interface SupplierDebtPaginationProps {
  meta: PaginationMeta | null | undefined;
  onPageChange: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  isLoading?: boolean;
}

export function SupplierDebtPagination({
  meta,
  onPageChange,
  onPerPageChange,
  isLoading = false,
}: SupplierDebtPaginationProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  if (!meta || meta.total <= 0) return null;

  const currentPage = meta.current_page || 1;
  const lastPage = meta.last_page || 1;

  return (
    <div
      className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 py-4 px-2 border-t border-border/40"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span>
          {t("common.showing", "Showing")}{" "}
          <strong className="text-foreground font-mono">
            {meta.from || 0}
          </strong>{" "}
          -{" "}
          <strong className="text-foreground font-mono">{meta.to || 0}</strong>{" "}
          {t("common.of", "of")}{" "}
          <strong className="text-foreground font-mono">{meta.total}</strong>
        </span>

        {onPerPageChange && (
          <div className="flex items-center gap-2 ms-2">
            <span className="hidden md:inline">
              {t("common.perPage", "Per page:")}
            </span>
            <Select
              value={String(meta.per_page || 15)}
              onValueChange={(val) => onPerPageChange(Number(val))}
              disabled={isLoading}
            >
              <SelectTrigger className="h-8 w-16 text-xs font-mono">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-muted">
                <SelectItem
                  className="hover:bg-primary/70 hover:text-foreground"
                  value="10"
                >
                  10
                </SelectItem>
                <SelectItem
                  className="hover:bg-primary/70 hover:text-foreground"
                  value="15"
                >
                  15
                </SelectItem>
                <SelectItem
                  className="hover:bg-primary/70 hover:text-foreground"
                  value="25"
                >
                  25
                </SelectItem>
                <SelectItem
                  className="hover:bg-primary/70 hover:text-foreground"
                  value="50"
                >
                  50
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 text-xs"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1 || isLoading}
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
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
        >
          {isArabic ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>

        <div className="flex items-center px-3 text-xs font-medium">
          <span className="font-mono font-bold text-foreground me-1">
            {currentPage}
          </span>
          <span className="text-muted-foreground">/</span>
          <span className="font-mono text-muted-foreground ms-1">
            {lastPage}
          </span>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 text-xs"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === lastPage || isLoading}
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
          onClick={() => onPageChange(lastPage)}
          disabled={currentPage === lastPage || isLoading}
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
}
