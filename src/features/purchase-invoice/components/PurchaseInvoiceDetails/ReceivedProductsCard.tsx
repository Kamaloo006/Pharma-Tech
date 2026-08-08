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
import { useEffect } from "react";

interface ReceivedProductsCardProps {
  items: PurchaseInvoice["items"];
}

export function ReceivedProductsCard({ items }: ReceivedProductsCardProps) {
  const { t } = useTranslation();
  useEffect(() => {
    console.log(items);
  }, []);

  return (
    <DetailCard
      title={t("purchaseInvoiceDetails.receivedProducts.title")}
      icon={Package}
      contentClassName="p-0"
    >
      <div className="overflow-x-auto">
        <Table className="text-xs">
          <TableHeader className="bg-muted/30">
            <TableRow className="border-b border-border/65">
              <TableHead className="text-start">
                {t("purchaseInvoiceDetails.receivedProducts.product")}
              </TableHead>
              <TableHead className="text-center">
                {t("purchaseInvoiceDetails.receivedProducts.qty")}
              </TableHead>
              <TableHead className="text-center">
                {t("purchaseInvoiceDetails.receivedProducts.buyingPrice")}
              </TableHead>
              <TableHead className="text-center">
                {t("purchaseInvoiceDetails.receivedProducts.tax")}
              </TableHead>
              <TableHead className="text-center">
                {t("purchaseInvoiceDetails.receivedProducts.discount")}
              </TableHead>
              <TableHead className="text-center">
                {t("purchaseInvoiceDetails.receivedProducts.sellingPrice")}
              </TableHead>
              <TableHead className="text-end">
                {t("purchaseInvoiceDetails.receivedProducts.total")}
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
                  {Number(item.wholesale_price).toFixed(2)}{" "}
                  {t("common.currency")}
                </TableCell>
                <TableCell className="text-center text-muted-foreground">
                  {item.tax}%
                </TableCell>
                <TableCell className="text-center text-destructive">
                  -{Number(item.discount).toFixed(2)} {t("common.currency")}
                </TableCell>
                <TableCell className="text-center text-emerald-500 font-semibold">
                  {item.product?.selling_price
                    ? `${Number(item.product.selling_price).toFixed(2)} ${t("common.currency")}`
                    : "—"}
                </TableCell>
                <TableCell className="font-bold text-foreground text-end">
                  {Number(item.line_total).toFixed(2)} {t("common.currency")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DetailCard>
  );
}
