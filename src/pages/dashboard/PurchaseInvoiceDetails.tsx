import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  Printer,
  AlertCircle,
  Badge,
  XCircle,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  usePurchaseInvoiceDetails,
  useCancelPurchaseInvoice,
} from "@/features/purchase-invoice/hooks/usePurchaseInvoiceDetails";

import { InvoiceInfoCard } from "@/features/purchase-invoice/components/PurchaseInvoiceDetails/InvoiceInfoCard";
import { ReceivedProductsCard } from "@/features/purchase-invoice/components/PurchaseInvoiceDetails/ReceivedProductsCard";
import { SupplierDebtCard } from "@/features/purchase-invoice/components/PurchaseInvoiceDetails/SupplierDebtCard";
import { StockStatusCard } from "@/features/purchase-invoice/components/PurchaseInvoiceDetails/StockStatusCard";
import { PaymentDetailsCard2 } from "@/features/purchase-invoice/components/PurchaseInvoiceDetails/PaymentDetailsCard2";

export default function PurchaseInvoiceDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: invoice, isLoading, isError } = usePurchaseInvoiceDetails(id);
  const cancelInvoiceMutation = useCancelPurchaseInvoice();

  if (isLoading) {
    return (
      <div className="flex h-96 w-full items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="text-sm font-semibold">
          {isArabic
            ? "جاري تحميل تفاصيل الفاتورة..."
            : "Loading invoice details..."}
        </span>
      </div>
    );
  }

  if (isError || !invoice) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4 text-center">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <div className="space-y-1">
          <h3 className="text-base font-bold">
            {isArabic ? "لم يتم العثور على الفاتورة" : "Invoice Not Found"}
          </h3>
          <p className="text-xs text-muted-foreground">
            {isArabic
              ? "تعذر تحميل بيانات الفاتورة أو أنها غير موجودة."
              : "Unable to load invoice details or it doesn't exist."}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          {isArabic ? "الرجوع للناحية السابقة" : "Go Back"}
        </Button>
      </div>
    );
  }

  const isCompleted = invoice.status === "completed";
  const hasSupplierDebt = (invoice.amount_due ?? 0) > 0;

  const handleCancelInvoice = () => {
    if (!id) return;
    cancelInvoiceMutation.mutate(id, {
      onSuccess: () => setIsDialogOpen(false),
    });
  };

  return (
    <div className="space-y-6 p-6" dir={isArabic ? "rtl" : "ltr"}>
      {/* هيدر الصفحة */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 text-start">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-xl"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className={`h-4 w-4 ${isArabic ? "rotate-180" : ""}`} />
          </Button>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                {isArabic
                  ? `تفاصيل الفاتورة ${invoice.invoice_number}`
                  : `Invoice Details ${invoice.invoice_number}`}
              </h2>
              <Badge
                className={`text-[10px] font-bold ${
                  isCompleted
                    ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-400"
                    : "border-destructive/30 bg-destructive/5 text-destructive"
                }`}
              >
                {isCompleted
                  ? isArabic
                    ? "تم ترحيلها بنجاح"
                    : "Successfully Posted"
                  : isArabic
                    ? "ملغاة ومسحوبة"
                    : "Cancelled & Reversed"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {isArabic
                ? "مراجعة بنود المشتريات، المخزون المستلم، والحسابات المالية الفورية."
                : "Review purchase items, received stocks, and financial summaries."}
            </p>
          </div>
        </div>

        {/* أزرار الإجراءات */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isCompleted && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 text-xs font-semibold gap-2 text-destructive border-destructive/20 hover:bg-destructive/10 transition-colors rounded-lg"
                >
                  <XCircle className="h-4 w-4" />
                  <span>{isArabic ? "إلغاء الفاتورة" : "Cancel Invoice"}</span>
                </Button>
              </DialogTrigger>

              <DialogContent
                className="bg-card border border-border sm:max-w-md rounded-2xl p-6 text-start shadow-xl gap-5"
                dir={isArabic ? "rtl" : "ltr"}
              >
                {/* Dialog Header مع محاذاة نظيفة وترتيب ممتاز مع زر الإغلاق */}
                <DialogHeader className="space-y-1.5 text-start pe-6">
                  <DialogTitle className="text-base font-bold text-foreground tracking-tight">
                    {isArabic
                      ? "إلغاء فاتورة الشراء"
                      : "Cancel Purchase Invoice"}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
                    {isArabic
                      ? "هل أنت متأكد من توقيف وإلغاء هذه الفاتورة؟"
                      : "Are you sure you want to cancel this invoice?"}
                  </DialogDescription>
                </DialogHeader>

                {/* صندوق التنبيه الداخلي بتباين عالي وحواف واضحة */}
                <div className="bg-destructive/5 border border-destructive/15 rounded-xl p-4 text-xs space-y-2.5">
                  <p className="font-bold text-destructive flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>
                      {isArabic
                        ? "سيترتب على هذا الإجراء:"
                        : "This action will:"}
                    </span>
                  </p>

                  <ul className="space-y-1.5 text-foreground/80 font-medium list-disc list-inside pe-1">
                    <li>
                      {isArabic
                        ? "خصم الكميات المضافة من المخزن"
                        : "Deduct quantities from stock"}
                    </li>
                    <li>
                      {isArabic
                        ? "استرداد المبلغ المخصوم للكاش"
                        : "Refund paid amount to cash box"}
                    </li>
                    <li>
                      {isArabic
                        ? "تصفير دين المورد المرتبط"
                        : "Clear associated supplier debt"}
                    </li>
                  </ul>
                </div>

                {/* Footer وأزرار الإجراءات */}
                <DialogFooter className="flex flex-row items-center justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1 sm:flex-none h-9 text-xs cursor-pointer font-semibold rounded-lg px-4"
                    disabled={cancelInvoiceMutation.isPending}
                  >
                    {isArabic ? "إلغاء" : "Back"}
                  </Button>
                  <Button
                    onClick={handleCancelInvoice}
                    className="flex-1 sm:flex-none h-9 text-white cursor-pointer bg-red-500 hover:bg-red-600 text-xs font-semibold gap-2 rounded-lg px-4 shadow-sm"
                    disabled={cancelInvoiceMutation.isPending}
                  >
                    {cancelInvoiceMutation.isPending && (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    )}
                    {isArabic ? "تأكيد الإلغاء" : "Confirm Cancel"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          <Button
            variant="outline"
            className="h-10 text-xs font-bold gap-2"
            onClick={() => window.print()}
          >
            <Printer className="h-4 w-4 text-muted-foreground" />
            <span>{isArabic ? "طباعة الفاتورة" : "Print Invoice"}</span>
          </Button>
        </div>
      </div>

      {/* تفاصيل المكونات الموزعة */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-start">
        <div className="lg:col-span-2 space-y-6">
          <InvoiceInfoCard invoice={invoice} />
          <ReceivedProductsCard items={invoice.items} />
        </div>

        <div className="space-y-6">
          <PaymentDetailsCard2 invoice={invoice} />
          {hasSupplierDebt && isCompleted && (
            <SupplierDebtCard invoice={invoice} />
          )}
          <StockStatusCard items={invoice.items} isCompleted={isCompleted} />
        </div>
      </div>
    </div>
  );
}
