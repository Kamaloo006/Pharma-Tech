// features/finance/components/TransactionsTable.tsx
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCashBoxTransactions } from "../hooks/useCashbox";
import { type TransactionsFilterParams } from "../types/cashBox";
import TransactionsFilters from "./TransactionsFilters";

interface TransactionsTableProps {
  cashBoxId: number;
}

export default function TransactionsTable({
  cashBoxId,
}: TransactionsTableProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const defaultFilters: TransactionsFilterParams = {
    page: 1,
    per_page: "15",
    type: "all",
    search: "",
    date_from: "",
    date_to: "",
  };

  const TRANSACTION_BADGE_STYLES: Record<string, string> = {
    sale_in: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    supplier_return_in:
      "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    customer_debt_payment_in: "bg-teal-500/10 text-teal-400 border-teal-500/20",
    manual_in: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",

    purchase_out: "bg-destructive/10 text-destructive border-destructive/20",
    customer_return_out:
      "bg-destructive/10 text-destructive border-destructive/20",
    supplier_debt_payment_out:
      "bg-amber-500/10 text-amber-500 border-amber-500/20",
    manual_out: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  };

  // مخرجات المفاتيح المتوافقة مع هيكل ملف الترجمة json
  const TRANSACTION_TRANSLATION_KEYS: Record<string, string> = {
    sale_in: "saleIn",
    purchase_out: "purchaseOut",
    customer_return_out: "customerReturnOut",
    supplier_return_in: "supplierReturnIn",
    customer_debt_payment_in: "customerDebtPaymentIn",
    supplier_debt_payment_out: "supplierDebtPaymentOut",
    manual_in: "manualIn",
    manual_out: "manualOut",
  };

  const [appliedFilters, setAppliedFilters] =
    useState<TransactionsFilterParams>({
      ...defaultFilters,
    });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isLoading: isQueryLoading } = useCashBoxTransactions(
    appliedFilters,
    !!cashBoxId,
  );

  const isCombinedLoading = isQueryLoading || isSubmitting;

  useEffect(() => {
    if (!isQueryLoading) {
      setIsSubmitting(false);
    }
  }, [isQueryLoading]);

  const handleFilterApply = (newFilters: TransactionsFilterParams) => {
    setIsSubmitting(true);
    setAppliedFilters({
      ...newFilters,
      page: 1,
    });
    setTimeout(() => setIsSubmitting(false), 400);
  };

  const handlePageChange = (newPage: number) => {
    setIsSubmitting(true);
    setAppliedFilters((prev) => ({ ...prev, page: newPage }));
  };

  const transactions = data?.data || [];
  const meta = data?.meta || null;

  return (
    <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-6">
      {/* استدعاء مكون الفلاتر المفصول */}
      <TransactionsFilters
        defaultFilters={defaultFilters}
        isLoading={isCombinedLoading}
        onApply={handleFilterApply}
      />

      {/* قسم جدول الحركات (Shadcn Table) */}
      <div className="overflow-x-auto rounded-xl border border-border bg-background relative min-h-50">
        {isCombinedLoading && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] flex items-center justify-center z-10 transition-all">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}

        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="text-xs font-semibold text-muted-foreground">
              <TableHead
                className={`p-4 ${isArabic ? "text-right" : "text-left"}`}
              >
                {t("cashbox.table.headers.time")}
              </TableHead>
              <TableHead
                className={`p-4 ${isArabic ? "text-right" : "text-left"}`}
              >
                {t("cashbox.table.headers.type")}
              </TableHead>
              <TableHead
                className={`p-4 ${isArabic ? "text-right" : "text-left"}`}
              >
                {t("cashbox.table.headers.amount")}
              </TableHead>
              <TableHead
                className={`p-4 ${isArabic ? "text-right" : "text-left"}`}
              >
                {t("cashbox.table.headers.balanceAfter")}
              </TableHead>
              <TableHead
                className={`p-4 ${isArabic ? "text-right" : "text-left"}`}
              >
                {t("cashbox.table.headers.reference")}
              </TableHead>
              <TableHead
                className={`p-4 ${isArabic ? "text-right" : "text-left"}`}
              >
                {t("cashbox.table.headers.createdBy")}
              </TableHead>
              <TableHead
                className={`p-4 ${isArabic ? "text-right" : "text-left"}`}
              >
                {t("cashbox.table.headers.notes")}
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="text-foreground font-medium text-xs">
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center p-8 text-xs text-muted-foreground h-32"
                >
                  {t("cashbox.table.noData")}
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((tx) => {
                const isOut = tx.transaction_type.endsWith("_out");
                const translationKey =
                  TRANSACTION_TRANSLATION_KEYS[tx.transaction_type];

                return (
                  <TableRow
                    key={tx.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell
                      className={`p-4 font-mono text-muted-foreground ${isArabic ? "text-right" : "text-left"}`}
                    >
                      {new Date(tx.transaction_time).toLocaleString(
                        isArabic ? "ar-EG" : "en-US",
                      )}
                    </TableCell>
                    <TableCell
                      className={isArabic ? "text-right" : "text-left"}
                    >
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase border ${
                          TRANSACTION_BADGE_STYLES[tx.transaction_type] ||
                          (!isOut
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                            : "bg-destructive/10 text-destructive border-destructive/25")
                        }`}
                      >
                        {translationKey
                          ? t(`cashbox.filters.types.${translationKey}`)
                          : tx.transaction_type}
                      </span>
                    </TableCell>
                    <TableCell
                      className={`p-4 font-mono font-bold ${isArabic ? "text-right" : "text-left"} ${!isOut ? "text-emerald-400" : "text-destructive"}`}
                    >
                      {!isOut
                        ? `+${tx.amount.toLocaleString()}`
                        : `-${tx.amount.toLocaleString()}`}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`p-1 px-2 rounded-md font-mono text-[11px] font-semibold ${tx.balance_after !== null ? "bg-muted/20 text-muted-foreground" : "bg-destructive/10 text-destructive"}`}
                      >
                        {tx.balance_after !== null
                          ? tx.balance_after.toLocaleString()
                          : "—"}
                      </span>
                    </TableCell>
                    <TableCell
                      className={`p-4 font-mono text-muted-foreground ${isArabic ? "text-right" : "text-left"}`}
                    >
                      {tx.reference_type} (#{tx.reference_id})
                    </TableCell>
                    <TableCell
                      className={`${isArabic ? "text-right" : "text-left"}`}
                    >
                      {tx.created_by
                        ? `${tx.created_by.first_name} ${tx.created_by.last_name}`
                        : "—"}
                    </TableCell>
                    <TableCell
                      className={`p-4 text-muted-foreground max-w-xs truncate ${isArabic ? "text-right" : "text-left"}`}
                    >
                      {tx.notes || "—"}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* الـ Pagination */}
      {meta && meta.last_page > 1 && (
        <div
          className="flex items-center justify-between border-t border-border/60 pt-4"
          dir={isArabic ? "rtl" : "ltr"}
        >
          <div className="text-xs text-muted-foreground">
            {t("cashbox.table.pagination.info", {
              from:
                meta.total === 0
                  ? 0
                  : (meta.current_page - 1) * meta.per_page + 1,
              to: Math.min(meta.current_page * meta.per_page, meta.total),
              total: meta.total,
            })}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handlePageChange(meta.current_page - 1)}
              disabled={meta.current_page === 1 || isCombinedLoading}
            >
              {isArabic ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>

            <span className="text-xs font-mono font-bold px-3">
              {meta.current_page} / {meta.last_page}
            </span>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handlePageChange(meta.current_page + 1)}
              disabled={
                meta.current_page === meta.last_page || isCombinedLoading
              }
            >
              {isArabic ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
