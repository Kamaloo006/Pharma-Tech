import { Layers, MoreHorizontal, ShieldAlert } from "lucide-react";
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
import { Button } from "@/components/ui/button";

interface StockBatchesCardProps {
  batches: Batch[];
  baseUnitName: string;
  isArabic: boolean;
}

export default function StockBatchesCard({
  batches,
  baseUnitName,
  isArabic,
}: StockBatchesCardProps) {
  const handleMarkExpired = (batchId: number) => {
    const message = isArabic
      ? "هل أنت متأكد من تعيين هذه التشغيلة كمنتهية الصلاحية؟"
      : "Are you sure you want to mark this batch as expired?";

    if (confirm(message)) {
      console.log(`API Call: PATCH /batches/${batchId}/mark-expired`);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-emerald-500" />
          <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            {isArabic
              ? "التشغيلات المخزنية المتاحة (Batches)"
              : "AVAILABLE STOCK BATCHES"}
          </h3>
        </div>
      </div>

      <div
        className="rounded-xl border border-border/50 overflow-hidden"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="text-[10px] uppercase font-bold text-muted-foreground hover:bg-transparent">
              <TableHead className={isArabic ? "text-right" : "text-left"}>
                {isArabic ? "رقم التشغيلة" : "Batch No."}
              </TableHead>
              <TableHead className="text-center">
                {isArabic ? "الكمية المتاحة" : "Qty Hand"}
              </TableHead>
              <TableHead className="text-center">
                {isArabic ? "سعر الشراء" : "Purchase"}
              </TableHead>
              <TableHead className="text-center">
                {isArabic ? "سعر البيع" : "Selling"}
              </TableHead>
              <TableHead className="text-center">
                {isArabic ? "تاريخ الصلاحية" : "Expiry Date"}
              </TableHead>
              <TableHead className="text-center">
                {isArabic ? "الحالة" : "Status"}
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
                  {isArabic
                    ? "لا توجد تشغيلات متاحة حالياً"
                    : "No available batches found."}
                </TableCell>
              </TableRow>
            ) : (
              batches.map((batch) => {
                const expiryDate = new Date(
                  batch.expiry_date,
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
                      {batch.purchase_price.toLocaleString()} SYP
                    </TableCell>

                    <TableCell className="text-center font-mono text-emerald-400 font-semibold">
                      {batch.selling_price.toLocaleString()} SYP
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
                          ? isArabic
                            ? "نشط"
                            : "Active"
                          : isArabic
                            ? "منتهي"
                            : "Expired"}
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
                            onClick={() => handleMarkExpired(batch.id)}
                            className="flex items-center gap-2 text-[11px] text-red-400 focus:text-red-400 focus:bg-red-500/10 cursor-pointer"
                            dir={isArabic ? "rtl" : "ltr"}
                          >
                            <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
                            <span>
                              {isArabic ? "إدراج كمنتهي" : "Mark Expired"}
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
    </div>
  );
}
