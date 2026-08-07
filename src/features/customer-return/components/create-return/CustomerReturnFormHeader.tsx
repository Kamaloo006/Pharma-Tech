import { useTranslation } from "react-i18next";
import { User, FileText } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Customer } from "../../types/CustomerReturn";
import type { SalesInvoice } from "@/features/sales-invoice/types/salesInvoice";

interface Props {
  customerId: string;
  invoiceId: string;
  customers: Customer[];
  salesInvoices: SalesInvoice[];
  loadingCustomers: boolean;
  loadingInvoices: boolean;
  isPending: boolean;
  onCustomerChange: (val: string) => void;
  onInvoiceChange: (val: string) => void;
  formatCurrency?: (amount: number) => string;
}

export function CustomerReturnFormHeader({
  customerId,
  invoiceId,
  customers,
  salesInvoices,
  loadingCustomers,
  loadingInvoices,
  isPending,
  onCustomerChange,
  onInvoiceChange,
  formatCurrency = (val) => `$${val}`,
}: Props) {
  const { t } = useTranslation();

  return (
    <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Customer Select */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-primary" />
            {t("customerReturn.create.customer", "Customer")}
          </Label>
          <Select
            value={customerId}
            onValueChange={onCustomerChange}
            disabled={loadingCustomers || isPending}
          >
            <SelectTrigger className="h-10 text-xs bg-muted/50 border-border/80 focus:ring-2 focus:ring-primary/20">
              <SelectValue
                placeholder={
                  loadingCustomers
                    ? t("common.loading", "Loading...")
                    : t(
                        "customerReturn.create.selectCustomer",
                        "Select Customer",
                      )
                }
              />
            </SelectTrigger>
            <SelectContent className="bg-muted text-popover-foreground border-border shadow-md">
              {/* خيار العميل العابر Walk-in */}
              <SelectItem
                value="walk_in"
                className="text-xs hover:bg-primary/70 text-foreground"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] bg-muted/60">
                    {t("customerReturn.walkIn", "Walk-in Customer")}
                  </Badge>
                </div>
              </SelectItem>

              {/* قائمة العملاء المسجلين */}
              {customers.map((cust) => (
                <SelectItem
                  key={cust.id}
                  value={cust.id.toString()}
                  className="text-xs hover:bg-primary/70 text-foreground"
                >
                  <span>{cust.full_name}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sales Invoice Select */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-primary" />
            {t(
              "customerReturn.create.originalInvoice",
              "Original Sales Invoice",
            )}
          </Label>
          <Select
            value={invoiceId}
            onValueChange={onInvoiceChange}
            disabled={!customerId || loadingInvoices || isPending}
          >
            <SelectTrigger className="h-10 text-xs bg-muted/50 border-border/80 focus:ring-2 focus:ring-primary/20 font-mono">
              <SelectValue
                placeholder={
                  loadingInvoices
                    ? t("common.loading", "Loading...")
                    : t(
                        "customerReturn.create.selectInvoice",
                        "Select Original Invoice",
                      )
                }
              />
            </SelectTrigger>
            <SelectContent className="bg-muted text-popover-foreground border-border shadow-md font-mono text-xs">
              {salesInvoices.map((inv) => (
                <SelectItem
                  key={inv.id}
                  value={inv.id.toString()}
                  className="text-xs flex items-center justify-between hover:bg-primary/70 hover:text-white"
                >
                  <span>{inv.invoice_number}</span>
                  {inv.grand_total && (
                    <span className="text-muted-foreground font-semibold ms-2">
                      ({formatCurrency(inv.grand_total)})
                    </span>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
