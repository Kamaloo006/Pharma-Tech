import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { type InvoiceItem } from "../types/purchase-invoice";

interface InvoiceItemsTableProps {
  isArabic: boolean;
  items: InvoiceItem[];
  updateItemField: (
    rowId: string,
    field: keyof InvoiceItem,
    value: any,
  ) => void;
  removeItem: (rowId: string) => void;
}

export function InvoiceItemsTable({
  isArabic,
  items,
  updateItemField,
  removeItem,
}: InvoiceItemsTableProps) {
  return (
    <div className="rounded-xl border border-border/80 overflow-x-auto bg-background/50">
      <Table className="text-xs min-w-237.5">
        <TableHeader className="bg-muted/40">
          <TableRow className="border-b border-border/70">
            <TableHead
              className={`w-40 ${isArabic ? "text-right" : "text-left"}`}
            >
              {isArabic ? "المنتج الطبي" : "Medical Product"}
            </TableHead>
            <TableHead className="w-16 text-center">
              {isArabic ? "الكمية" : "Qty"}
            </TableHead>
            <TableHead className="w-20 text-center">
              {isArabic ? "سعر الشراء" : "Buying Price"}
            </TableHead>
            <TableHead className="w-16 text-center">
              {isArabic ? "الضريبة %" : "Tax %"}
            </TableHead>
            <TableHead className="w-20 text-center">
              {isArabic ? "خصم/ق" : "Discount"}
            </TableHead>
            <TableHead className="w-24 text-center">
              {isArabic ? "رقم التشغيلة" : "Batch No."}
            </TableHead>
            <TableHead className="w-32 text-center">
              {isArabic ? "تاريخ الصلاحية" : "Expiry"}
            </TableHead>
            <TableHead className="w-20 text-center">
              {isArabic ? "سعر البيع المقترح" : "Selling Price"}
            </TableHead>
            <TableHead className="w-24 text-center">
              {isArabic ? "الإجمالي" : "Total"}
            </TableHead>
            <TableHead className="w-10 text-center"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length > 0 ? (
            items.map((item) => {
              const lineTotalRaw = item.quantity * item.wholesale_price;
              const lineDiscount = item.quantity * item.discount;
              const lineTax = ((lineTotalRaw - lineDiscount) * item.tax) / 100;
              const lineGrandTotal = lineTotalRaw - lineDiscount + lineTax;

              const isThisBatchDuplicate =
                items.filter(
                  (i) =>
                    i.batch_number.trim() &&
                    i.batch_number.trim().toUpperCase() ===
                      item.batch_number.trim().toUpperCase(),
                ).length > 1;

              return (
                <TableRow
                  key={item.id}
                  className="hover:bg-muted/20 border-b border-border/40"
                >
                  <TableCell className="font-semibold text-foreground py-3 text-start">
                    <div className="space-y-0.5">
                      <div className="font-bold text-foreground flex items-center gap-1.5">
                        {item.brand_name}
                        <span className="text-[10px] text-muted-foreground font-mono font-normal">
                          ({item.strength})
                        </span>
                      </div>
                      <div className="text-[10px] text-muted-foreground italic font-normal line-clamp-1">
                        {item.scientific_name}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="p-1">
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItemField(item.id, "quantity", e.target.value)
                      }
                      className="h-8 text-center text-xs p-1 font-semibold border-border bg-background"
                    />
                  </TableCell>

                  <TableCell className="p-1">
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.wholesale_price}
                      onChange={(e) =>
                        updateItemField(
                          item.id,
                          "wholesale_price",
                          e.target.value,
                        )
                      }
                      className="h-8 text-center text-xs p-1 font-semibold border-border bg-background"
                    />
                  </TableCell>

                  <TableCell className="p-1">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={item.tax}
                      onChange={(e) =>
                        updateItemField(item.id, "tax", e.target.value)
                      }
                      className="h-8 text-center text-xs p-1 border-border bg-background"
                    />
                  </TableCell>

                  <TableCell className="p-1">
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.discount}
                      onChange={(e) =>
                        updateItemField(item.id, "discount", e.target.value)
                      }
                      className="h-8 text-center text-xs p-1 border-border bg-background"
                    />
                  </TableCell>

                  <TableCell className="p-1">
                    <Input
                      type="text"
                      value={item.batch_number}
                      onChange={(e) =>
                        updateItemField(item.id, "batch_number", e.target.value)
                      }
                      className={`h-8 text-center text-xs p-1 font-mono uppercase border-border bg-background transition-colors ${
                        isThisBatchDuplicate
                          ? "border-amber-500 bg-amber-500/5 text-amber-500"
                          : ""
                      }`}
                    />
                  </TableCell>

                  <TableCell className="p-1">
                    <Input
                      type="date"
                      value={item.expiry_date}
                      onChange={(e) =>
                        updateItemField(item.id, "expiry_date", e.target.value)
                      }
                      className="h-8 text-center text-xs p-1 border-border bg-background"
                    />
                  </TableCell>

                  <TableCell className="p-1">
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.selling_price}
                      onChange={(e) =>
                        updateItemField(
                          item.id,
                          "selling_price",
                          e.target.value,
                        )
                      }
                      className="h-8 text-center text-xs p-1 border-border bg-background"
                    />
                  </TableCell>

                  <TableCell className="text-center font-bold text-foreground">
                    {lineGrandTotal.toFixed(2)} ل.س
                  </TableCell>

                  <TableCell className="p-1 text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={10}
                className="py-8 text-center text-muted-foreground"
              >
                {isArabic
                  ? "لم تقم بإضافة أي منتج للفاتورة بعد."
                  : "No products added to the invoice yet."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
