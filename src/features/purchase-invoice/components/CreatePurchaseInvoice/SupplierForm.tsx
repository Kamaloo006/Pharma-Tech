import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarIcon, Info, Loader2 } from "lucide-react";
import { useSuppliers } from "@/features/suppliers/hooks/useSuppliers";
import type { Supplier } from "@/features/suppliers/types/Supplier";
import { useTranslation } from "react-i18next";

interface SupplierFormProps {
  supplierId: string;
  setSupplierId: (id: string) => void;
  invoiceDate: string;
  setInvoiceDate: (date: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
}

export function SupplierForm({
  supplierId,
  setSupplierId,
  invoiceDate,
  setInvoiceDate,
  notes,
  setNotes,
}: SupplierFormProps) {
  const { t } = useTranslation();
  const { suppliers, isLoading } = useSuppliers();

  return (
    <Card className="border-border bg-card shadow-sm rounded-2xl">
      <CardHeader className="pb-3 border-b border-border/40">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <Info className="h-4 w-4 text-primary" />
          {t("purchaseInvoice.supplierForm.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5 text-start">
          <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            {t("purchaseInvoice.supplierForm.supplierLabel")}
            {!supplierId && (
              <span className="text-[9px] text-destructive">
                ({t("purchaseInvoice.supplierForm.requiredNotice")})
              </span>
            )}
          </label>
          <Select value={supplierId} onValueChange={setSupplierId}>
            <SelectTrigger
              className={`h-10 text-xs bg-background border-border ${!supplierId ? "border-destructive/30" : ""}`}
            >
              <SelectValue
                placeholder={
                  isLoading
                    ? t("purchaseInvoice.supplierForm.loadingSuppliers")
                    : t(
                        "purchaseInvoice.supplierForm.selectSupplierPlaceholder",
                      )
                }
              />
            </SelectTrigger>
            <SelectContent className="bg-muted border border-border text-foreground z-50 shadow-lg max-h-60 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center p-3 text-xs text-muted-foreground gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  {t("purchaseInvoice.supplierForm.loading")}
                </div>
              ) : suppliers.length === 0 ? (
                <div className="p-3 text-xs text-muted-foreground text-center">
                  {t("purchaseInvoice.supplierForm.noSuppliers")}
                </div>
              ) : (
                suppliers.map((supplier: Supplier) => (
                  <SelectItem
                    key={supplier.id}
                    value={String(supplier.id)}
                    className="focus:bg-background focus:text-foreground text-xs cursor-pointer"
                  >
                    {supplier.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5 text-start">
          <label className="text-xs font-semibold text-muted-foreground">
            {t("purchaseInvoice.supplierForm.invoiceDateLabel")}
          </label>
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="h-10 pl-10 text-xs bg-background border-border"
            />
          </div>
        </div>

        <div className="space-y-1.5 text-start md:col-span-2">
          <label className="text-xs font-semibold text-muted-foreground">
            {t("purchaseInvoice.supplierForm.notesLabel")}
          </label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t("purchaseInvoice.supplierForm.notesPlaceholder")}
            className="bg-background border-border text-xs resize-none min-h-15"
          />
        </div>
      </CardContent>
    </Card>
  );
}
