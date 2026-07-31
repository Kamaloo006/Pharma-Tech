import { useTranslation } from "react-i18next";
import { Trash2, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ReturnItemUI } from "@/features/supplier-return/types/SupplierReturn";

interface Props {
  items: ReturnItemUI[];
  isArabic: boolean;
  isPending: boolean;
  onQuantityChange: (productId: number, newQty: number) => void;
  onRemoveItem: (productId: number) => void;
  formatCurrency: (amount: number) => string;
}

export function ReturnItemsTable({
  items,
  isArabic,
  isPending,
  onQuantityChange,
  onRemoveItem,
  formatCurrency,
}: Props) {
  const { t } = useTranslation();

  return (
    <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-border/60">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <PackageCheck className="w-4 h-4 text-primary" />
          {t("supplierReturn.create.returnItems")}
        </h2>
      </div>

      <div className="overflow-x-auto">
        <Table className="text-xs">
          <TableHeader className="bg-muted/30">
            <TableRow className="border-b border-border/60">
              <TableHead className={isArabic ? "text-right" : "text-left"}>
                {t("supplierReturn.create.product")}
              </TableHead>
              <TableHead className="text-center">
                {t("supplierReturn.create.purchased")}
              </TableHead>
              <TableHead className="text-center w-32">
                {t("supplierReturn.create.returnQty")}
              </TableHead>
              <TableHead className="text-center">
                {t("supplierReturn.create.unitPrice")}
              </TableHead>
              <TableHead className="text-center">
                {t("supplierReturn.create.total")}
              </TableHead>
              <TableHead className="text-center w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground font-semibold"
                >
                  {t("supplierReturn.create.noItems")}
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow
                  key={item.product_id}
                  className="border-b border-border/40 hover:bg-muted/10"
                >
                  {/* Product Name with Unit Price side-by-side */}
                  <TableCell
                    className={`py-3 ${isArabic ? "text-right" : "text-left"}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="font-semibold text-foreground">
                        {item.productName}
                      </span>
                      <span className="text-[11px] font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded-xs w-fit">
                        {formatCurrency(item.unit_price)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-mono text-muted-foreground">
                    {item.purchasedQty}
                  </TableCell>
                  <TableCell className="text-center">
                    <Input
                      type="number"
                      min={0}
                      max={item.purchasedQty}
                      value={item.quantity}
                      onChange={(e) =>
                        onQuantityChange(
                          item.product_id,
                          Number(e.target.value),
                        )
                      }
                      disabled={isPending}
                      className="h-8 text-xs text-center font-mono font-bold bg-muted/40 border-border/80 focus:bg-background"
                    />
                  </TableCell>
                  <TableCell className="text-center font-mono font-semibold">
                    {formatCurrency(item.unit_price)}
                  </TableCell>
                  <TableCell className="text-center font-mono font-bold text-foreground">
                    {formatCurrency(item.quantity * item.unit_price)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={isPending}
                      onClick={() => onRemoveItem(item.product_id)}
                      className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
