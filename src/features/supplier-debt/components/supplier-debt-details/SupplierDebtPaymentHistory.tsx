import { Calendar, User, History } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DebtPayment } from "@/features/supplier-debt/types/SupplierDebt";

interface SupplierDebtPaymentHistoryProps {
  payments?: DebtPayment[];
}

export function SupplierDebtPaymentHistory({
  payments = [],
}: SupplierDebtPaymentHistoryProps) {
  return (
    <div className="p-6 rounded-2xl border border-border bg-card shadow-xs space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-border/60">
        <History className="w-4 h-4 text-primary" />
        <h2 className="text-base font-bold text-foreground">Payment History</h2>
      </div>

      <div className="rounded-xl border border-border bg-background overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="w-45">Date</TableHead>
              <TableHead className="w-45">Amount</TableHead>
              <TableHead className="w-50">Created By</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-xs font-medium">
            {payments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  No payment transactions recorded yet.
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-mono text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>{payment.payment_date}</span>
                    </div>
                  </TableCell>

                  <TableCell className="font-mono font-bold text-emerald-500">
                    +{payment.amount.toLocaleString()} YER
                  </TableCell>

                  <TableCell className="text-foreground">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>
                        {payment.created_by
                          ? `${payment.created_by.first_name} ${payment.created_by.last_name}`
                          : "System"}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-muted-foreground max-w-xs truncate">
                    {payment.notes || "—"}
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
