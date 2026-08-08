import { useTranslation } from "react-i18next";
import { PackageCheck } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type CustomerReturnItem } from "../../types/CustomerReturn";

interface Props {
  items: CustomerReturnItem[];
  isArabic: boolean;
}

export function CustomerReturnItemsTable({ items, isArabic }: Props) {
  const { t } = useTranslation();
  const formatCurrency = (amount: number) =>
    `${amount.toLocaleString()} ${isArabic ? "ل.س" : "SYP"}`;

  return (
    <div className="lg:col-span-2 bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-4">
      <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 pb-2 border-b border-border/60">
        <PackageCheck className="w-4 h-4 text-primary" />
        {t("customerReturn.details.returnedProducts", "Returned Products")}
      </h2>

      <div className="overflow-x-auto">
        <Table className="text-xs">
          <TableHeader className="bg-muted/30">
            <TableRow className="border-b border-border/60">
              <TableHead className={isArabic ? "text-right" : "text-left"}>
                {t("customerReturn.details.product", "Product")}
              </TableHead>
              <TableHead className="text-center">
                {t("customerReturn.details.qty", "Qty")}
              </TableHead>
              <TableHead className="text-center">
                {t("customerReturn.details.unitPrice", "Unit Price")}
              </TableHead>
              <TableHead className="text-center">
                {t("customerReturn.details.tax", "Tax")}
              </TableHead>
              <TableHead className="text-center">
                {t("customerReturn.details.discount", "Discount")}
              </TableHead>
              <TableHead className="text-center">
                {t("customerReturn.details.total", "Line Total")}
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items?.map((item) => (
              <TableRow
                key={item.id}
                className="border-b border-border/40 hover:bg-muted/10"
              >
                <TableCell
                  className={`font-semibold text-foreground py-3 ${
                    isArabic ? "text-right" : "text-left"
                  }`}
                >
                  {isArabic
                    ? item.product?.ar_name || item.product?.brand_name
                    : item.product?.brand_name || item.product?.ar_name}
                </TableCell>

                <TableCell className="text-center font-mono font-bold">
                  {item.quantity}
                </TableCell>

                <TableCell className="text-center font-mono">
                  {formatCurrency(item.unit_price)}
                </TableCell>

                <TableCell className="text-center font-mono text-muted-foreground">
                  {formatCurrency(item.tax || 0)}
                </TableCell>

                <TableCell className="text-center font-mono text-muted-foreground">
                  {formatCurrency(item.discount || 0)}
                </TableCell>

                <TableCell className="text-center font-mono font-bold text-foreground">
                  {formatCurrency(item.line_total)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
