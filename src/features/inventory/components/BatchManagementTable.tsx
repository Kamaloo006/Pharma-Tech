import { MoreVertical, Plus, Trash2, Edit, Printer } from "lucide-react";
import type { Batch } from "../types/Product";
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

interface BatchManagementTableProps {
  batches: Batch[];
  baseUnitName: string;
  isArabic: boolean;
  onAddStockClick: () => void;
}

export default function BatchManagementTable({
  batches,
  baseUnitName,
  isArabic,
  onAddStockClick,
}: BatchManagementTableProps) {
  // دالة فحص حالة التشغيلة
  const getBatchStatus = (expiryDate: string | null) => {
    if (!expiryDate)
      return {
        label: isArabic ? "طبيعي" : "Healthy",
        color: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
      };

    const expiry = new Date(expiryDate);
    const today = new Date();

    if (expiry <= today) {
      return {
        label: isArabic ? "منتهي" : "Expired",
        color: "border-red-500/30 bg-red-500/10 text-red-400",
      };
    }

    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

    if (expiry <= sixMonthsFromNow) {
      return {
        label: isArabic ? "قريب انتهاء" : "Expiring Soon",
        color: "border-amber-500/30 bg-amber-500/10 text-amber-400",
      };
    }

    return {
      label: isArabic ? "طبيعي" : "Healthy",
      color: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    };
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
      <div
        className="flex items-center justify-between"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          {isArabic ? "إدارة التشغيلات المخزنية" : "BATCH MANAGEMENT"}
        </h3>
        <div className="flex items-center gap-3 text-[11px] font-medium">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {isArabic ? "سليمة" : "Healthy"}
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            {isArabic ? "قريبة الانتهاء" : "Expiring Soon"}
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            {isArabic ? "منتهية الصلاحية" : "Expired"}
          </div>
        </div>
      </div>

      <div
        className="rounded-xl border border-border/60 overflow-hidden"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="border-b border-border/60 hover:bg-transparent">
              <TableHead
                className={`text-xs font-semibold text-muted-foreground ${isArabic ? "text-right" : "text-left"}`}
              >
                {isArabic ? "رقم التشغيلة" : "Batch No"}
              </TableHead>
              <TableHead
                className={`text-xs font-semibold text-muted-foreground ${isArabic ? "text-right" : "text-left"}`}
              >
                {isArabic ? "الكمية" : "Quantity"}
              </TableHead>
              <TableHead
                className={`text-xs font-semibold text-muted-foreground ${isArabic ? "text-right" : "text-left"}`}
              >
                {isArabic ? "تاريخ الانتهاء" : "Expiry"}
              </TableHead>
              <TableHead
                className={`text-xs font-semibold text-muted-foreground ${isArabic ? "text-right" : "text-left"}`}
              >
                {isArabic ? "الحالة" : "Status"}
              </TableHead>
              <TableHead
                className={`text-xs font-semibold text-muted-foreground w-10 ${isArabic ? "text-left" : "text-right"}`}
              ></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {batches.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-xs text-muted-foreground font-medium"
                >
                  {isArabic
                    ? "لا يوجد شحنات مخزنية متاحة لهذا المنتج حالياً"
                    : "No active batches available for this product."}
                </TableCell>
              </TableRow>
            ) : (
              batches.map((batch) => {
                const status = getBatchStatus(batch.expiry_date);
                return (
                  <TableRow
                    key={batch.id}
                    className="border-b border-border/40 hover:bg-muted/20 transition-colors"
                  >
                    <td className="font-semibold text-xs text-foreground py-3.5">
                      {batch.batch_number || `Batch-${batch.id}`}
                    </td>
                    <td className="text-xs text-muted-foreground py-3.5">
                      {batch.quantity_on_hand.toLocaleString()} {baseUnitName}
                    </td>
                    <td className="text-xs font-mono font-medium text-muted-foreground py-3.5">
                      {batch.expiry_date || "—"}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${status.color}`}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="py-3.5 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors outline-none">
                            <MoreVertical className="h-3.5 w-3.5" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align={isArabic ? "start" : "end"}
                          className="text-xs"
                        >
                          <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                            <Edit className="h-3 w-3" />
                            {isArabic ? "تعديل الباتش" : "Edit Batch"}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-red-500 flex items-center gap-2 focus:text-red-500">
                            <Trash2 className="h-3 w-3" />
                            {isArabic ? "حذف الباتش" : "Delete Batch"}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-muted-foreground flex items-center gap-2">
                            <Printer className="h-3 w-3" />
                            {isArabic ? "طباعة ملصق (لاحقاً)" : "Print Label"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <button
        onClick={onAddStockClick}
        className="w-full flex items-center justify-center gap-2 border border-dashed border-border hover:border-muted-foreground/40 bg-muted/10 hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-medium py-3 rounded-xl transition-all outline-none"
      >
        <Plus className="h-3.5 w-3.5" />
        <span>{isArabic ? "+ إضافة تشغيلة جديدة" : "Add New Batch"}</span>
      </button>
    </div>
  );
}
