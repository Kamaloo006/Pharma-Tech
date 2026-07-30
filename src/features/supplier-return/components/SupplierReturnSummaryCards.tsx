import { RotateCcw, CheckCircle2, XCircle, DollarSign } from "lucide-react";
import type { SupplierReturnInvoice } from "@/features/supplier-return/types/SupplierReturn";
import CountUpModule from "react-countup";
interface SupplierReturnSummaryCardsProps {
  invoices: SupplierReturnInvoice[];
  totalRecords: number;
}

export function SupplierReturnSummaryCards({
  invoices,
  totalRecords,
}: SupplierReturnSummaryCardsProps) {
  const completedCount = invoices.filter(
    (i) => i.status === "completed",
  ).length;
  const cancelledCount = invoices.filter(
    (i) => i.status === "cancelled",
  ).length;
  const totalRefunded = invoices.reduce(
    (acc, curr) => acc + (curr.refund_total || 0),
    0,
  );

  const CountUp = (CountUpModule as any).default || CountUpModule;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="p-5 rounded-2xl border border-border bg-card shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Total Returns
          </p>
          <p className="text-2xl font-bold font-mono text-foreground">
            <CountUp end={totalRecords} duration={1.2} preserveValue={true} />
          </p>
        </div>
        <div className="p-3 rounded-xl bg-primary/10 text-primary">
          <RotateCcw className="w-5 h-5" />
        </div>
      </div>

      <div className="p-5 rounded-2xl border border-border bg-card shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Completed
          </p>
          <p className="text-2xl font-bold font-mono text-emerald-500">
            <CountUp end={completedCount} duration={1.2} preserveValue={true} />
          </p>
        </div>
        <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>

      <div className="p-5 rounded-2xl border border-border bg-card shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Cancelled
          </p>
          <p className="text-2xl font-bold font-mono text-rose-500">
            {cancelledCount}
          </p>
        </div>
        <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500">
          <XCircle className="w-5 h-5" />
        </div>
      </div>

      <div className="p-5 rounded-2xl border border-border bg-card shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Total Refunded
          </p>
          <p className="text-2xl font-bold font-mono text-foreground">
            <CountUp end={totalRefunded} duration={1.2} preserveValue={true} />
            <span className="text-xs font-normal text-muted-foreground ml-1">
              SYR
            </span>
          </p>
        </div>
        <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
          <DollarSign className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
