import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Eye, Loader2 } from "lucide-react";

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
import type {
  CustomerDebtItem,
  DebtStatus,
} from "@/features/customer-debt/types/customerDebt";

interface DebtTableProps {
  debtsList: CustomerDebtItem[];
  isLoading: boolean;
  isArabic: boolean;
  formatCurrency: (amt: number) => string;
  formatDate: (d?: string | null) => string;
}

export const DebtTable: React.FC<DebtTableProps> = ({
  debtsList,
  isLoading,
  isArabic,
  formatCurrency,
  formatDate,
}) => {
  const { t } = useTranslation();

  return (
    <div className="overflow-x-auto">
      <Table className="text-xs">
        <TableHeader className="bg-muted/10">
          <TableRow className="border-b border-border/65">
            <TableHead className={isArabic ? "text-right" : "text-left"}>
              {t("customerDebt.table.customer")}
            </TableHead>
            <TableHead className={isArabic ? "text-right" : "text-left"}>
              {t("customerDebt.table.invoiceNo")}
            </TableHead>
            <TableHead className="text-center">
              {t("customerDebt.table.dueDate")}
            </TableHead>
            <TableHead className="text-center">
              {t("customerDebt.table.totalAmount")}
            </TableHead>
            <TableHead className="text-center">
              {t("customerDebt.table.paidAmount")}
            </TableHead>
            <TableHead className="text-center">
              {t("customerDebt.table.remainingAmount")}
            </TableHead>
            <TableHead className="text-center">
              {t("customerDebt.table.status")}
            </TableHead>
            <TableHead className="text-center">
              {t("customerDebt.table.actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-12">
                <div className="flex items-center justify-center gap-2 text-muted-foreground font-semibold">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>{t("common.loading")}</span>
                </div>
              </TableCell>
            </TableRow>
          ) : debtsList.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center py-12 text-muted-foreground font-semibold"
              >
                {t("customerDebt.table.noData")}
              </TableCell>
            </TableRow>
          ) : (
            debtsList.map((item) => {
              const dateValue = item.due_date || item.created_at || "";
              const debtStatus: DebtStatus = item.status;

              return (
                <TableRow
                  key={item.id}
                  className="border-b border-border/40 hover:bg-muted/10"
                >
                  <TableCell className={isArabic ? "text-right" : "text-left"}>
                    <div className="space-y-0.5">
                      <p className="font-semibold text-foreground">
                        {item.customer?.full_name}
                      </p>
                      {item.customer?.phone && (
                        <p className="text-[10px] text-muted-foreground truncate max-w-45">
                          {item.customer.phone}
                        </p>
                      )}
                    </div>
                  </TableCell>

                  <TableCell
                    className={`font-bold text-foreground py-4 font-mono ${
                      isArabic ? "text-right" : "text-left"
                    }`}
                  >
                    {`INV-${item.sales_invoice_id}`}
                  </TableCell>

                  <TableCell className="text-center font-mono">
                    {formatDate(dateValue)}
                  </TableCell>

                  <TableCell className="text-center font-bold text-foreground font-mono">
                    {formatCurrency(item.total_amount ?? 0)}
                  </TableCell>

                  <TableCell className="text-center font-bold text-emerald-500 font-mono">
                    {formatCurrency(item.paid_amount ?? 0)}
                  </TableCell>

                  <TableCell className="text-center font-bold text-destructive font-mono">
                    {formatCurrency(item.remaining_amount ?? 0)}
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-bold px-2.5 py-0.5 ${
                        debtStatus === "paid"
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                          : debtStatus === "partial"
                            ? "border-blue-500/30 bg-blue-500/10 text-blue-500"
                            : debtStatus === "open"
                              ? "border-amber-500/30 bg-amber-500/10 text-amber-500"
                              : debtStatus === "overdue"
                                ? "border-destructive/30 bg-destructive/10 text-destructive"
                                : "border-muted bg-muted/20 text-muted-foreground"
                      }`}
                    >
                      {debtStatus === "paid" && t("customerDebt.status.paid")}
                      {debtStatus === "partial" &&
                        t("customerDebt.status.partial")}
                      {debtStatus === "open" && t("customerDebt.status.open")}
                      {debtStatus === "overdue" &&
                        t("customerDebt.status.overdue")}
                      {debtStatus === "cancelled" &&
                        t("customerDebt.status.cancelled")}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-center">
                    <Link to={`/dashboard/customer-debt/${item.id}`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-muted"
                        title={t("customerDebt.table.viewDetails")}
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
  );
};
