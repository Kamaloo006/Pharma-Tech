import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  useCancelSalesInvoice,
  useSalesInvoice,
} from "@/features/sales-invoice/hooks/useSalesInvoices";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Loader2 } from "lucide-react";
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

// المكونات الفرعية
import { InvoiceHeader } from "@/features/sales-invoice/components/sales-invoice-details/InvoiceHeader";
import { CustomerCard } from "@/features/sales-invoice/components/sales-invoice-details/CustomerCard";
import { InvoiceItemsTable } from "@/features/sales-invoice/components/sales-invoice-details/InvoiceItemsTable";
import {
  PaymentSummaryCard,
  TotalsBreakdownCard,
  CreatedByCard,
} from "@/features/sales-invoice/components/sales-invoice-details/PaymentAndTotalsCards";

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
  const { t } = useTranslation();
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
    return <InvoiceDetailsSkeleton />;
  }

  if (isError || !invoice) {
    return (
      <div className="px-6 space-y-4 max-w-8xl mx-auto">
        <p className="text-destructive font-bold">
          {error?.message || t("salesInvoice.errorLoading")}
        </p>
        <Button variant="outline" onClick={() => navigate(-1)}>
          {t("common.back")}
        </Button>
      </div>
    );
  }

  const isCancelled = invoice.status?.toLowerCase() === "cancelled";

  return (
    <div className="px-6 space-y-4 max-w-8xl mx-auto">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
        </Button>
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          {t("salesInvoice.backToInvoices")}
        </span>
      </div>

      <InvoiceHeader
        invoiceNumber={invoice.invoice_number}
        invoiceDate={invoice.invoice_date}
        status={invoice.status}
        isCancelled={isCancelled}
        isCancelling={isCancelling}
        onCancelClick={() => setIsCancelDialogOpen(true)}
        formatDate={formatDate}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
        <div className="space-y-5">
          <CustomerCard customer={invoice.customer} />
          <InvoiceItemsTable items={invoice.items} />

          {invoice.notes && (
            <Card className="border-border/60 shadow-xs rounded-2xl overflow-hidden">
              <CardHeader className="bg-muted/20 border-b border-border/60 py-2.5 px-4">
                <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {t("salesInvoice.notes")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 text-xs text-muted-foreground italic">
                {invoice.notes}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-5">
          <PaymentSummaryCard invoice={invoice} />
          <TotalsBreakdownCard invoice={invoice} />
          <CreatedByCard
            createdBy={invoice.created_by}
            createdAt={invoice.created_at}
            formatDate={formatDate}
          />
        </div>
      </div>

      <AlertDialog
        open={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
      >
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("salesInvoice.dialog.title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("salesInvoice.dialog.description", {
                number: invoice.invoice_number,
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl">
              {t("common.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              disabled={isCancelling}
              className="bg-red-600 text-white hover:bg-red-700/90 cursor-pointer rounded-xl"
            >
              {isCancelling && (
                <Loader2 className="h-4 w-4 animate-spin mr-1 rtl:ml-1 rtl:mr-0" />
              )}
              {t("salesInvoice.dialog.confirmAction")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Skeleton component لتخفيف القراءة
function InvoiceDetailsSkeleton() {
  return (
    <div className="px-6 space-y-5 text-start max-w-8xl mx-auto pb-20 animate-pulse">
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-4 w-28 rounded-md" />
      </div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
        <div className="space-y-5">
          <Card className="border-border/60 shadow-xs rounded-2xl overflow-hidden">
            <div className="bg-muted/20 border-b border-border/60 py-2.5 px-4">
              <Skeleton className="h-4 w-24 rounded-md" />
            </div>
            <CardContent className="p-4 flex items-center justify-between">
              <Skeleton className="h-5 w-36 rounded-md" />
              <Skeleton className="h-6 w-28 rounded-lg" />
            </CardContent>
          </Card>
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
        <div className="space-y-5">
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
        </div>
      </div>
    </div>
  );
}
