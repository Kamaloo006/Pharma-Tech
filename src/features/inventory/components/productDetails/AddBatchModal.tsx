interface AddBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  isArabic: boolean;
}

export default function AddBatchModal({
  isOpen,
  onClose,
  isArabic,
}: AddBatchModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/65 backdrop-blur-sm p-4">
      <div
        className="bg-card border border-border rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-xl"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <h3 className="text-sm font-bold border-b border-border pb-2">
          {isArabic ? "إضافة تشغيلة مخزنية جديدة" : "+ Add New Batch"}
        </h3>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <label className="text-muted-foreground">
              {isArabic ? "رقم الباتش" : "Batch Number"}
            </label>
            <input
              type="text"
              className="w-full bg-muted border border-border rounded-lg p-2 outline-none focus:border-muted-foreground/40"
            />
          </div>
          <div className="space-y-1">
            <label className="text-muted-foreground">
              {isArabic ? "الكمية المتاحة" : "Quantity"}
            </label>
            <input
              type="number"
              className="w-full bg-muted border border-border rounded-lg p-2 outline-none focus:border-muted-foreground/40"
            />
          </div>
          <div className="space-y-1">
            <label className="text-muted-foreground">
              {isArabic ? "سعر الشراء الكلي" : "Buying Price"}
            </label>
            <input
              type="number"
              className="w-full bg-muted border border-border rounded-lg p-2 outline-none focus:border-muted-foreground/40"
            />
          </div>
          <div className="space-y-1">
            <label className="text-muted-foreground">
              {isArabic ? "رقم الفاتورة" : "Invoice Number"}
            </label>
            <input
              type="text"
              className="w-full bg-muted border border-border rounded-lg p-2 outline-none focus:border-muted-foreground/40"
            />
          </div>
          <div className="space-y-1">
            <label className="text-muted-foreground">
              {isArabic ? "تاريخ التصنيع" : "Manufacturing Date"}
            </label>
            <input
              type="date"
              className="w-full bg-muted border border-border rounded-lg p-2 outline-none focus:border-muted-foreground/40"
            />
          </div>
          <div className="space-y-1">
            <label className="text-muted-foreground">
              {isArabic ? "تاريخ انتهاء الصلاحية" : "Expiry Date"}
            </label>
            <input
              type="date"
              className="w-full bg-muted border border-border rounded-lg p-2 outline-none focus:border-muted-foreground/40"
            />
          </div>
          <div className="col-span-2 space-y-1">
            <label className="text-muted-foreground">
              {isArabic ? "المورد" : "Supplier"}
            </label>
            <input
              type="text"
              className="w-full bg-muted border border-border rounded-lg p-2 outline-none focus:border-muted-foreground/40"
            />
          </div>
          <div className="col-span-2 space-y-1">
            <label className="text-muted-foreground">
              {isArabic ? "ملاحظات الشحنة" : "Notes"}
            </label>
            <textarea
              rows={2}
              className="w-full bg-muted border border-border rounded-lg p-2 resize-none outline-none focus:border-muted-foreground/40"
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-border hover:bg-muted text-muted-foreground"
          >
            {isArabic ? "إلغاء" : "Cancel"}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold rounded-xl"
          >
            {isArabic ? "حفظ التشغيلة" : "Save Batch"}
          </button>
        </div>
      </div>
    </div>
  );
}
