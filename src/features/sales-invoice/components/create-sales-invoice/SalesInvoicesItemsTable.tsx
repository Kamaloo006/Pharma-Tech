import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import type { SalesInvoiceItem } from "../../types/salesInvoice";

interface SalesInvoiceItemsTableProps {
  isArabic: boolean;
  items: SalesInvoiceItem[];
  updateItemField: (id: string | number, field: any, value: any) => void;
  removeItem: (id: string | number) => void;
}

export function SalesInvoiceItemsTable({
  isArabic,
  items,
  updateItemField,
  removeItem,
}: SalesInvoiceItemsTableProps) {
  return (
    <div className="border border-border/60 rounded-xl overflow-hidden">
      <Table className="text-xs">
        <TableHeader className="bg-muted/40">
          <TableRow className="border-b border-border/60">
            <TableHead className="font-bold py-3">
              {isArabic ? "المنتج" : "Product"}
            </TableHead>
            <TableHead className="font-bold py-3 w-24 text-center">
              {isArabic ? "الكمية" : "Qty"}
            </TableHead>
            <TableHead className="font-bold py-3 w-28 text-right">
              {isArabic ? "السعر" : "Price"}
            </TableHead>
            <TableHead className="font-bold py-3 w-24 text-right">
              {isArabic ? "الضريبة" : "Tax"}
            </TableHead>
            <TableHead className="font-bold py-3 w-24 text-right">
              {isArabic ? "الخصم" : "Discount"}
            </TableHead>
            <TableHead className="font-bold py-3 w-28 text-right">
              {isArabic ? "المجموع" : "Total"}
            </TableHead>
            <TableHead className="w-10 py-3"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-8 text-muted-foreground font-medium"
              >
                {isArabic
                  ? "لم يتم إضافة منتجات بعد. قم بالبحث واختيار المنتجات أعلاه."
                  : "No items added yet. Search and select products above."}
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => {
              const lineSubtotal = item.quantity * item.selling_price;
              const lineTotal =
                lineSubtotal + (item.tax || 0) - (item.discount || 0);

              return (
                <TableRow
                  key={item.id}
                  className="border-b border-border/40 hover:bg-muted/10"
                >
                  <TableCell className="py-2">
                    <div className="font-bold text-foreground">
                      {item.brand_name}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-mono">
                      {item.scientific_name} {item.strength}
                    </div>
                  </TableCell>

                  <TableCell className="py-2 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <Input
                        type="number"
                        min={1}
                        max={item.stock}
                        value={item.quantity}
                        onChange={(e) =>
                          updateItemField(item.id, "quantity", e.target.value)
                        }
                        className="h-8 w-16 text-center text-xs font-mono font-bold rounded-lg p-1"
                      />
                      <span className="text-[9px] text-muted-foreground font-mono">
                        Max: {item.stock}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="py-2 text-right">
                    <Input
                      type="number"
                      min={0}
                      value={item.selling_price}
                      onChange={(e) =>
                        updateItemField(
                          item.id,
                          "selling_price",
                          e.target.value,
                        )
                      }
                      className="h-8 w-24 text-right text-xs font-mono rounded-lg p-1"
                    />
                  </TableCell>

                  <TableCell className="py-2 text-right">
                    <Input
                      type="number"
                      min={0}
                      value={item.tax}
                      onChange={(e) =>
                        updateItemField(item.id, "tax", e.target.value)
                      }
                      className="h-8 w-20 text-right text-xs font-mono rounded-lg p-1"
                    />
                  </TableCell>

                  <TableCell className="py-2 text-right">
                    <Input
                      type="number"
                      min={0}
                      value={item.discount}
                      onChange={(e) =>
                        updateItemField(item.id, "discount", e.target.value)
                      }
                      className="h-8 w-20 text-right text-xs font-mono rounded-lg p-1"
                    />
                  </TableCell>

                  <TableCell className="py-2 text-right font-mono font-bold text-foreground">
                    {lineTotal.toLocaleString()}
                  </TableCell>

                  <TableCell className="py-2 text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      className="h-7 w-7 text-destructive hover:bg-destructive/10 rounded-lg"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
