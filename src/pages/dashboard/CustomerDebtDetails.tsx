import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CreditCard,
  User,
  FileText,
  Clock,
  DollarSign,
  Calendar as CalendarIcon,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCustomerDebtDetails } from "@/features/customer-debt/hooks/useCustomerDebtDetails";
import { usePayCustomerDebt } from "@/features/customer-debt/hooks/useCustomerDebtDetails";
import type { DebtStatus } from "@/features/supplier-debt/types/SupplierDebt";

export default function CustomerDebtDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isPayDialogOpen, setIsPayDialogOpen] = useState(false);

  const [amount, setAmount] = useState<string>("");
  const [paymentDate, setPaymentDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [notes, setNotes] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);

  const { data: debt, isLoading, isError } = useCustomerDebtDetails(id);
  const payDebtMutation = usePayCustomerDebt();

  useEffect(() => {
    if (debt) {
      setAmount(String(debt.remaining_amount));
      setPaymentDate(new Date().toISOString().split("T")[0]);
      setNotes("");
      setFormError(null);
    }
  }, [debt, isPayDialogOpen]);

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!debt || !id) return;

    const numericAmount = parseFloat(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      setFormError("يرجى إدخال مبلغ صحيح أكبر من 0.");
      return;
    }

    if (numericAmount > debt.remaining_amount) {
      setFormError(
        `المبلغ أدناه أكبر من المبلغ المتبقي (${debt.remaining_amount}).`,
      );
      return;
    }

    setFormError(null);

    payDebtMutation.mutate(
      {
        debtId: id,
        payload: {
          amount: numericAmount,
          payment_date: paymentDate,
          notes: notes.trim() || null,
        },
      },
      {
        onSuccess: () => {
          setIsPayDialogOpen(false);
        },
        onError: (err: any) => {
          setFormError(
            err?.response?.data?.message || "حدث خطأ أثناء إرسال الدفعة.",
          );
        },
      },
    );
  };

  const getStatusBadge = (status: DebtStatus) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
            مدفوع
          </Badge>
        );
      case "partial":
        return (
          <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20">
            مدفوع جزئياً
          </Badge>
        );
      case "overdue":
        return (
          <Badge className="bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/20">
            متأخر
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-muted text-muted-foreground border-border">
            ملغى
          </Badge>
        );
      default:
        return (
          <Badge className="bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20">
            مفتوح
          </Badge>
        );
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("ar-SY", {
      style: "currency",
      currency: "SYP",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("ar-SY", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          جاري تحميل تفاصيل الدين...
        </p>
      </div>
    );
  }

  if (isError || !debt) {
    return (
      <div className="p-6 space-y-6 max-w-8xl mx-auto">
        <p className="text-rose-500 font-semibold">
          حدث خطأ أثناء تحميل تفاصيل الدين أو البيانات غير موجودة.
        </p>
        <Button variant="outline" onClick={() => navigate(-1)}>
          العودة للخلف
        </Button>
      </div>
    );
  }

  return (
    <div className="px-6 space-y-6 max-w-8xl mx-auto" dir="rtl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => navigate(-1)}
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              دين الزبون #{debt.id}
            </h1>
            <p className="text-sm text-muted-foreground">
              تفاصيل الدين وسجل الدفعات الخاصة بالفاتورة رقم #
              {debt.sales_invoice_id}
            </p>
          </div>
        </div>

        <Button
          size="lg"
          className="gap-2 font-semibold shadow-sm"
          onClick={() => setIsPayDialogOpen(true)}
          disabled={debt.remaining_amount <= 0 || debt.status === "paid"}
        >
          <CreditCard className="h-5 w-5" />
          تسديد دين (Pay Debt)
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base font-semibold">
              الزبون (Customer)
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-lg font-bold">{debt.customer.full_name}</div>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="font-medium">الهاتف:</span>
              <span dir="ltr">{debt.customer.phone || "-"}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base font-semibold">
              الفاتورة (Invoice)
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-lg font-bold">INV-{debt.sales_invoice_id}</div>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <CalendarIcon className="h-3.5 w-3.5" />
              <span>تاريخ الدين: {formatDate(debt.created_at)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm bg-muted/30">
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base font-semibold">
              ملخص الدين (Summary)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">المبلغ الإجمالي:</span>
              <span className="font-semibold">
                {formatCurrency(debt.total_amount)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">المدفوع:</span>
              <span className="font-semibold text-emerald-600">
                {formatCurrency(debt.paid_amount)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm border-t border-border pt-2">
              <span className="font-bold">المتبقي:</span>
              <span className="font-bold text-base text-rose-600">
                {formatCurrency(debt.remaining_amount)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-xs text-muted-foreground">الحالة:</span>
              {getStatusBadge(debt.status)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle className="text-lg">
                سجل الدفعات (Payment History)
              </CardTitle>
              <CardDescription>
                جميع عمليات التسديد التي تمت على هذا الدين
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="text-right">التاريخ (Date)</TableHead>
                  <TableHead className="text-right">المبلغ (Amount)</TableHead>
                  <TableHead className="text-right">
                    بواسطة (Created By)
                  </TableHead>
                  <TableHead className="text-right">ملاحظات (Notes)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {debt.payments && debt.payments.length > 0 ? (
                  debt.payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">
                        {formatDate(payment.payment_date)}
                      </TableCell>
                      <TableCell className="text-emerald-600 font-semibold">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell>
                        {payment.created_by
                          ? `${payment.created_by.first_name} ${payment.created_by.last_name}`
                          : "-"}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {payment.notes || "-"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-6 text-muted-foreground"
                    >
                      لا توجد دفعات مسجلة بعد.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isPayDialogOpen} onOpenChange={setIsPayDialogOpen}>
        <DialogContent className="sm:max-w-106.25" dir="rtl">
          <form onSubmit={handlePaySubmit}>
            <DialogHeader>
              <DialogTitle>تسديد دين زبون (Pay Customer Debt)</DialogTitle>
              <DialogDescription>
                إدخال دفعة جديدة للدين الخاص بالفاتورة INV-
                {debt.sales_invoice_id}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-3">
              <div className="p-3 bg-muted rounded-lg flex justify-between items-center text-sm">
                <span className="text-muted-foreground">
                  المبلغ المتبقي للدفعة:
                </span>
                <span className="font-bold text-rose-600 text-base">
                  {formatCurrency(debt.remaining_amount)}
                </span>
              </div>

              {formError && (
                <div className="p-2.5 text-xs rounded bg-rose-500/10 text-rose-600 border border-rose-500/20 font-medium">
                  {formError}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="amount">المبلغ (Amount)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  max={debt.remaining_amount}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_date">
                  تاريخ الدفعة (Payment Date)
                </Label>
                <Input
                  id="payment_date"
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">ملاحظات (Notes)</Label>
                <Textarea
                  id="notes"
                  placeholder="أضف أي ملاحظات إضافية حول الدفعة هنا..."
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPayDialogOpen(false)}
                disabled={payDebtMutation.isPending}
              >
                إلغاء (Cancel)
              </Button>

              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 cursor-pointer"
                disabled={payDebtMutation.isPending}
              >
                {payDebtMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin ml-2" />
                    جاري التسديد...
                  </>
                ) : (
                  "تسديد (Pay)"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
