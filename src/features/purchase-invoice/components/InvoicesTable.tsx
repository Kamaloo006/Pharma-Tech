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
  isArabic: boolean;
  formatDate: (date: string) => string;
  formatCurrency: (amount: number) => string;
}

export function InvoicesTable({
  isLoading,
  isError,
  invoices,
  showFilterLoading,
  refetch,
  isArabic,
  formatDate,
  formatCurrency,
}: InvoicesTableProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-75 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground">
          {isArabic ? "جاري جلب الفواتير..." : "Loading invoices..."}
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-75 text-center p-6">
        <AlertCircle className="h-10 w-10 text-destructive mb-2" />
        <p className="text-xs font-bold text-foreground">
          {isArabic ? "فشل تحديث البيانات" : "Failed to load data"}
        </p>
        <Button
          onClick={() => refetch()}
          variant="outline"
          className="h-8 text-[11px] font-bold mt-3"
        >
          {isArabic ? "إعادة المحاولة" : "Retry"}
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
              <TableHead className={isArabic ? "text-right" : "text-left"}>
                {isArabic ? "رقم الفاتورة" : "Invoice No."}
              </TableHead>
              <TableHead className={isArabic ? "text-right" : "text-left"}>
                {isArabic ? "المورد" : "Supplier"}
              </TableHead>
              <TableHead className="text-center">
                {isArabic ? "تاريخ الفاتورة" : "Date"}
              </TableHead>
              <TableHead className="text-center">
                {isArabic ? "المجموع الكلي" : "Grand Total"}
              </TableHead>
              <TableHead className="text-center">
                {isArabic ? "المدفوع" : "Amount Paid"}
              </TableHead>
              <TableHead className="text-center">
                {isArabic ? "المتبقي" : "Amount Due"}
              </TableHead>
              <TableHead className="text-center">
                {isArabic ? "طريقة الدفع" : "Payment Method"}
              </TableHead>
              <TableHead className="text-center">
                {isArabic ? "حالة الدفع" : "Payment Status"}
              </TableHead>
              <TableHead className="text-center">
                {isArabic ? "الحالة" : "Status"}
              </TableHead>
              <TableHead className="text-center">
                {isArabic ? "خيارات" : "Actions"}
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
                  {isArabic
                    ? "لم نجد أي فواتير تطابق الفلاتر النشطة حالياً."
                    : "No invoices match your selected filters."}
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
                      ? isArabic
                        ? "ذمم / دين"
                        : "Debt"
                      : isArabic
                        ? "نقدي"
                        : "Cash"}
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
                        (isArabic ? "مدفوعة" : "Paid")}
                      {invoice.payment_status === "partial" &&
                        (isArabic ? "دفع جزئي" : "Partial")}
                      {invoice.payment_status === "unpaid" &&
                        (isArabic ? "غير مدفوعة" : "Unpaid")}
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
                        ? isArabic
                          ? "مرحّلة"
                          : "Completed"
                        : isArabic
                          ? "ملغاة"
                          : "Cancelled"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Link to={`/dashboard/purchase-details/${invoice.id}`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-muted"
                        title={isArabic ? "عرض التفاصيل" : "View Details"}
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
