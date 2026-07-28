import { useTranslation } from "react-i18next";
import { Layers } from "lucide-react";
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

interface StockStatusCardProps {
  items: PurchaseInvoice["items"];
  isCompleted: boolean;
}

export function StockStatusCard({ items, isCompleted }: StockStatusCardProps) {
  const { t } = useTranslation();

  return (
    <DetailCard
      title={t("purchaseInvoiceDetails.stockStatus.title")}
      icon={Layers}
      contentClassName="p-0"
    >
      <Table className="text-[11px]">
        <TableHeader className="bg-muted/40">
          <TableRow className="border-b border-border/70">
            <TableHead className="text-start">
              {t("purchaseInvoiceDetails.stockStatus.product")}
            </TableHead>
            <TableHead className="text-end">
              {t("purchaseInvoiceDetails.stockStatus.qty")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items?.map((item) => (
            <TableRow
              key={item.id}
              className="border-b border-border/30 hover:bg-muted/5"
            >
              <TableCell className="text-start py-3">
                <p className="font-semibold text-foreground">
                  {item.product?.brand_name || "—"}
                </p>
              </TableCell>
              <TableCell
                className={`font-extrabold text-end ${
                  isCompleted
                    ? "text-emerald-500"
                    : "text-destructive line-through"
                }`}
              >
                {isCompleted ? `+${item.quantity}` : `0`}{" "}
                {t("purchaseInvoiceDetails.stockStatus.units")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DetailCard>
  );
}
