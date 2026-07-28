import { useTranslation } from "react-i18next";
import { Loader2, AlertCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";

interface InvoicesTableProps {
  isLoading: boolean;
  isError: boolean;
  invoices: any[];
  showFilterLoading: boolean;
  refetch: () => void;
  formatDate: (date: string) => string;
  formatCurrency: (amount: number) => string;
}

export function InvoicesTable({
  isLoading,
  isError,
  invoices,
  showFilterLoading,
  refetch,
  formatDate,
  formatCurrency,
}: InvoicesTableProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-75 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground">
          {t("purchaseInvoice.table.loading")}
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-75 text-center p-6">
        <AlertCircle className="h-10 w-10 text-destructive mb-2" />
        <p className="text-xs font-bold text-foreground">
          {t("purchaseInvoice.table.error")}
        </p>
        <Button
          onClick={() => refetch()}
          variant="outline"
          className="h-8 text-[11px] font-bold mt-3"
        >
          {t("common.retry")}
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`transition-all duration-200 ${
        showFilterLoading
          ? "opacity-60 pointer-events-none filter blur-[0.5px]"
          : "opacity-100"
      }`}
    >
      <div className="overflow-x-auto">
        <Table className="text-xs">
          <TableHeader className="bg-muted/10">
            <TableRow className="border-b border-border/65">
              <TableHead className="text-start">
                {t("purchaseInvoice.table.invoiceNo")}
              </TableHead>
              <TableHead className="text-start">
                {t("purchaseInvoice.table.supplier")}
              </TableHead>
              <TableHead className="text-center">
                {t("purchaseInvoice.table.date")}
              </TableHead>
              <TableHead className="text-center">
                {t("purchaseInvoice.table.grandTotal")}
              </TableHead>
              <TableHead className="text-center">
                {t("purchaseInvoice.table.amountPaid")}
              </TableHead>
              <TableHead className="text-center">
                {t("purchaseInvoice.table.amountDue")}
              </TableHead>
              <TableHead className="text-center">
                {t("purchaseInvoice.table.paymentMethod")}
              </TableHead>
              <TableHead className="text-center">
                {t("purchaseInvoice.table.paymentStatus")}
              </TableHead>
              <TableHead className="text-center">
                {t("purchaseInvoice.table.status")}
              </TableHead>
              <TableHead className="text-center">
                {t("purchaseInvoice.table.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="text-center py-12 text-muted-foreground font-semibold"
                >
                  {t("purchaseInvoice.table.noData")}
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice) => (
                <TableRow
                  key={invoice.id}
                  className="border-b border-border/40 hover:bg-muted/10"
                >
                  <TableCell className="font-bold text-foreground text-start py-4 font-mono">
                    {invoice.invoice_number}
                  </TableCell>
                  <TableCell className="text-start">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-foreground">
                        {invoice.supplier?.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate max-w-45">
                        {invoice.supplier?.phone}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-mono">
                    {formatDate(invoice.invoice_date)}
                  </TableCell>
                  <TableCell className="text-center font-bold text-foreground">
                    {formatCurrency(invoice.grand_total)}
                  </TableCell>
                  <TableCell className="text-center font-bold text-emerald-500">
                    {formatCurrency(invoice.amount_paid)}
                  </TableCell>
                  <TableCell className="text-center font-bold text-destructive">
                    {formatCurrency(invoice.amount_due)}
                  </TableCell>
                  <TableCell className="text-center font-semibold capitalize text-muted-foreground">
                    {invoice.payment_method === "debt"
                      ? t("purchaseInvoice.paymentMethod.debt")
                      : t("purchaseInvoice.paymentMethod.cash")}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-bold px-2.5 py-0.5 ${
                        invoice.payment_status === "paid"
                          ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-400"
                          : invoice.payment_status === "partial"
                            ? "border-blue-500/30 bg-blue-500/5 text-blue-400"
                            : "border-destructive/30 bg-destructive/5 text-destructive"
                      }`}
                    >
                      {invoice.payment_status === "paid" &&
                        t("purchaseInvoice.paymentStatus.paid")}
                      {invoice.payment_status === "partial" &&
                        t("purchaseInvoice.paymentStatus.partial")}
                      {invoice.payment_status === "unpaid" &&
                        t("purchaseInvoice.paymentStatus.unpaid")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-bold px-2 py-0.5 ${
                        invoice.status === "completed"
                          ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-500"
                          : "border-destructive/20 bg-destructive/5 text-destructive"
                      }`}
                    >
                      {invoice.status === "completed"
                        ? t("purchaseInvoice.status.completed")
                        : t("purchaseInvoice.status.cancelled")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Link to={`/dashboard/purchase-details/${invoice.id}`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-muted"
                        title={t("purchaseInvoice.table.viewDetails")}
                      >
                        <Eye className="h-4 w-4 text-muted-foreground hover:text-primary" />
                      </Button>
                    </Link>
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
