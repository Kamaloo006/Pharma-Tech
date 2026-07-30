import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Printer,
  Building2,
  FileText,
  Calendar,
  CreditCard,
  AlertCircle,
  PackageCheck,
  CheckCircle2,
  Loader2,
} from "lucide-react";

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
import { useSupplierReturnDetails } from "@/features/supplier-return/hooks/useSupplierReturns";

export default function SupplierReturnDetailsPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isArabic = i18n.language === "ar";

  // جلب البيانات عبر TanStack Query
  const { data, isLoading, isError } = useSupplierReturnDetails(id);
  const returnDetails = data?.data;

  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

  // تنسيق التاريخ
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString(
      isArabic ? "ar-EG" : "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      },
    );
  };

  // حالة التحميل (Loading State)
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // حالة الخطأ أو عدم وجود بيانات (Error State)
  if (isError || !returnDetails) {
    return (
      <div className="p-6 text-center space-y-4">
        <p className="text-destructive text-sm font-semibold">
          {t("supplierReturn.details.error", "Failed to load return details.")}
        </p>
        <Button
          variant="outline"
          onClick={() => navigate("/dashboard/supplier-returns")}
        >
          {t("common.back", "Go Back")}
        </Button>
      </div>
    );
  }

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="space-y-6 max-w-8xl  px-6 mx-auto"
    >
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/dashboard/supplier-return")}
            className="h-9 w-9 border-border/80"
          >
            {isArabic ? (
              <ArrowRight className="h-4 w-4" />
            ) : (
              <ArrowLeft className="h-4 w-4" />
            )}
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-foreground font-mono">
                {returnDetails.invoice_number}
              </h1>
              <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 gap-1 text-[11px] font-semibold uppercase">
                <CheckCircle2 className="w-3 h-3" />
                {returnDetails.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t(
                "supplierReturn.details.subtitle",
                "Supplier Return Invoice Details",
              )}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="h-9 text-xs gap-1.5 border-border/80"
          >
            <Printer className="w-3.5 h-3.5 text-muted-foreground" />
            {t("common.print", "Print")}
          </Button>
        </div>
      </div>

      {/* 2. Metadata Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Supplier */}
        <div className="bg-card border border-border/60 rounded-xl p-4 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5 text-primary" />
            {t("supplierReturn.details.supplier", "Supplier")}
          </span>
          <p className="text-xs font-bold text-foreground truncate">
            {returnDetails.supplier?.name}
          </p>
        </div>

        {/* Original Purchase Invoice */}
        <div className="bg-card border border-border/60 rounded-xl p-4 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5 text-primary" />
            {t("supplierReturn.details.originalInvoice", "Original Invoice")}
          </span>
          <button
            onClick={() =>
              navigate(
                `/dashboard/purchase-invoices/${returnDetails.original_purchase_invoice_id}`,
              )
            }
            className="text-xs font-bold text-primary hover:underline font-mono"
          >
            #{returnDetails.original_purchase_invoice_id}
          </button>
        </div>

        {/* Return Date */}
        <div className="bg-card border border-border/60 rounded-xl p-4 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            {t("supplierReturn.details.returnDate", "Return Date")}
          </span>
          <p className="text-xs font-bold text-foreground font-mono">
            {formatDate(returnDetails.invoice_date)}
          </p>
        </div>

        {/* Refund Method */}
        <div className="bg-card border border-border/60 rounded-xl p-4 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
            <CreditCard className="w-3.5 h-3.5 text-primary" />
            {t("supplierReturn.details.refundMethod", "Refund Method")}
          </span>
          <p className="text-xs font-bold text-foreground capitalize">
            {returnDetails.refund_method}
          </p>
        </div>
      </div>

      {/* 3. Items Table & Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table Column */}
        <div className="lg:col-span-2 bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 pb-2 border-b border-border/60">
            <PackageCheck className="w-4 h-4 text-primary" />
            {t("supplierReturn.details.returnedProducts", "Returned Products")}
          </h2>

          <div className="overflow-x-auto">
            <Table className="text-xs">
              <TableHeader className="bg-muted/30">
                <TableRow className="border-b border-border/60">
                  <TableHead className={isArabic ? "text-right" : "text-left"}>
                    {t("supplierReturn.details.product", "Product")}
                  </TableHead>
                  <TableHead className="text-center">
                    {t("supplierReturn.details.qty", "Qty")}
                  </TableHead>
                  <TableHead className="text-center">
                    {t("supplierReturn.details.unitPrice", "Unit Price")}
                  </TableHead>
                  <TableHead className="text-center">
                    {t("supplierReturn.details.total", "Total")}
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {returnDetails.items.map((item) => (
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

                    <TableCell className="text-center font-mono font-bold text-foreground">
                      {formatCurrency(item.line_total)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-4">
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-3 text-xs">
            <h3 className="font-bold text-foreground pb-2 border-b border-border/60">
              {t("supplierReturn.details.summary", "Financial Summary")}
            </h3>

            <div className="flex justify-between text-muted-foreground">
              <span>{t("supplierReturn.details.subtotal", "Subtotal")}</span>
              <span className="font-mono font-semibold text-foreground">
                {formatCurrency(returnDetails.subtotal)}
              </span>
            </div>

            <div className="flex justify-between text-muted-foreground">
              <span>{t("supplierReturn.details.tax", "Tax")}</span>
              <span className="font-mono text-foreground">
                {formatCurrency(returnDetails.tax_total)}
              </span>
            </div>

            <div className="flex justify-between text-muted-foreground">
              <span>{t("supplierReturn.details.discount", "Discount")}</span>
              <span className="font-mono text-foreground">
                {formatCurrency(returnDetails.discount_total)}
              </span>
            </div>

            <div className="pt-3 border-t border-border/60 flex justify-between items-center text-sm font-bold">
              <span className="text-foreground">
                {t("supplierReturn.details.refundTotal", "Refund Total")}
              </span>
              <span className="font-mono text-primary text-base">
                {formatCurrency(returnDetails.refund_total)}
              </span>
            </div>
          </div>

          {/* Reason Card */}
          {returnDetails.reason && (
            <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-2">
              <span className="text-[11px] font-bold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                {t("supplierReturn.details.reason", "Reason")}
              </span>
              <p className="text-xs text-foreground bg-muted/40 p-3 rounded-lg border border-border/50">
                {returnDetails.reason}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
