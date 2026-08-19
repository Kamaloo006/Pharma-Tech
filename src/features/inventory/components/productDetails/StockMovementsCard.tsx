import {
  History,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { type StockMovement } from "../../types/StockMovement";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface StockMovementsCardProps {
  movements: StockMovement[];
  isArabic: boolean;
  currentPage?: number;
  lastPage?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
}

export default function StockMovementsCard({
  movements,
  isArabic,
  currentPage = 1,
  lastPage = 1,
  totalItems = 0,
  onPageChange,
}: StockMovementsCardProps) {
  const { t } = useTranslation();

  const getMovementBadge = (type: StockMovement["movement_type"]) => {
    const config: Record<string, { label: string; styles: string }> = {
      purchase_in: {
        label: t("inventory.movementsLog.types.purchase_in"),
        styles: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      },
      sale_out: {
        label: t("inventory.movementsLog.types.sale_out"),
        styles: "bg-red-500/10 text-red-400 border-red-500/20",
      },
      adjustment_in: {
        label: t("inventory.movementsLog.types.adjustment_in"),
        styles: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      },
      adjustment_out: {
        label: t("inventory.movementsLog.types.adjustment_out"),
        styles: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      },
      expiry_out: {
        label: t("inventory.movementsLog.types.expiry_out"),
        styles: "bg-rose-950/40 text-rose-300 border-rose-900/30",
      },
    };

    return (
      config[type] || { label: type, styles: "bg-muted text-muted-foreground" }
    );
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= lastPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange?.(i)}
          className={`h-7 w-7 p-0 text-xs font-mono ${
            currentPage === i
              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
              : ""
          }`}
        >
          {i}
        </Button>,
      );
    }
    return pages;
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-emerald-500" />
          <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            {t("inventory.movementsLog.title")}
          </h3>
        </div>
        {totalItems > 0 && (
          <span className="text-[11px] font-medium text-muted-foreground">
            {totalItems} {t("common.items", "عنصر")}
          </span>
        )}
      </div>

      <div
        className="rounded-xl border border-border/50 overflow-hidden"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="text-[10px] uppercase font-bold text-muted-foreground hover:bg-transparent">
              <TableHead className="text-center">
                {t("inventory.movementsLog.tableHeaders.date")}
              </TableHead>
              <TableHead className={isArabic ? "text-right" : "text-left"}>
                {t("inventory.movementsLog.tableHeaders.type")}
              </TableHead>
              <TableHead className="text-center">
                {t("inventory.movementsLog.tableHeaders.quantity")}
              </TableHead>
              <TableHead className={isArabic ? "text-right" : "text-left"}>
                {t("inventory.movementsLog.tableHeaders.batch")}
              </TableHead>
              <TableHead className={isArabic ? "text-right" : "text-left"}>
                {t("inventory.movementsLog.tableHeaders.reference")}
              </TableHead>
              <TableHead className={isArabic ? "text-right" : "text-left"}>
                {t("inventory.movementsLog.tableHeaders.user")}
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="text-xs">
            {movements.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center h-24 text-muted-foreground italic"
                >
                  {t("inventory.movementsLog.noMovements")}
                </TableCell>
              </TableRow>
            ) : (
              movements.map((move) => {
                const badge = getMovementBadge(move.movement_type);
                const isPositive = move.quantity_change > 0;
                const formattedDate = new Date(
                  move.created_at,
                ).toLocaleDateString(isArabic ? "ar-EG" : "en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                });

                const refTypeLabel = move.reference_type
                  ? t(
                      `inventory.movementsLog.references.${move.reference_type}`,
                      {
                        defaultValue: move.reference_type.replace("_", " "),
                      },
                    )
                  : "—";

                return (
                  <TableRow
                    key={move.id}
                    className="hover:bg-muted/40 transition-colors"
                  >
                    <TableCell className="text-center font-mono text-muted-foreground whitespace-nowrap">
                      {formattedDate}
                    </TableCell>

                    <TableCell>
                      <span
                        className={`px-2 py-0.5 rounded-md border text-[10px] font-medium ${badge.styles}`}
                      >
                        {badge.label}
                      </span>
                    </TableCell>

                    <TableCell className="text-center font-bold font-mono whitespace-nowrap">
                      <span className="flex items-center justify-center gap-0.5">
                        {isPositive ? (
                          <ArrowUpRight className="h-3 w-3 text-emerald-400 inline" />
                        ) : (
                          <ArrowDownLeft className="h-3 w-3 text-red-400 inline" />
                        )}
                        <span
                          className={
                            isPositive ? "text-emerald-400" : "text-red-400"
                          }
                        >
                          {isPositive
                            ? `+${move.quantity_change}`
                            : move.quantity_change}
                        </span>
                      </span>
                    </TableCell>

                    <TableCell className="font-mono text-foreground font-semibold">
                      {move.batch?.batch_number || "—"}
                    </TableCell>

                    <TableCell className="text-muted-foreground font-medium">
                      <span className="capitalize">{refTypeLabel}</span> #
                      {move.reference_id}
                    </TableCell>

                    <TableCell className="text-foreground font-medium">
                      {move.created_by
                        ? `${move.created_by.first_name} ${move.created_by.last_name}`
                        : "—"}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {lastPage > 1 && (
        <div
          className="flex items-center justify-between border-t border-border/50 pt-3 text-xs"
          dir={isArabic ? "rtl" : "ltr"}
        >
          <div className="text-muted-foreground">
            {t("common.page", "صفحة")}{" "}
            <span className="font-semibold text-foreground font-mono">
              {currentPage}
            </span>{" "}
            {t("common.of", "من")}{" "}
            <span className="font-semibold text-foreground font-mono">
              {lastPage}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => onPageChange?.(currentPage - 1)}
              className="h-7 px-2 text-xs"
            >
              {isArabic ? (
                <ChevronRight className="h-3.5 w-3.5" />
              ) : (
                <ChevronLeft className="h-3.5 w-3.5" />
              )}
            </Button>

            <div className="flex items-center gap-1">{renderPageNumbers()}</div>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= lastPage}
              onClick={() => onPageChange?.(currentPage + 1)}
              className="h-7 px-2 text-xs"
            >
              {isArabic ? (
                <ChevronLeft className="h-3.5 w-3.5" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
