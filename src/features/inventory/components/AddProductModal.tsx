// AddProductModal.tsx
import { Loader2 } from "lucide-react";
import { useAddProductModal } from "../hooks/useAddProductModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Array<{ id: number; name: string }>;
  t: (key: string) => string;
  isArabic: boolean;
  productToEdit?: any;
}

export default function AddProductModal({
  isOpen,
  onClose,
  categories,
  t,
  isArabic,
  productToEdit,
}: AddProductModalProps) {
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isEditMode,
    isPending,
    isLoadingDetails,
  } = useAddProductModal({ isOpen, onClose, productToEdit });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <DialogHeader className={cn(isArabic && "text-right space-y-1")}>
          <DialogTitle className="text-base font-bold text-foreground">
            {isEditMode
              ? t("inventory.edit_modal.title")
              : t("inventory.add_modal.title")}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            {isEditMode
              ? t("inventory.edit_modal.description")
              : t("inventory.add_modal.description")}
          </DialogDescription>
        </DialogHeader>

        {isLoadingDetails ? (
          <div className="flex h-40 items-center justify-center p-6 text-muted-foreground">
            <Loader2 className="size-6 animate-spin text-primary mr-2" />
            <span className="text-xs">
              {isArabic
                ? "جاري جلب تفاصيل المنتج..."
                : "Loading product details..."}
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            {/* الاسم التجاري (EN) والاسم التجاري (AR) */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  {t("inventory.fields.brand_name")} *
                </label>
                <Input
                  type="text"
                  {...register("brand_name")}
                  className={cn(
                    "h-9 rounded-xl text-xs",
                    errors.brand_name &&
                      "border-rose-500 focus-visible:ring-rose-500",
                  )}
                />
                {errors.brand_name && (
                  <p className="text-[10px] text-rose-500 font-medium">
                    {isArabic ? "هذا الحقل مطلوب" : errors.brand_name.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  {t("inventory.fields.ar_name")}
                </label>
                <Input
                  type="text"
                  {...register("ar_name")}
                  className="h-9 rounded-xl text-xs"
                />
              </div>
            </div>

            {/* الاسم العلمي والباركود */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  {t("inventory.fields.scientific_name")}
                </label>
                <Input
                  type="text"
                  {...register("scientific_name")}
                  className="h-9 rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  {t("inventory.fields.barcode")} *
                </label>
                <Input
                  type="text"
                  {...register("barcode")}
                  className={cn(
                    "h-9 rounded-xl text-xs font-mono",
                    errors.barcode &&
                      "border-rose-500 focus-visible:ring-rose-500",
                  )}
                />
                {errors.barcode && (
                  <p className="text-[10px] text-rose-500 font-medium">
                    {isArabic ? "هذا الحقل مطلوب" : errors.barcode.message}
                  </p>
                )}
              </div>
            </div>

            {/* الفئات والأسعار */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  {t("inventory.fields.category")} *
                </label>
                <select
                  {...register("category_id")}
                  className={cn(
                    "flex h-9 w-full rounded-xl border border-input bg-background px-3 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none appearance-none",
                    errors.category_id && "border-rose-500 focus:ring-rose-500",
                  )}
                >
                  <option value="">
                    {t("inventory.fields.select_category")}
                  </option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  {t("inventory.fields.buying_price")} *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  {...register("buying_price", { valueAsNumber: true })}
                  className={cn(
                    "h-9 rounded-xl text-xs",
                    errors.buying_price && "border-rose-500",
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  {t("inventory.fields.selling_price")} *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  {...register("selling_price", { valueAsNumber: true })}
                  className={cn(
                    "h-9 rounded-xl text-xs",
                    errors.selling_price && "border-rose-500",
                  )}
                />
              </div>
            </div>

            {/* الحد الأدنى، الضرائب، الخصومات، والوحدات */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  {t("inventory.fields.min_stock")}
                </label>
                <Input
                  type="number"
                  {...register("min_stock", { valueAsNumber: true })}
                  className="h-9 rounded-xl text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  {t("inventory.fields.tax_rate")}
                </label>
                <Input
                  type="number"
                  step="0.01"
                  {...register("tax_rate", { valueAsNumber: true })}
                  className="h-9 rounded-xl text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  {t("inventory.fields.discount_rate")}
                </label>
                <Input
                  type="number"
                  step="0.01"
                  {...register("discount_rate", { valueAsNumber: true })}
                  className="h-9 rounded-xl text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  {t("inventory.fields.units_per_base")}
                </label>
                <Input
                  type="number"
                  {...register("units_per_base", { valueAsNumber: true })}
                  className="h-9 rounded-xl text-xs"
                />
              </div>
            </div>

            {/* الوحدات الأساسية والمجزأة */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  {t("inventory.fields.base_unit")}
                </label>
                <Input
                  type="text"
                  {...register("base_unit")}
                  className="h-9 rounded-xl text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  {t("inventory.fields.selling_unit")}
                </label>
                <Input
                  type="text"
                  {...register("selling_unit")}
                  className="h-9 rounded-xl text-xs"
                />
              </div>
            </div>

            {/* Checkboxes الخيارات المنطقية */}
            <div className="flex flex-col gap-3 pt-2 border-t border-border/40 sm:flex-row sm:items-center sm:gap-6">
              <label className="flex items-center gap-2 text-xs text-foreground font-medium cursor-pointer">
                <input
                  type="checkbox"
                  {...register("prescription_required")}
                  className="size-4 rounded accent-primary"
                />
                <span>{t("inventory.fields.prescription")}</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-foreground font-medium cursor-pointer">
                <input
                  type="checkbox"
                  {...register("allow_partial_selling")}
                  className="size-4 rounded accent-primary"
                />
                <span>{t("inventory.fields.partial_selling")}</span>
              </label>
            </div>

            {/* التحكم السفلي */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-border/60">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
                className="h-9 rounded-xl text-xs font-semibold"
              >
                {t("inventory.add_modal.canceling")}
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="flex h-9 items-center gap-2 rounded-xl text-xs font-semibold shadow-md"
              >
                {isPending && <Loader2 className="size-3.5 animate-spin" />}
                {isPending
                  ? t("inventory.add_modal.saving")
                  : isEditMode
                    ? t("inventory.edit_modal.submit_btn")
                    : t("inventory.add_modal.submit")}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
