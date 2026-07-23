import { useTranslation } from "react-i18next";
import { Package } from "lucide-react";
import { DetailCard } from "@/components/ui/DetailCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type PurchaseInvoice } from "../../types/purchase-invoice";

interface ReceivedProductsCardProps {
  items: PurchaseInvoice["items"];
}

export function ReceivedProductsCard({ items }: ReceivedProductsCardProps) {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <DetailCard
      title={isArabic ? "الأدوية والمنتجات المستلمة" : "Received Products"}
      icon={Package}
      contentClassName="p-0"
    >
      <div className="overflow-x-auto">
        <Table className="text-xs">
          <TableHeader className="bg-muted/30">
            <TableRow className="border-b border-border/65">
              <TableHead className={isArabic ? "text-right" : "text-left"}>
                {isArabic ? "المنتج" : "Product"}
              </TableHead>
              <TableHead className="text-center">
                {isArabic ? "الكمية" : "Qty"}
              </TableHead>
              <TableHead className="text-center">
                {isArabic ? "سعر الشراء" : "Buying Price"}
              </TableHead>
              <TableHead className="text-center">
                {isArabic ? "الضريبة" : "Tax"}
              </TableHead>
              <TableHead className="text-center">
                {isArabic ? "الخصم" : "Discount"}
              </TableHead>
              <TableHead className="text-center">
                {isArabic ? "سعر البيع" : "Selling Price"}
              </TableHead>
              <TableHead className={isArabic ? "text-left" : "text-right"}>
                {isArabic ? "الإجمالي" : "Total"}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items?.map((item) => (
              <TableRow
                key={item.id}
                className="border-b border-border/40 hover:bg-muted/10"
              >
                <TableCell className="font-semibold text-foreground py-3.5 text-start">
                  <div className="space-y-0.5">
                    <div>{item.product?.brand_name || "—"}</div>
                    <span className="px-1.5 py-0.2 rounded bg-muted text-muted-foreground text-[9px] font-bold">
                      {item.product?.strength || "—"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center font-bold">
                  {item.quantity}
                </TableCell>
                <TableCell className="text-center font-mono">
                  {Number(item.wholesale_price).toFixed(2)} ل.س
                </TableCell>
                <TableCell className="text-center text-muted-foreground">
                  {item.tax}%
                </TableCell>
                <TableCell className="text-center text-destructive">
                  -{Number(item.discount).toFixed(2)} ل.س
                </TableCell>
                <TableCell className="text-center text-emerald-500 font-semibold">
                  {item.product?.selling_price
                    ? `${Number(item.product.selling_price).toFixed(2)} ل.س`
                    : "—"}
                </TableCell>
                <TableCell
                  className={`font-bold text-foreground ${
                    isArabic ? "text-left" : "text-right"
                  }`}
                >
                  {Number(item.line_total).toFixed(2)} ل.س
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DetailCard>
  );
}
