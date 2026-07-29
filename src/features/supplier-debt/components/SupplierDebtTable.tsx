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
import type {
  SupplierDebtItem,
  DebtStatus,
} from "@/features/supplier-debt/types/SupplierDebt";

interface SupplierDebtTableProps {
  isLoading: boolean;
  isError: boolean;
  debts: SupplierDebtItem[];
  showFilterLoading?: boolean;
  refetch: () => void;
  formatDate: (date: string) => string;
  formatCurrency: (amount: number) => string;
}

export function SupplierDebtTable({
  isLoading,
  isError,
  debts = [],
  showFilterLoading = false,
  refetch,
  formatDate,
  formatCurrency,
}: SupplierDebtTableProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-75 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground">
          {t("supplierDebt.table.loading", "جاري تحميل ديون الموردين...")}
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-75 text-center p-6">
        <AlertCircle className="h-10 w-10 text-destructive mb-2" />
        <p className="text-xs font-bold text-foreground">
          {t("supplierDebt.table.error", "حدث خطأ أثناء تحميل البيانات")}
        </p>
        <Button
          onClick={() => refetch()}
          variant="outline"
          className="h-8 text-[11px] font-bold mt-3"
        >
          {t("common.retry", "إعادة المحاولة")}
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
                {t("supplierDebt.table.invoiceNo", "رقم الفاتورة")}
              </TableHead>
              <TableHead className="text-start">
                {t("supplierDebt.table.supplier", "المورد")}
              </TableHead>
              <TableHead className="text-center">
                {t("supplierDebt.table.dueDate", "تاريخ الاستحقاق")}
              </TableHead>
              <TableHead className="text-center">
                {t("supplierDebt.table.totalAmount", "المبلغ الإجمالي")}
              </TableHead>
              <TableHead className="text-center">
                {t("supplierDebt.table.paidAmount", "المبلغ المدفوع")}
              </TableHead>
              <TableHead className="text-center">
                {t("supplierDebt.table.remainingAmount", "المبلغ المتبقي")}
              </TableHead>
              <TableHead className="text-center">
                {t("supplierDebt.table.status", "حالة الدين")}
              </TableHead>
              <TableHead className="text-center">
                {t("supplierDebt.table.actions", "الإجراءات")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {debts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-12 text-muted-foreground font-semibold"
                >
                  {t("supplierDebt.table.noData", "لا توجد ديون للعرض")}
                </TableCell>
              </TableRow>
            ) : (
              debts.map((item) => {
                // حل أخطاء undefined بتمرير قيم افتراضية النصية
                const dateValue = item.due_date || item.created_at || "";
                const debtStatus: DebtStatus = item.status;

                return (
                  <TableRow
                    key={item.id}
                    className="border-b border-border/40 hover:bg-muted/10"
                  >
                    <TableCell className="font-bold text-foreground text-start py-4 font-mono">
                      {item.invoice_number || `#${item.id}`}
                    </TableCell>

                    <TableCell className="text-start">
                      <div className="space-y-0.5">
                        <p className="font-semibold text-foreground">
                          {item.supplier?.name}
                        </p>
                        {item.supplier?.phone && (
                          <p className="text-[10px] text-muted-foreground truncate max-w-45">
                            {item.supplier.phone}
                          </p>
                        )}
                      </div>
                    </TableCell>

                    {/* حماية تاريخ الاستحقاق من undefined */}
                    <TableCell className="text-center font-mono">
                      {formatDate(dateValue)}
                    </TableCell>

                    <TableCell className="text-center font-bold text-foreground">
                      {formatCurrency(item.total_amount ?? 0)}
                    </TableCell>

                    <TableCell className="text-center font-bold text-emerald-500">
                      {formatCurrency(item.paid_amount ?? 0)}
                    </TableCell>

                    <TableCell className="text-center font-bold text-destructive">
                      {formatCurrency(item.remaining_amount ?? 0)}
                    </TableCell>

                    {/* استخدام قيم DebtStatus الصحيحة ("open" بدلاً من "unpaid") */}
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold px-2.5 py-0.5 ${
                          debtStatus === "paid"
                            ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-400"
                            : debtStatus === "partial"
                              ? "border-blue-500/30 bg-blue-500/5 text-blue-400"
                              : debtStatus === "overdue"
                                ? "border-amber-500/30 bg-amber-500/5 text-amber-500"
                                : debtStatus === "cancelled"
                                  ? "border-muted bg-muted/20 text-muted-foreground"
                                  : "border-destructive/30 bg-destructive/5 text-destructive" // حالة open
                        }`}
                      >
                        {debtStatus === "paid" &&
                          t("supplierDebt.status.paid", "مكتمل")}
                        {debtStatus === "partial" &&
                          t("supplierDebt.status.partial", "مدفوع جزئياً")}
                        {debtStatus === "overdue" &&
                          t("supplierDebt.status.overdue", "متأخر")}
                        {debtStatus === "cancelled" &&
                          t("supplierDebt.status.cancelled", "ملغى")}
                        {(debtStatus === "open" || !debtStatus) &&
                          t("supplierDebt.status.open", "غير مدفوع")}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-center">
                      <Link to={`/dashboard/supplier-debt/${item.id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-muted"
                          title={t(
                            "supplierDebt.table.viewDetails",
                            "عرض التفاصيل",
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
