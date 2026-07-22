import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface InvoiceHeaderProps {
  isArabic: boolean;
}

export function InvoiceHeader({ isArabic }: InvoiceHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1 text-start">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          {isArabic ? "فواتير المشتريات" : "Purchase Invoices"}
        </h2>
        <p className="text-xs text-muted-foreground">
          {isArabic
            ? "إدارة وتتبع فواتير التوريد، المدفوعات والديون للمستودعات."
            : "Manage and track warehouse supply invoices, payments, and debts."}
        </p>
      </div>
      <Link to="/dashboard/purchases/new">
        <Button className="h-10 text-xs font-bold gap-2 self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          <span>
            {isArabic ? "فاتورة مشتريات جديدة" : "New Purchase Invoice"}
          </span>
        </Button>
      </Link>
    </div>
  );
}
