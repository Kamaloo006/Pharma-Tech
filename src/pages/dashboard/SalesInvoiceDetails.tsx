import { useParams, useNavigate } from "react-router-dom";
import {
  useCancelSalesInvoice,
  useSalesInvoice,
} from "@/features/sales-invoice/hooks/useSalesInvoices";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  User,
  CreditCard,
  Calendar,
  Phone,
  Ban,
  Clock,
  UserCheck,
  FileText,
  FileCheck2,
  Loader2,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
// دالة تنسيق التاريخ والوقت بشكل مقروء
const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function SalesInvoiceDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const {
    data: invoice,
    isLoading,
    isError,
    error,
  } = useSalesInvoice(id || "");

  const { mutate: cancelInvoice, isPending: isCancelling } =
    useCancelSalesInvoice();

  const handleConfirmCancel = () => {
    if (!id) return;
    cancelInvoice(id, {
      onSuccess: () => {
        setIsCancelDialogOpen(false);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="px-6 space-y-5 text-start max-w-8xl mx-auto pb-20 animate-pulse">
        {/* Back Button Skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-4 w-28 rounded-md" />
        </div>

        {/* Top Banner Skeleton */}
        <Card className="border-border/60 shadow-xs rounded-2xl overflow-hidden">
          <CardContent className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Skeleton className="h-7 w-48 rounded-lg" />
                <Skeleton className="h-6 w-20 rounded-lg" />
              </div>
              <Skeleton className="h-4 w-36 rounded-md" />
            </div>
            <Skeleton className="h-9 w-32 rounded-xl" />
          </CardContent>
        </Card>

        {/* Grid Layout Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          {/* Left Column Skeleton */}
          <div className="space-y-5">
            {/* Customer Card Skeleton */}
            <Card className="border-border/60 shadow-xs rounded-2xl overflow-hidden">
              <div className="bg-muted/20 border-b border-border/60 py-2.5 px-4">
                <Skeleton className="h-4 w-24 rounded-md" />
              </div>
              <CardContent className="p-4 flex items-center justify-between">
                <Skeleton className="h-5 w-36 rounded-md" />
                <Skeleton className="h-6 w-28 rounded-lg" />
              </CardContent>
            </Card>

            {/* Table Card Skeleton */}
            <Card className="border-border/60 shadow-xs rounded-2xl overflow-hidden">
              <div className="bg-muted/20 border-b border-border/60 py-2.5 px-4">
                <Skeleton className="h-4 w-20 rounded-md" />
              </div>
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between border-b border-border/40 pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-1.5"
                  >
                    <Skeleton className="h-4 w-28 rounded-md" />
                    <Skeleton className="h-4 w-8 rounded-md" />
                    <Skeleton className="h-4 w-14 rounded-md" />
                    <Skeleton className="h-4 w-16 rounded-md" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column Skeleton */}
          <div className="space-y-5">
            {/* Payment Card Skeleton */}
            <Card className="border-border/60 shadow-xs rounded-2xl overflow-hidden">
              <div className="bg-muted/20 border-b border-border/60 py-2.5 px-4">
                <Skeleton className="h-4 w-24 rounded-md" />
              </div>
              <CardContent className="p-4 grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-1.5">
                    <Skeleton className="h-3 w-14 rounded-md" />
                    <Skeleton className="h-5 w-20 rounded-md" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Summary Card Skeleton */}
            <Card className="border-border/60 shadow-xs rounded-2xl overflow-hidden">
              <div className="bg-muted/20 border-b border-border/60 py-2.5 px-4">
                <Skeleton className="h-4 w-28 rounded-md" />
              </div>
              <CardContent className="p-4 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <Skeleton className="h-4 w-20 rounded-md" />
                    <Skeleton className="h-4 w-16 rounded-md" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !invoice) {
    return (
      <div className="px-6 space-y-4 max-w-8xl mx-auto ">
        <p className="text-destructive font-bold">
          {error?.message || "تعذر تحميل بيانات الفاتورة"}
        </p>
        <Button variant="outline" onClick={() => navigate(-1)}>
          العودة
        </Button>
      </div>
    );
  }
  const isCancelled = invoice.status?.toLowerCase() === "cancelled";

  return (
    <div className="px-6 space-y-4 max-w-8xl mx-auto">
      {/* Back Header */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Back to Invoices
        </span>
      </div>

      {/* Top Header Banner */}
      {/* Top Header Banner */}
      <Card className="border-border/60 shadow-xs rounded-2xl overflow-hidden">
        <CardContent className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                Sales Invoice #{invoice.invoice_number}
              </h1>
              <Badge
                className={
                  isCancelled
                    ? "bg-destructive/15 text-destructive border-destructive/20 font-bold px-2.5 py-0.5 rounded-lg text-xs capitalize"
                    : "bg-emerald-500/15 text-emerald-600 border-emerald-500/20 font-bold px-2.5 py-0.5 rounded-lg text-xs capitalize"
                }
              >
                [{invoice.status}]
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              {formatDate(invoice.invoice_date)}
            </p>
          </div>

          {/* Cancel Invoice Button */}
          <Button
            variant="destructive"
            size="sm"
            disabled={isCancelled || isCancelling}
            onClick={() => setIsCancelDialogOpen(true)}
            className="h-9 px-4 text-xs font-bold gap-1.5 rounded-xl shrink-0"
          >
            {isCancelling ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Ban className="h-3.5 w-3.5" />
            )}
            {isCancelled ? "Invoice Cancelled" : "Cancel Invoice"}
          </Button>
        </CardContent>
      </Card>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
        {/* العمود الأيسر (Left Column) */}
        <div className="space-y-5">
          {/* Customer Card */}
          <Card className="border-border/60 shadow-xs rounded-2xl overflow-hidden">
            <CardHeader className="bg-muted/20 border-b border-border/60 py-2.5 px-4">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-primary" />
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                <span className="text-base">👤</span>
                {invoice.customer?.full_name || "Walk-in Customer"}
              </div>
              {invoice.customer?.phone && (
                <div className="flex items-center gap-1.5 font-mono text-muted-foreground bg-muted/40 px-2.5 py-1 rounded-lg">
                  <Phone className="h-3.5 w-3.5" />
                  {invoice.customer.phone}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Items Table Card */}
          <Card className="border-border/60 shadow-xs rounded-2xl overflow-hidden">
            <CardHeader className="bg-muted/20 border-b border-border/60 py-2.5 px-4">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-primary" />
                Items
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table className="text-xs">
                <TableHeader className="bg-muted/30">
                  <TableRow className="border-b border-border/60">
                    <TableHead className="font-bold py-2.5">Product</TableHead>
                    <TableHead className="font-bold py-2.5 text-center">
                      Qty
                    </TableHead>
                    <TableHead className="font-bold py-2.5 text-right">
                      Price
                    </TableHead>
                    <TableHead className="font-bold py-2.5 text-right">
                      Tax
                    </TableHead>
                    <TableHead className="font-bold py-2.5 text-right">
                      Discount
                    </TableHead>
                    <TableHead className="font-bold py-2.5 text-right">
                      Total
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.items?.map((item) => (
                    <TableRow
                      key={item.id}
                      className="border-b border-border/40"
                    >
                      <TableCell className="py-2.5 font-semibold text-foreground">
                        {item.product?.brand_name ||
                          item.product?.ar_name ||
                          "-"}
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
                        {item.line_total.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Notes Card */}
          {invoice.notes && (
            <Card className="border-border/60 shadow-xs rounded-2xl overflow-hidden">
              <CardHeader className="bg-muted/20 border-b border-border/60 py-2.5 px-4">
                <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 text-xs text-muted-foreground italic">
                {invoice.notes}
              </CardContent>
            </Card>
          )}
        </div>

        {/* العمود الأيمن (Right Column) */}
        <div className="space-y-5">
          {/* Payment Card */}
          <Card className="border-border/60 shadow-xs rounded-2xl overflow-hidden">
            <CardHeader className="bg-muted/20 border-b border-border/60 py-2.5 px-4">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5 text-primary" />
                Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="text-muted-foreground text-[11px]">Method</div>
                <div className="font-bold text-foreground capitalize mt-0.5">
                  {invoice.payment_method}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground text-[11px]">Status</div>
                <Badge
                  variant="outline"
                  className="mt-0.5 font-semibold text-[11px] rounded-md capitalize"
                >
                  {invoice.payment_status}
                </Badge>
              </div>
              <div>
                <div className="text-muted-foreground text-[11px]">Paid</div>
                <div className="font-mono font-bold text-emerald-600 mt-0.5">
                  {invoice.amount_paid.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground text-[11px]">Due</div>
                <div className="font-mono font-bold text-amber-600 mt-0.5">
                  {invoice.amount_due.toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Totals Breakdown Card */}
          <Card className="border-border/60 shadow-xs rounded-2xl overflow-hidden">
            <CardHeader className="bg-muted/20 border-b border-border/60 py-2.5 px-4">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck2 className="h-3.5 w-3.5 text-primary" />
                Totals Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2.5 text-xs">
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-mono font-medium text-foreground">
                  {invoice.subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Tax</span>
                <span className="font-mono font-medium text-foreground">
                  {invoice.tax_total.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Discount</span>
                <span className="font-mono font-medium text-foreground">
                  {invoice.discount_total.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center font-bold pt-2 border-t border-border/50 text-sm">
                <span className="text-foreground">Grand Total</span>
                <span className="font-mono text-primary">
                  {invoice.grand_total.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-emerald-600 font-semibold">
                <span>Paid</span>
                <span className="font-mono">
                  {invoice.amount_paid.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-amber-600 font-semibold">
                <span>Due</span>
                <span className="font-mono">
                  {invoice.amount_due.toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Created By / Metadata Card */}
          <Card className="border-border/60 shadow-xs rounded-2xl overflow-hidden bg-muted/10">
            <CardContent className="p-4 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <UserCheck className="h-3.5 w-3.5 text-primary" />
                Created by:
                <strong className="text-foreground ml-1">
                  {invoice.created_by
                    ? `${invoice.created_by.first_name} ${invoice.created_by.last_name}`
                    : "System"}
                </strong>
              </span>
              <span className="flex items-center gap-1 font-mono">
                <Clock className="h-3.5 w-3.5" />
                {formatDate(invoice.created_at)}
              </span>
            </CardContent>
          </Card>
        </div>
      </div>
      <AlertDialog
        open={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
      >
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>إلغاء الفاتورة</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت تأكد من أنك تريد إلغاء الفاتورة رقم #
              {invoice.invoice_number}؟ لا يمكن التراجع عن هذا الإجراء بعد
              تنفيذه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl">إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              disabled={isCancelling}
              className="bg-red-600 text-white hover:bg-red-700/90 cursor-pointer rounded-xl"
            >
              {isCancelling && (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              )}
              تأكيد الإلغاء
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
