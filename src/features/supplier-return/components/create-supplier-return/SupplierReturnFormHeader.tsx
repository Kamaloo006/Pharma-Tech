import { useTranslation } from "react-i18next";
import { Building2, FileText } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Supplier } from "../../types/SupplierReturn";

interface Props {
  supplierId: string;
  invoiceId: string;
  suppliers: Supplier[];
  purchaseInvoices: any[];
  loadingSuppliers: boolean;
  loadingInvoices: boolean;
  isPending: boolean;
  onSupplierChange: (val: string) => void;
  onInvoiceChange: (val: string) => void;
  formatCurrency?: (amount: number) => string;
}

export function SupplierReturnFormHeader({
  supplierId,
  invoiceId,
  suppliers,
  purchaseInvoices,
  loadingSuppliers,
  loadingInvoices,
  isPending,
  onSupplierChange,
  onInvoiceChange,
  formatCurrency = (val) => `SYP${val}`,
}: Props) {
  const { t } = useTranslation();

  return (
    <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Supplier Select */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-primary" />
            {t("supplierReturn.create.supplier")}
          </Label>
          <Select
            value={supplierId}
            onValueChange={onSupplierChange}
            disabled={loadingSuppliers || isPending}
          >
            <SelectTrigger className="h-10 text-xs bg-muted/50 border-border/80 focus:ring-2 focus:ring-primary/20">
              <SelectValue
                placeholder={
                  loadingSuppliers
                    ? t("common.loading")
                    : t("supplierReturn.create.selectSupplier")
                }
              />
            </SelectTrigger>
            <SelectContent className="bg-muted text-popover-foreground border-border shadow-md">
              {suppliers.map((sup: Supplier) => (
                <SelectItem
                  key={sup.id}
                  value={sup.id.toString()}
                  className="text-xs hover:bg-primary/70 text-foreground"
                >
                  {sup.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Purchase Invoice Select */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-primary" />
            {t("supplierReturn.create.originalInvoice")}
          </Label>
          <Select
            value={invoiceId}
            onValueChange={onInvoiceChange}
            disabled={!supplierId || loadingInvoices || isPending}
          >
            <SelectTrigger className="h-10 text-xs bg-muted/50 border-border/80 focus:ring-2 focus:ring-primary/20 font-mono">
              <SelectValue
                placeholder={
                  loadingInvoices
                    ? t("common.loading")
                    : t("supplierReturn.create.selectInvoice")
                }
              />
            </SelectTrigger>
            <SelectContent className="bg-muted text-popover-foreground border-border shadow-md font-mono text-xs">
              {purchaseInvoices.map((inv: any) => (
                <SelectItem
                  key={inv.id}
                  value={inv.id.toString()}
                  className="text-xs flex items-center justify-between hover:bg-primary/70 hover:text-white"
                >
                  <span>{inv.invoice_number}</span>
                  {inv.total_amount && (
                    <span className="text-muted-foreground font-semibold">
                      ({formatCurrency(inv.total_amount)})
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
