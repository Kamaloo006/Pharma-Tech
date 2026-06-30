import {
  Boxes,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { Product } from "../types/Product";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface InventoryTableProps {
  products: Product[];
  meta: any;
  totalPages: number;
  currentPage: number;
  isArabic: boolean;
  t: (key: string) => string;
  handleNextPage: () => void;
  handlePreviousPage: () => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function InventoryTable({
  products,
  meta,
  totalPages,
  currentPage,
  isArabic,
  t,
  handleNextPage,
  handlePreviousPage,
  onEdit,
  onDelete,
}: InventoryTableProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/20 overflow-hidden shadow-sm backdrop-blur-sm">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead
              className={cn(
                "p-3.5 text-xs font-semibold text-muted-foreground/90",
                isArabic && "text-right",
              )}
            >
              {t("inventory.table.medicine_name")}
            </TableHead>
            <TableHead
              className={cn(
                "p-3.5 text-xs font-semibold text-muted-foreground/90",
                isArabic && "text-right",
              )}
            >
              {t("inventory.table.category")}
            </TableHead>
            <TableHead
              className={cn(
                "p-3.5 text-xs font-semibold text-muted-foreground/90",
                isArabic && "text-right",
              )}
            >
              {t("inventory.table.stock_level")}
            </TableHead>
            <TableHead
              className={cn(
                "p-3.5 text-xs font-semibold text-muted-foreground/90",
                isArabic && "text-right",
              )}
            >
              {t("inventory.table.selling_price")}
            </TableHead>
            <TableHead
              className={cn(
                "p-3.5 text-xs font-semibold text-muted-foreground/90",
                isArabic && "text-right",
              )}
            >
              {t("inventory.table.nearest_expiry")}
            </TableHead>
            <TableHead
              className={cn(
                "p-3.5 text-xs font-semibold text-muted-foreground/90",
                isArabic && "text-right",
              )}
            >
              {t("inventory.table.status")}
            </TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length > 0 ? (
            products.map((med) => {
              const displayName =
                isArabic && med.ar_name ? med.ar_name : med.brand_name;
              let statusLabel = t("inventory.stock_status.available");
              let statusClass =
                "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";

              if (med.stock_status === "out") {
                statusLabel = t("inventory.stock_status.out");
                statusClass = "bg-rose-500/10 text-rose-500 border-rose-500/20";
              } else if (med.stock_status === "low") {
                statusLabel = `${t("inventory.stock_status.low")} (${med.stock_alert_severity?.toUpperCase()})`;
                statusClass =
                  med.stock_alert_severity === "high"
                    ? "bg-orange-500/10 text-orange-500 border-orange-500/20 font-bold"
                    : "bg-amber-500/10 text-amber-500 border-amber-500/20";
              }

              const expiryDate = med.nearest_expiry
                ? new Date(med.nearest_expiry)
                : null;
              const isNearExpiry =
                expiryDate &&
                expiryDate.getTime() - new Date().getTime() <
                  1000 * 60 * 60 * 24 * 90;

              return (
                <TableRow
                  key={med.id}
                  className="hover:bg-muted/10 transition-colors group"
                >
                  <TableCell className="p-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/80 bg-background/50 text-muted-foreground group-hover:border-primary/30 group-hover:text-primary transition-colors">
                        <Boxes className="size-3.5" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground text-xs">
                          {displayName}
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                          ID: #{med.id}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="p-3.5">
                    <span className="rounded-full border border-border/60 bg-background/30 px-2 py-0.5 text-[10px] text-muted-foreground font-medium">
                      {med.category?.name ||
                        (isArabic ? "غير مصنف" : "Uncategorized")}
                    </span>
                  </TableCell>

                  <TableCell className="p-3.5">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-foreground text-xs">
                        {med.total_quantity}{" "}
                        {typeof med.base_unit === "object"
                          ? med.base_unit?.name
                          : med.base_unit}
                      </span>
                      <span className="text-[9px] text-muted-foreground font-mono">
                        {isArabic ? "حد التنبيه:" : "Min Alert:"}{" "}
                        {med.min_stock}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="p-3.5 font-semibold text-xs text-foreground/90">
                    {med.selling_price.toLocaleString()}{" "}
                    {isArabic ? "ل.س" : "SYP"}
                  </TableCell>

                  <TableCell className="p-3.5">
                    {med.nearest_expiry ? (
                      <div
                        className={cn(
                          "flex items-center gap-1.5 text-xs font-mono",
                          isNearExpiry
                            ? "text-rose-500 font-bold animate-pulse"
                            : "text-muted-foreground",
                        )}
                      >
                        <span className="text-[11px]">
                          {med.nearest_expiry}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-muted-foreground/60 italic">
                        {t("inventory.expiry.no_data")}
                      </span>
                    )}
                  </TableCell>

                  <TableCell className="p-3.5">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-bold text-[9px] tracking-wide",
                        statusClass,
                      )}
                    >
                      <span className="size-1 rounded-full bg-current" />
                      {statusLabel}
                    </span>
                  </TableCell>

                  <TableCell className="p-3.5 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 text-muted-foreground opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity rounded-md hover:bg-muted outline-none">
                          <MoreVertical className="size-3.5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem className="cursor-pointer gap-2">
                          <Eye className="size-3.5 text-muted-foreground" />
                          <span>عرض التفاصيل</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="cursor-pointer gap-2"
                          onClick={() => onEdit(med)}
                        >
                          <Pencil className="size-3.5 text-muted-foreground" />
                          <span>تعديل</span>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              className="cursor-pointer gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
                              onSelect={(e) => e.preventDefault()}
                            >
                              <Trash2 className="size-3.5" />
                              <span>{t("inventory.delete_modal.delete")}</span>
                            </DropdownMenuItem>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                {t("inventory.delete_modal.title")}
                              </AlertDialogTitle>

                              <AlertDialogDescription>
                                {t("inventory.delete_modal.description")}
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                              <AlertDialogCancel>
                                {t("inventory.delete_modal.cancel_btn")}
                              </AlertDialogCancel>

                              <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={() => onDelete(med)}
                              >
                                {t("inventory.delete_modal.confirm_btn")}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={7}
                className="p-10 text-center text-xs text-muted-foreground font-medium"
              >
                {t("inventory.no_products")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* أزرار التنقل والصفحات */}
      {totalPages > 1 && (
        <div
          className="flex items-center justify-between border-t border-border/60 bg-muted/5 p-3 text-xs"
          dir={isArabic ? "rtl" : "ltr"}
        >
          <span className="text-muted-foreground text-[11px]">
            {isArabic ? (
              <>
                عرض الصفحة{" "}
                <span className="font-semibold text-foreground">
                  {meta?.current_page}
                </span>{" "}
                من{" "}
                <span className="font-semibold text-foreground">
                  {totalPages}
                </span>
              </>
            ) : (
              <>
                Showing page{" "}
                <span className="font-semibold text-foreground">
                  {meta?.current_page}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-foreground">
                  {totalPages}
                </span>
              </>
            )}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-border bg-background hover:bg-muted disabled:opacity-40 shadow-sm cursor-pointer"
            >
              {isArabic ? (
                <ChevronRight className="size-3.5" />
              ) : (
                <ChevronLeft className="size-3.5" />
              )}
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-border bg-background hover:bg-muted disabled:opacity-40 shadow-sm cursor-pointer"
            >
              {isArabic ? (
                <ChevronLeft className="size-3.5" />
              ) : (
                <ChevronRight className="size-3.5" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
