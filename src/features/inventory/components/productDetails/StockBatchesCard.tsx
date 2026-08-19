import { useState } from "react";
import {
  Layers,
  MoreHorizontal,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { type Batch } from "../../types/Batch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface StockBatchesCardProps {
  batches: Batch[];
  baseUnitName: string;
  isArabic: boolean;
  currentPage?: number;
  lastPage?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  onMarkExpired: (batchId: number) => Promise<unknown>;
  isMarkingExpired?: boolean;
}

export default function StockBatchesCard({
  batches,
  baseUnitName,
  isArabic,
  currentPage = 1,
  lastPage = 1,
  totalItems = 0,
  onPageChange,
  onMarkExpired,
  isMarkingExpired = false,
}: StockBatchesCardProps) {
  const { t } = useTranslation();

  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleOpenConfirm = (batch: Batch) => {
    setSelectedBatch(batch);
    setIsConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedBatch) return;
    try {
      await onMarkExpired(selectedBatch.id);
      setIsConfirmOpen(false);
      setSelectedBatch(null);
    } catch (err) {
      console.error(err);
    }
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
    <>
      <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-emerald-500" />
            <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              {t("inventory.batchesCard.title")}
            </h3>
          </div>
          {totalItems > 0 && (
            <span className="text-[11px] font-medium text-muted-foreground">
              {t("inventory.batchesCard.totalBatches", "إجمالي الشحنات")}:{" "}
              {totalItems}
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
                <TableHead className={isArabic ? "text-right" : "text-left"}>
                  {t("inventory.batchesCard.tableHeaders.batchNo")}
                </TableHead>
                <TableHead className="text-center">
                  {t("inventory.batchesCard.tableHeaders.qtyHand")}
                </TableHead>
                <TableHead className="text-center">
                  {t("inventory.batchesCard.tableHeaders.purchase")}
                </TableHead>
                <TableHead className="text-center">
                  {t("inventory.batchesCard.tableHeaders.selling")}
                </TableHead>
                <TableHead className="text-center">
                  {t("inventory.batchesCard.tableHeaders.expiryDate")}
                </TableHead>
                <TableHead className="text-center">
                  {t("inventory.batchesCard.tableHeaders.status")}
                </TableHead>
                <TableHead className="w-12.5"></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="text-xs">
              {batches.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center h-24 text-muted-foreground italic"
                  >
                    {t("inventory.batchesCard.noBatches")}
                  </TableCell>
                </TableRow>
              ) : (
                batches.map((batch) => {
                  const expiryDate = new Date(
                    batch.expiry_date || "",
                  ).toLocaleDateString(isArabic ? "ar-EG" : "en-US");

                  return (
                    <TableRow
                      key={batch.id}
                      className="hover:bg-muted/40 transition-colors"
                    >
                      <TableCell className="font-mono font-bold text-foreground">
                        {batch.batch_number}
                      </TableCell>

                      <TableCell className="text-center font-semibold text-foreground">
                        {batch.quantity_on_hand}{" "}
                        <span className="text-[10px] text-muted-foreground font-normal">
                          {baseUnitName}
                        </span>
                      </TableCell>

                      <TableCell className="text-center font-mono text-muted-foreground">
                        {batch.purchase_price.toLocaleString()}{" "}
                        {t("inventory.batchesCard.currency")}
                      </TableCell>

                      <TableCell className="text-center font-mono text-emerald-400 font-semibold">
                        {batch.selling_price.toLocaleString()}{" "}
                        {t("inventory.batchesCard.currency")}
                      </TableCell>

                      <TableCell className="text-center font-mono text-muted-foreground">
                        {expiryDate}
                      </TableCell>

                      <TableCell className="text-center">
                        <span
                          className={`px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wide ${
                            batch.status === "active"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-red-500/10 text-red-400 border-red-500/20"
                          }`}
                        >
                          {batch.status === "active"
                            ? t("inventory.batchesCard.statusValues.active")
                            : t("inventory.batchesCard.statusValues.expired")}
                        </span>
                      </TableCell>

                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 hover:bg-muted text-muted-foreground hover:text-foreground"
                            >
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent
                            align={isArabic ? "start" : "end"}
                            className="w-36 border border-border bg-card"
                          >
                            <DropdownMenuItem
                              disabled={batch.status === "expired"}
                              onClick={() => handleOpenConfirm(batch)}
                              className="flex items-center gap-2 text-[11px] text-red-400 focus:text-red-400 focus:bg-red-500/10 cursor-pointer disabled:opacity-50"
                              dir={isArabic ? "rtl" : "ltr"}
                            >
                              <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
                              <span>
                                {t(
                                  "inventory.batchesCard.actions.markExpired",
                                  "Mark expired",
                                )}
                              </span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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

              <div className="flex items-center gap-1">
                {renderPageNumbers()}
              </div>

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

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent dir={isArabic ? "rtl" : "ltr"}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isArabic
                ? "تحديد هذه الشحنة كمنتهية الصلاحية؟"
                : t(
                    "inventory.batchesCard.dialog.title",
                    "Mark this batch as expired?",
                  )}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isArabic
                ? "سيؤدي هذا إلى إزالة الكمية المتبقية من المخزون المتاح."
                : t(
                    "inventory.batchesCard.dialog.description",
                    "This will remove the remaining quantity from available stock.",
                  )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel disabled={isMarkingExpired}>
              {isArabic ? "إلغاء" : t("common.cancel", "Cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleConfirm();
              }}
              disabled={isMarkingExpired}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isMarkingExpired ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isArabic ? (
                "تحديد كمنتهي الصلاحية"
              ) : (
                t("inventory.batchesCard.actions.markExpired", "Mark expired")
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
