import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AdjustStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  isArabic: boolean;
}

export default function AdjustStockModal({
  isOpen,
  onClose,
  isArabic,
}: AdjustStockModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="sm:max-w-md bg-background border border-border rounded-2xl p-6 p-y-4 shadow-2xl gap-y-4"
        dir={isArabic ? "rtl" : "ltr"}
      >
        {/* رأس المودال / Header */}
        <DialogHeader className="border-b border-border pb-3 flex justify-center">
          <DialogTitle className="text-sm font-bold text-foreground text-end ">
            {isArabic
              ? "تسوية مخزنية يدوية (Inventory Adjustment)"
              : "Manual Inventory Adjustment"}
          </DialogTitle>
        </DialogHeader>

        {/* جسم المودال والمدخلات / Form Content */}
        <div className="space-y-4 text-xs">
          {/* نوع الحركة التسوية */}
          <div className="space-y-1.5 text-start">
            <label className="text-muted-foreground font-medium">
              {isArabic ? "نوع الحركة التسوية" : "Adjustment Type"}
            </label>
            <Select defaultValue="adjustment_in">
              <SelectTrigger className="w-full bg-muted border-border rounded-xl h-10 text-xs focus:ring-1 focus:ring-emerald-500">
                <SelectValue
                  placeholder={isArabic ? "اختر النوع" : "Select type"}
                />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem
                  value="adjustment_in"
                  className="text-xs focus:bg-muted cursor-pointer"
                >
                  {isArabic ? "إدخال كمية زيادة (+)" : "Adjustment In (+)"}
                </SelectItem>
                <SelectItem
                  value="adjustment_out"
                  className="text-xs focus:bg-muted cursor-pointer"
                >
                  {isArabic ? "إخراج كمية عجز (-)" : "Adjustment Out (-)"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* الكمية المستهدفة */}
          <div className="space-y-1.5 text-start">
            <label className="text-muted-foreground font-medium">
              {isArabic ? "الكمية المستهدفة" : "Quantity"}
            </label>
            <Input
              type="number"
              placeholder="e.g. 50"
              className="w-full bg-muted border-border rounded-xl h-10 font-mono text-xs focus-visible:ring-1 focus-visible:ring-emerald-500"
            />
          </div>

          {/* رقم التشغيلة المعنية */}
          <div className="space-y-1.5 text-start">
            <label className="text-muted-foreground font-medium">
              {isArabic ? "رقم الباتش المعني" : "Target Batch Number"}
            </label>
            <Input
              type="text"
              placeholder="BCH-2026-0001"
              className="w-full bg-muted border-border rounded-xl h-10 font-mono text-xs focus-visible:ring-1 focus-visible:ring-emerald-500"
            />
          </div>

          {/* سبب التسوية */}
          <div className="space-y-1.5 text-start">
            <label className="text-muted-foreground font-medium">
              {isArabic ? "سبب التسوية" : "Reason / Note"}
            </label>
            <Textarea
              rows={3}
              placeholder={
                isArabic
                  ? "يرجى ذكر سبب جرد الفروقات يدوياً..."
                  : "Describe the reason..."
              }
              className="w-full bg-muted border-border rounded-xl resize-none text-xs focus-visible:ring-1 focus-visible:ring-emerald-500"
            />
          </div>
        </div>

        {/* أزرار التحكم / Footer */}
        <DialogFooter className="flex items-center sm:justify-end gap-2 pt-3 border-t border-border mt-1">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-xl border-border hover:bg-muted text-muted-foreground text-xs font-medium px-4 h-9"
          >
            {isArabic ? "إلغاء" : "Cancel"}
          </Button>
          <Button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold text-xs px-4 h-9 shadow-md"
          >
            {isArabic ? "ترحيل التسوية" : "Post Adjustment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
