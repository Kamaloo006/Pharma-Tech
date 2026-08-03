import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText } from "lucide-react";
import type { SalesInvoiceItem } from "../../types/salesInvoice";

export function InvoiceItemsTable({ items }: { items?: SalesInvoiceItem[] }) {
  const { t } = useTranslation();

  return (
    <Card className="border-border/60 shadow-xs rounded-2xl overflow-hidden">
      <CardHeader className="bg-muted/20 border-b border-border/60 py-2.5 px-4">
        <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5 text-primary" />
          {t("salesInvoice.items.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table className="text-xs">
          <TableHeader className="bg-muted/30">
            <TableRow className="border-b border-border/60">
              <TableHead className="font-bold py-2.5">
                {t("salesInvoice.items.product")}
              </TableHead>
              <TableHead className="font-bold py-2.5 text-center">
                {t("salesInvoice.items.qty")}
              </TableHead>
              <TableHead className="font-bold py-2.5 text-right">
                {t("salesInvoice.items.price")}
              </TableHead>
              <TableHead className="font-bold py-2.5 text-right">
                {t("salesInvoice.items.tax")}
              </TableHead>
              <TableHead className="font-bold py-2.5 text-right">
                {t("salesInvoice.items.discount")}
              </TableHead>
              <TableHead className="font-bold py-2.5 text-right">
                {t("salesInvoice.items.total")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items?.map((item) => (
              <TableRow key={item.id} className="border-b border-border/40">
                <TableCell className="py-2.5 font-semibold text-foreground">
                  {item?.brand_name || "-"}
                </TableCell>
                <TableCell className="py-2.5 text-center font-mono font-medium">
                  {item.quantity}
                </TableCell>
                <TableCell className="py-2.5 text-right font-mono">
                  {item.selling_price.toLocaleString()}
                </TableCell>
                <TableCell className="py-2.5 text-right font-mono text-muted-foreground">
                  {item.tax}
                </TableCell>
                <TableCell className="py-2.5 text-right font-mono text-muted-foreground">
                  {item.discount}
                </TableCell>
                <TableCell className="py-2.5 text-right font-mono font-bold text-foreground">
                  {item.quantity.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
