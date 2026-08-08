import { useTranslation } from "react-i18next";
import { Loader2, AlertCircle, Eye, FileText } from "lucide-react";
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
import type { CustomerReturnInvoice } from "../types/CustomerReturn";

interface CustomerReturnTableProps {
  isLoading: boolean;
  isError: boolean;
  invoices: CustomerReturnInvoice[];
  showFilterLoading?: boolean;
  refetch: () => void;
  formatDate: (date: string) => string;
  formatCurrency: (amount: number) => string;
}

export function CustomerReturnTable({
  isLoading,
  isError,
  invoices = [],
  showFilterLoading = false,
  refetch,
  formatDate,
  formatCurrency,
}: CustomerReturnTableProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-75 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground">
          {t("customerReturn.table.loading", "Loading customer returns...")}
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-75 text-center p-6">
        <AlertCircle className="h-10 w-10 text-destructive mb-2" />
        <p className="text-xs font-bold text-foreground">
          {t("customerReturn.table.error", "Failed to load returns.")}
        </p>
        <Button
          onClick={() => refetch()}
          variant="outline"
          className="h-8 text-[11px] font-bold mt-3"
        >
          {t("common.retry", "Retry")}
        </Button>
      </div>
    );
  }

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
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
              <TableHead className={isArabic ? "text-right" : "text-left"}>
                {t("customerReturn.table.invoiceNo", "Invoice Number")}
              </TableHead>
              <TableHead className={isArabic ? "text-right" : "text-left"}>
                {t("customerReturn.table.customer", "Customer")}
              </TableHead>
              <TableHead className="text-center">
                {t(
                  "customerReturn.table.originalInvoice",
                  "Original Sales Invoice",
                )}
              </TableHead>
              <TableHead className="text-center">
                {t("customerReturn.table.invoiceDate", "Invoice Date")}
              </TableHead>
              <TableHead className="text-center">
                {t("customerReturn.table.refundTotal", "Refund Total")}
              </TableHead>
              <TableHead className="text-center">
                {t("customerReturn.table.refundMethod", "Refund Method")}
              </TableHead>
              <TableHead className="text-center">
                {t("customerReturn.table.status", "Status")}
              </TableHead>
              <TableHead className="text-center">
                {t("customerReturn.table.createdBy", "Created By")}
              </TableHead>
              <TableHead className="text-center">
                {t("customerReturn.table.actions", "Actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center py-12 text-muted-foreground font-semibold"
                >
                  {t(
                    "customerReturn.table.noData",
                    "No customer return invoices found",
                  )}
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((item) => {
                const dateValue = item.invoice_date || item.created_at || "";
                const returnStatus = item.status;

                return (
                  <TableRow
                    key={item.id}
                    className="border-b border-border/40 hover:bg-muted/10 "
                  >
                    {/* Invoice Number */}
                    <TableCell
                      className={`font-bold text-foreground py-4 font-mono ${
                        isArabic ? "text-right" : "text-left"
                      }`}
                    >
                      {item.invoice_number || `#${item.id}`}
                    </TableCell>

                    {/* Customer */}
                    <TableCell
                      className={isArabic ? "text-right" : "text-left"}
                    >
                      <div className="space-y-0.5">
                        <p className="font-semibold text-foreground">
                          {item.customer
                            ? item.customer.full_name
                            : t("customerReturn.walkIn", "Walk-in Customer")}
                        </p>
                        {item.customer?.phone && (
                          <p className="text-[10px] text-muted-foreground truncate max-w-45">
                            {item.customer.phone}
                          </p>
                        )}
                      </div>
                    </TableCell>

                    {/* Original Sales Invoice */}
                    <TableCell className="text-center font-mono">
                      {item.original_sales_invoice_id ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-primary">
                          <FileText className="w-3 h-3" />
                          {item.original_sales_invoice_id}
                        </span>
                      ) : (
                        "—"
                      )}
                    </TableCell>

                    {/* Invoice Date */}
                    <TableCell className="text-center font-mono">
                      {formatDate(dateValue)}
                    </TableCell>

                    {/* Refund Total */}
                    <TableCell className="text-center font-bold text-emerald-500">
                      {formatCurrency(item.refund_total ?? 0)}
                    </TableCell>

                    {/* Refund Method */}
                    <TableCell className="text-center capitalize font-medium text-muted-foreground">
                      <Badge
                        variant="outline"
                        className="text-[10px] font-semibold px-2 py-0.5 border-border/60 bg-muted/20"
                      >
                        {item.refund_method || "N/A"}
                      </Badge>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold px-2.5 py-0.5 ${
                          returnStatus === "completed"
                            ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-400"
                            : returnStatus === "approved"
                              ? "border-blue-500/30 bg-blue-500/5 text-blue-400"
                              : returnStatus === "pending"
                                ? "border-amber-500/30 bg-amber-500/5 text-amber-500"
                                : "border-destructive/30 bg-destructive/5 text-destructive"
                        }`}
                      >
                        {returnStatus === "completed" &&
                          t("customerReturn.status.completed", "Completed")}
                        {returnStatus === "approved" &&
                          t("customerReturn.status.approved", "Approved")}
                        {returnStatus === "pending" &&
                          t("customerReturn.status.pending", "Pending")}
                        {returnStatus === "cancelled" &&
                          t("customerReturn.status.cancelled", "Cancelled")}
                        {![
                          "completed",
                          "approved",
                          "pending",
                          "cancelled",
                        ].includes(returnStatus) && returnStatus}
                      </Badge>
                    </TableCell>

                    {/* Created By */}
                    <TableCell className="text-center text-muted-foreground font-medium">
                      {item.created_by
                        ? `${item.created_by.first_name} ${item.created_by.last_name}`
                        : "—"}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-center">
                      <Link to={`/dashboard/customer-return/${item.id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-muted cursor-pointer"
                          title={t(
                            "customerReturn.table.viewDetails",
                            "View Details",
                          )}
                        >
                          <Eye className="h-4 w-4 text-muted-foreground hover:text-primary" />
                        </Button>
                      </Link>
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
