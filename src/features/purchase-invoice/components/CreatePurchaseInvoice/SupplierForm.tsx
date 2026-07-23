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

interface SupplierFormProps {
  isArabic: boolean;
  supplierId: string;
  setSupplierId: (id: string) => void;
  invoiceDate: string;
  setInvoiceDate: (date: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
}

export function SupplierForm({
  isArabic,
  supplierId,
  setSupplierId,
  invoiceDate,
  setInvoiceDate,
  notes,
  setNotes,
}: SupplierFormProps) {
  const { suppliers, isLoading } = useSuppliers();

  return (
    <Card className="border-border bg-card shadow-sm rounded-2xl">
      <CardHeader className="pb-3 border-b border-border/40">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <Info className="h-4 w-4 text-primary" />
          {isArabic ? "معلومات المورد الأساسية" : "Supplier Information"}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5 text-start">
          <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            {isArabic ? "المورد *" : "Supplier *"}
            {!supplierId && (
              <span className="text-[9px] text-destructive">
                ({isArabic ? "مطلوب لحفظ الفاتورة" : "Required"})
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
                    ? isArabic
                      ? "جاري تحميل الموردين..."
                      : "Loading suppliers..."
                    : isArabic
                      ? "اختر مورد الفاتورة"
                      : "Select Supplier"
                }
              />
            </SelectTrigger>
            <SelectContent className="bg-muted border border-border text-foreground z-50 shadow-lg max-h-60 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center p-3 text-xs text-muted-foreground gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  {isArabic ? "جاري التحميل..." : "Loading..."}
                </div>
              ) : suppliers.length === 0 ? (
                <div className="p-3 text-xs text-muted-foreground text-center">
                  {isArabic ? "لا يوجد موردين متاحيين" : "No suppliers found"}
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
            {isArabic ? "تاريخ الفاتورة" : "Invoice Date"}
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
            {isArabic ? "ملاحظات الفاتورة" : "Invoice Notes"}
          </label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={
              isArabic
                ? "أكتب أي ملاحظات متعلقة بالشحن، الدفع، أو تسلم المنتجات..."
                : "Enter any shipping, payment notes..."
            }
            className="bg-background border-border text-xs resize-none min-h-15"
          />
        </div>
      </CardContent>
    </Card>
  );
}
