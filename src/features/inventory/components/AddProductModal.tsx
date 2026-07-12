import { Loader2, Sparkles } from "lucide-react";
import { useAddProductModal } from "../hooks/useAddProductModal";
import { useUnits } from "../hooks/useUnits";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { Company } from "../hooks/useCompanies";
import { Controller } from "react-hook-form";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Array<{ id: number; name: string }>;
  t: (key: string) => string;
  isArabic: boolean;
  productToEdit?: any;
  companies: Company[];
}

export default function AddProductModal({
  isOpen,
  onClose,
  categories,
  companies,
  t,
  isArabic,
  productToEdit,
}: AddProductModalProps) {
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    barcodeError,
    generateRandomBarcode,
    isEditMode,
    isPending,
    isLoadingDetails,
    selectedBaseUnit,
    filteredSubUnits,
    control,
  } = useAddProductModal({ isOpen, onClose, productToEdit });

  const { data: unitsData } = useUnits();

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
          <div className="flex gap-2 h-40 items-center justify-center p-6 text-muted-foreground">
            <Loader2 className="size-6 animate-spin text-primary mr-2 order-2" />
            <span className="text-xs">
              {isArabic
                ? "جاري جلب تفاصيل المنتج..."
                : "Loading product details..."}
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider">
                {isArabic ? "معلومات عامة" : "General Information"}
              </h3>
              <Separator />
              <Card className="border-border/60 bg-muted/10 shadow-none">
                <CardContent className="p-4 space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground">
                        {t("inventory.fields.brand_name")} *
                      </Label>
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
                          {errors.brand_name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground">
                        {t("inventory.fields.ar_name")}
                      </Label>
                      <Input
                        type="text"
                        {...register("ar_name")}
                        className="h-9 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground">
                        {t("inventory.fields.scientific_name")}
                      </Label>
                      <Input
                        type="text"
                        {...register("scientific_name")}
                        className="h-9 rounded-xl text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground">
                        {isArabic ? "القوة / العيار (Strength)" : "Strength"}
                      </Label>
                      <Input
                        type="text"
                        placeholder="e.g. 500mg"
                        {...register("strength")}
                        className="h-9 rounded-xl text-xs"
                      />
                      {errors.strength && (
                        <p className="text-[10px] text-rose-500 font-medium">
                          {errors.strength.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground">
                      {t("inventory.fields.barcode")} *
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        {...register("barcode")}
                        className={cn(
                          "h-9 rounded-xl text-xs font-mono flex-1",
                          (errors.barcode || barcodeError) &&
                            "border-rose-500 focus-visible:ring-rose-500",
                        )}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={generateRandomBarcode}
                        className="h-9 text-xs rounded-xl flex items-center gap-1 px-3"
                      >
                        <Sparkles className="size-3.5 text-primary" />
                        {isArabic ? "توليد" : "Generate"}
                      </Button>
                    </div>
                    {errors.barcode && (
                      <p className="text-[10px] text-rose-500 font-medium">
                        {errors.barcode.message}
                      </p>
                    )}
                    {barcodeError && (
                      <p className="text-[10px] text-amber-500 font-semibold">
                        {barcodeError}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider">
                {isArabic ? "التصنيف" : "Classification"}
              </h3>
              <Separator />
              <Card className="border-border/60 bg-muted/10 shadow-none">
                <CardContent className="p-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground">
                      {t("inventory.company")}
                    </Label>
                    <select
                      {...register("company_id")}
                      className="flex h-9 w-full rounded-xl border border-input bg-background px-3 py-1 text-xs shadow-sm focus:outline-none appearance-none cursor-pointer"
                    >
                      <option value="">{t("inventory.select_company")}</option>
                      {(companies || []).map((company) => (
                        <option key={company.id} value={company.id}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground">
                      {t("inventory.fields.category")} *
                    </Label>
                    <select
                      {...register("category_id")}
                      className={cn(
                        "flex h-9 w-full rounded-xl border border-input bg-background px-3 py-1 text-xs shadow-sm focus:outline-none appearance-none cursor-pointer",
                        errors.category_id && "border-rose-500",
                      )}
                    >
                      <option value="">
                        {t("inventory.fields.select_category")}
                      </option>
                      {(categories || []).map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    {errors.category_id && (
                      <p className="text-[10px] text-rose-500 font-medium">
                        {errors.category_id.message}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 🟦 Section 3: Pricing */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider">
                {isArabic ? "التسعير" : "Pricing"}
              </h3>
              <Separator />
              <Card className="border-border/60 bg-muted/10 shadow-none">
                <CardContent className="p-4 space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground">
                        {t("inventory.fields.buying_price")} *
                      </Label>
                      <Input
                        type="number"
                        step="0.01"
                        {...register("buying_price")}
                        className={cn(
                          "h-9 rounded-xl text-xs",
                          errors.buying_price && "border-rose-500",
                        )}
                      />
                      {errors.buying_price && (
                        <p className="text-[10px] text-rose-500 font-medium">
                          {errors.buying_price.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground">
                        {t("inventory.fields.selling_price")} *
                      </Label>
                      <Input
                        type="number"
                        step="0.01"
                        {...register("selling_price")}
                        className={cn(
                          "h-9 rounded-xl text-xs",
                          errors.selling_price && "border-rose-500",
                        )}
                      />
                      {errors.selling_price && (
                        <p className="text-[10px] text-rose-500 font-medium">
                          {errors.selling_price.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground">
                        {t("inventory.fields.tax_rate")} (%)
                      </Label>
                      <Input
                        type="number"
                        step="0.01"
                        {...register("tax_rate")}
                        className="h-9 rounded-xl text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground">
                        {t("inventory.fields.discount_rate")} (%)
                      </Label>
                      <Input
                        type="number"
                        step="0.01"
                        {...register("discount_rate")}
                        className="h-9 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 🟦 Section 4: Inventory */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider">
                {isArabic ? "المخزون والوحدات" : "Inventory"}
              </h3>
              <Separator />
              <Card className="border-border/60 bg-muted/10 shadow-none">
                <CardContent className="p-4 space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground">
                        {t("inventory.fields.min_stock")}
                      </Label>
                      <Input
                        type="number"
                        {...register("min_stock")}
                        className="h-9 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground">
                        {t("inventory.fields.base_unit")}
                      </Label>
                      <select
                        {...register("base_unit_id")}
                        className="flex h-9 w-full rounded-xl border border-input bg-background px-3 py-1 text-xs shadow-sm focus:outline-none appearance-none cursor-pointer"
                      >
                        <option value="">
                          {isArabic
                            ? "اختر الوحدة الأساسية"
                            : "Select base unit"}
                        </option>
                        {unitsData?.packagingUnits.map((u) => (
                          <option key={u.id} value={String(u.id)}>
                            {u.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground">
                        {t("inventory.fields.selling_unit")}
                      </Label>
                      <select
                        {...register("selling_unit_id")}
                        disabled={!selectedBaseUnit && !isEditMode}
                        className="flex h-9 w-full rounded-xl border border-input bg-background px-3 py-1 text-xs shadow-sm focus:outline-none appearance-none disabled:opacity-60 cursor-pointer"
                      >
                        <option value="">
                          {!selectedBaseUnit && !isEditMode
                            ? isArabic
                              ? "يرجى اختيار الوحدة الأساسية أولاً"
                              : "Please select base unit first"
                            : isArabic
                              ? "اختر الوحدة الداخلية المتوافقة"
                              : "Select compatible sub-unit"}
                        </option>
                        {filteredSubUnits.map((u) => (
                          <option key={u.id} value={String(u.id)}>
                            {u.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* ثانياً: وضع Units Per Base في سطر كامل جديد ومستقل تحت حقول الوحدات مباشرة */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground">
                      {t("inventory.fields.units_per_base")}
                    </Label>
                    <Input
                      type="number"
                      {...register("units_per_base")}
                      className="h-9 rounded-xl text-xs"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 🟦 Section 5: Options */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider">
                {isArabic ? "الخيارات الإضافية" : "Options"}
              </h3>
              <Separator />
              <Card className="border-border/60 bg-muted/10 shadow-none">
                <CardContent className="p-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
                  {/* حقل الروشتة الطبية (Prescription) المضاف حسب الهيكلية الجديدة */}
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Controller
                      control={control}
                      name="prescription_required"
                      render={({ field }) => (
                        <Checkbox
                          id="prescription_required"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    <Label
                      htmlFor="prescription_required"
                      className="text-xs font-medium cursor-pointer"
                    >
                      {isArabic
                        ? "يتطلب وصفة طبية (Prescription Required)"
                        : "Prescription Required"}
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Controller
                      control={control}
                      name="allow_partial_selling"
                      render={({ field }) => (
                        <Checkbox
                          id="allow_partial_selling"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    <Label
                      htmlFor="allow_partial_selling"
                      className="text-xs font-medium cursor-pointer"
                    >
                      {t("inventory.fields.partial_selling")}
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* الأزرار السفلية والتحكم */}
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
                disabled={isPending || !!barcodeError}
                className="flex h-9 items-center gap-2 rounded-xl text-xs font-semibold shadow-md px-5"
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
