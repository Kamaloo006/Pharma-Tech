import { useTranslation } from "react-i18next";
import { Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Payment {
  id: string | number;
  payment_date: string;
  amount: number;
  notes?: string | null;
  created_by?: {
    first_name: string;
    last_name: string;
  } | null;
}

interface PaymentHistoryTableProps {
  payments?: Payment[];
  formatCurrency: (val: number) => string;
  formatDate: (dateString?: string | null) => string;
}

export function PaymentHistoryTable({
  payments,
  formatCurrency,
  formatDate,
}: PaymentHistoryTableProps) {
  const { t } = useTranslation();

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <div>
            <CardTitle className="text-lg">
              {t("customerDebt.details.paymentHistory")}
            </CardTitle>
            <CardDescription>
              {t("customerDebt.details.paymentHistoryDesc")}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="text-start">
                  {t("customerDebt.details.historyTable.date")}
                </TableHead>
                <TableHead className="text-start">
                  {t("customerDebt.details.historyTable.amount")}
                </TableHead>
                <TableHead className="text-start">
                  {t("customerDebt.details.historyTable.createdBy")}
                </TableHead>
                <TableHead className="text-start">
                  {t("customerDebt.details.historyTable.notes")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments && payments.length > 0 ? (
                payments.map((payment) => (
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
                    {t("customerDebt.details.historyTable.noPayments")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
