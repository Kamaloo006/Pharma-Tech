import {
  Boxes,
  Search,
  ChevronDown,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Plus,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useInventoryController } from "@/features/inventory/hooks/useInventoryContoller";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Inventory() {
  const {
    t,
    isArabic,
    register,
    categories,
    products,
    meta,
    currentPage,
    totalPages,
    isLoading,
    isFetching,
    isError,
    errorMessage,
    handleFilterFocus,
    handleNextPage,
    handlePreviousPage,
  } = useInventoryController();

  if (isLoading) {
    return (
      <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-3 text-muted-foreground animate-pulse">
        <Loader2 className="size-7 animate-spin text-primary" />
        <span className="text-xs font-medium">
          Fetching live inventory from server...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-8 text-center text-rose-500 max-w-xl mx-auto mt-12">
        <AlertTriangle className="size-8 mx-auto mb-3 opacity-90" />
        <p className="font-semibold text-sm">Server Connection Error</p>
        <p className="text-xs opacity-80 mt-1.5 font-mono">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={isArabic ? "rtl" : "ltr"}>
      {/* الهيدر */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            {t("sidebar.inventory")}
          </h2>
          <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
            <span className="inline-flex size-2 rounded-full bg-emerald-500" />
            <span>{meta?.total || 0} Products Registered</span>
            {isFetching && (
              <Loader2 className="size-3 animate-spin text-primary ml-1" />
            )}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button className="flex h-9 items-center justify-center gap-2 rounded-xl border border-border/80 bg-card px-4 text-xs font-medium hover:bg-muted shadow-sm">
            Export Report
          </button>
          <button className="flex h-9 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 text-xs font-medium text-primary-foreground shadow-md hover:opacity-90">
            <Plus className="size-3.5" /> Add Product
          </button>
        </div>
      </div>

      {/* لوحة الفلاتر */}
      <div className="rounded-2xl border border-border/60 bg-card/30 p-3.5 space-y-3 shadow-inner">
        <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search
              className={cn(
                "absolute top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground",
                isArabic ? "right-3.5" : "left-3.5",
              )}
            />
            <input
              type="text"
              placeholder="Search by brand name..."
              {...register("search")}
              onFocus={handleFilterFocus}
              className={cn(
                "h-9 w-full rounded-xl border border-border/80 bg-background/50 text-xs shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all",
                isArabic ? "pr-9 pl-3.5" : "pl-9 pr-3.5",
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
            <div className="relative">
              <select
                {...register("category_id")}
                onFocus={handleFilterFocus}
                className={cn(
                  "h-9 w-full appearance-none rounded-xl border border-border/80 bg-background/50 text-xs focus:outline-none min-w-40 capitalize cursor-pointer",
                  isArabic ? "pl-8 pr-3" : "pr-8 pl-3",
                )}
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id.toString()}>
                    {category.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                className={cn(
                  "absolute top-1/2 size-3 -translate-y-1/2 pointer-events-none text-muted-foreground/80",
                  isArabic ? "left-2.5" : "right-2.5",
                )}
              />
            </div>

            <div className="relative col-span-2 sm:col-span-1">
              <select
                {...register("stock_status")}
                onFocus={handleFilterFocus}
                className={cn(
                  "h-9 w-full appearance-none rounded-xl border border-border/80 bg-background/50 text-xs focus:outline-none min-w-35 cursor-pointer",
                  isArabic ? "pl-8 pr-3" : "pr-8 pl-3",
                )}
              >
                <option value="all">Stock: All</option>
                <option value="available">Available</option>
                <option value="low">Low Stock</option>
                <option value="out">Out of Stock</option>
              </select>
              <ChevronDown
                className={cn(
                  "absolute top-1/2 size-3 -translate-y-1/2 pointer-events-none text-muted-foreground/80",
                  isArabic ? "left-2.5" : "right-2.5",
                )}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-border/40">
          <label className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground">
            <input
              type="checkbox"
              {...register("with_trashed")}
              className="size-3.5 rounded border-border/80 accent-primary text-primary-foreground focus:ring-primary cursor-pointer"
            />
            <span>Include Deleted / Archived Products</span>
          </label>
        </div>
      </div>

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
                MEDICINE NAME
              </TableHead>
              <TableHead
                className={cn(
                  "p-3.5 text-xs font-semibold text-muted-foreground/90",
                  isArabic && "text-right",
                )}
              >
                CATEGORY
              </TableHead>
              <TableHead
                className={cn(
                  "p-3.5 text-xs font-semibold text-muted-foreground/90",
                  isArabic && "text-right",
                )}
              >
                STOCK LEVEL
              </TableHead>
              <TableHead
                className={cn(
                  "p-3.5 text-xs font-semibold text-muted-foreground/90",
                  isArabic && "text-right",
                )}
              >
                SELLING PRICE
              </TableHead>
              <TableHead
                className={cn(
                  "p-3.5 text-xs font-semibold text-muted-foreground/90",
                  isArabic && "text-right",
                )}
              >
                NEAREST EXPIRY
              </TableHead>
              <TableHead
                className={cn(
                  "p-3.5 text-xs font-semibold text-muted-foreground/90",
                  isArabic && "text-right",
                )}
              >
                STATUS
              </TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length > 0 ? (
              products.map((med) => {
                let statusLabel = "AVAILABLE";
                let statusClass =
                  "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";

                if (med.stock_status === "out") {
                  statusLabel = "OUT OF STOCK";
                  statusClass =
                    "bg-rose-500/10 text-rose-500 border-rose-500/20";
                } else if (med.stock_status === "low") {
                  statusLabel = `LOW STOCK (${med.stock_alert_severity.toUpperCase()})`;
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
                    1000 * 60 * 60 * 24 * 90; // أقل من 90 يوم

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
                            {med.brand_name}
                          </div>
                          <div className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                            ID: #{med.id}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="p-3.5">
                      <span
                        className="rounded-full border border-border/60 bg-background/30 px-2 py-0.5 text-[10px] text-muted-foreground font-medium"
                        title={med.category?.description}
                      >
                        {med.category?.name || "Uncategorized"}
                      </span>
                    </TableCell>

                    <TableCell className="p-3.5">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-foreground text-xs">
                          {med.total_quantity} {med.base_unit}(s)
                        </span>
                        <span className="text-[9px] text-muted-foreground font-mono">
                          Min Alert: {med.min_stock}
                        </span>
                      </div>
                    </TableCell>

                    {/* السعر المالي لبلد الصيدلية */}
                    <TableCell className="p-3.5 font-semibold text-xs text-foreground/90">
                      {med.selling_price.toLocaleString()} SYP
                    </TableCell>

                    {/* 🟢 الحقل الجديد الحرج: أقرب تاريخ صلاحية */}
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
                          No Expiry Data
                        </span>
                      )}
                    </TableCell>

                    {/* حالة المنتج المعتمدة تماماً على السيرفر */}
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

                    {/* الأزرار الجانبية */}
                    <TableCell className="p-3.5 text-right">
                      <button className="p-1 text-muted-foreground opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity rounded-md hover:bg-muted">
                        <MoreVertical className="size-3.5" />
                      </button>
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
                  No products matched your server filter criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* الصفحات */}
        {totalPages > 1 && (
          <div
            className="flex items-center justify-between border-t border-border/60 bg-muted/5 p-3 text-xs"
            dir="ltr"
          >
            <span className="text-muted-foreground text-[11px]">
              Showing page{" "}
              <span className="font-semibold text-foreground">
                {meta?.current_page}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-foreground">
                {totalPages}
              </span>
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
    </div>
  );
}
