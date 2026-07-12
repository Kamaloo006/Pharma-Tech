import {
  Search,
  ChevronDown,
  Plus,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useInventoryController } from "@/features/inventory/hooks/useInventoryContoller";
import AddProductModal from "@/features/inventory/components/AddProductModal";
import InventoryTable from "@/features/inventory/components/InventoryTable";
import { useState } from "react";
import type { Product } from "@/features/inventory/types/Product";
import { useDeleteProduct } from "@/features/inventory/hooks/UseProducts";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function Inventory() {
  const {
    t,
    isArabic,
    register,
    categories,
    companies,
    products,
    meta,
    currentPage,
    totalPages,
    isLoading,
    isFetching,
    isError,
    errorMessage,
    handleFilterFocus,
    handleNextPage,
    handlePreviousPage,
    resetMoreFilters,
    applyMoreFilters,
  } = useInventoryController();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { mutate: deleteProduct } = useDeleteProduct();

  // open modal for adding new product
  const handleOpenAddModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  // open modal for editing product
  const handleOpenEditModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // handle product deletion
  const handleDeleteProduct = (product: Product) => {
    deleteProduct(product.id, {
      onSuccess: () => {
        toast.success(t("inventory.delete_modal.success"));
      },
      onError: () => {
        toast.error(t("inventory.delete_modal.error"));
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-3 text-muted-foreground animate-pulse">
        <Loader2 className="size-7 animate-spin text-primary" />
        <span className="text-xs font-medium">
          {isArabic
            ? "جاري جلب بيانات المستودع الحية من السيرفر..."
            : "Fetching live inventory from server..."}
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-8 text-center text-rose-500 max-w-xl mx-auto mt-12">
        <AlertTriangle className="size-8 mx-auto mb-3 opacity-90" />
        <p className="font-semibold text-sm">
          {isArabic ? "خطأ في الاتصال بالسيرفر" : "Server Connection Error"}
        </p>
        <p className="text-xs opacity-80 mt-1.5 font-mono">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={isArabic ? "rtl" : "ltr"}>
      {/* الهيدر الرئيسي */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            {t("inventory.title")}
          </h2>
          <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
            <span className="inline-flex size-2 rounded-full bg-emerald-500" />
            <span>
              {meta?.total || 0} {t("inventory.products")}
            </span>
            {isFetching && (
              <Loader2 className="size-3 animate-spin text-primary ml-1" />
            )}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleOpenAddModal}
            className="flex h-9 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 text-xs font-medium text-primary-foreground shadow-md hover:opacity-90"
          >
            <Plus className="size-3.5" /> {t("inventory.add_product")}
          </button>
        </div>
      </div>

      {/* لوحة الفلاتر */}
      <div className="rounded-2xl border border-border/60 bg-card/30 p-3.5 space-y-3 shadow-inner">
        <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search
              className={cn(
                "absolute top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground",
                isArabic ? "right-3.5" : "left-3.5",
              )}
            />
            <input
              type="text"
              placeholder={t("inventory.search_placeholder")}
              {...register("search")}
              onFocus={handleFilterFocus}
              className={cn(
                "h-9 w-full rounded-xl border border-border/80 bg-background/50 text-xs shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all",
                isArabic ? "pr-9 pl-3.5" : "pl-9 pr-3.5",
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
            {/* فلتر الفئات */}
            <div className="relative">
              <select
                {...register("category_id")}
                onFocus={handleFilterFocus}
                className={cn(
                  "h-9 w-full appearance-none rounded-xl border border-border/80 bg-background/50 text-xs focus:outline-none min-w-40 capitalize cursor-pointer",
                  isArabic ? "pl-8 pr-3" : "pr-8 pl-3",
                )}
              >
                <option value="all">{t("inventory.all_categories")}</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id.toString()}>
                    {category.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                className={cn(
                  "absolute top-1/2 size-3 -translate-y-1/2 pointer-events-none text-muted-foreground/80",
                  isArabic ? "left-2.5" : "right-2.5",
                )}
              />
            </div>

            <div className="relative">
              <select
                {...register("company_id")}
                onFocus={handleFilterFocus}
                className={cn(
                  "h-9 w-full appearance-none rounded-xl border border-border/80 bg-background/50 text-xs focus:outline-none min-w-40 capitalize cursor-pointer",
                  isArabic ? "pl-8 pr-3" : "pr-8 pl-3",
                )}
              >
                <option value="all">{t("inventory.all_companies")}</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                className={cn(
                  "absolute top-1/2 size-3 -translate-y-1/2 pointer-events-none text-muted-foreground/80",
                  isArabic ? "left-2.5" : "right-2.5",
                )}
              />
            </div>

            {/* فلتر حالة المخزون */}
            <div className="relative col-span-2 sm:col-span-1">
              <select
                {...register("stock_status")}
                onFocus={handleFilterFocus}
                className={cn(
                  "h-9 w-full appearance-none rounded-xl border border-border/80 bg-background/50 text-xs focus:outline-none min-w-35 cursor-pointer",
                  isArabic ? "pl-8 pr-3" : "pr-8 pl-3",
                )}
              >
                <option value="all">{t("inventory.stock_status.all")}</option>
                <option value="available">
                  {t("inventory.stock_status.available")}
                </option>
                <option value="low">{t("inventory.stock_status.low")}</option>
                <option value="out">{t("inventory.stock_status.out")}</option>
              </select>
              <ChevronDown
                className={cn(
                  "absolute top-1/2 size-3 -translate-y-1/2 pointer-events-none text-muted-foreground/80",
                  isArabic ? "left-2.5" : "right-2.5",
                )}
              />
            </div>

            <div className="relative col-span-2 sm:col-span-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-9 rounded-xl text-xs border-border/80"
                  >
                    {t("inventory.more_filters")}
                  </Button>
                </PopoverTrigger>

                <PopoverContent
                  align={isArabic ? "start" : "end"}
                  className="w-85 rounded-xl p-5 space-y-5 bg-background"
                  dir={isArabic ? "rtl" : "ltr"}
                >
                  {/* نطاق السعر */}
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">
                      {t("inventory.price_range")}
                    </Label>

                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        placeholder={t("inventory.min_price")}
                        {...register("min_price")}
                        className="h-8 text-xs"
                      />

                      <Input
                        type="number"
                        placeholder={t("inventory.max_price")}
                        {...register("max_price")}
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>

                  {/* الوصفة الطبية */}
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">
                      {t("inventory.prescription")}
                    </Label>

                    <select
                      {...register("prescription_required")}
                      className="h-9 w-full rounded-lg border bg-background px-3 text-xs"
                    >
                      <option value="all">
                        {t("inventory.prescription_status.all")}
                      </option>
                      <option value="true">
                        {t("inventory.prescription_status.required")}
                      </option>
                      <option value="false">
                        {t("inventory.prescription_status.not_required")}
                      </option>
                    </select>
                  </div>

                  {/* الصلاحية */}
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">
                      {t("inventory.expiry_title")}
                    </Label>

                    <select
                      {...register("expiry_filter")}
                      className="h-9 w-full rounded-lg border bg-background px-3 text-xs"
                    >
                      <option value="">
                        {t("inventory.expiry_options.all")}
                      </option>
                      <option value="expired">
                        {t("inventory.expiry_options.expired")}
                      </option>
                      <option value="30days">
                        {t("inventory.expiry_options.days_30")}
                      </option>
                      <option value="60days">
                        {t("inventory.expiry_options.days_60")}
                      </option>
                      <option value="90days">
                        {t("inventory.expiry_options.days_90")}
                      </option>
                      <option value="6months">
                        {t("inventory.expiry_options.months_6")}
                      </option>
                    </select>
                  </div>

                  {/* الكمية */}
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">
                      {t("inventory.quantity_title")}
                    </Label>

                    <select
                      {...register("stock_range")}
                      className="h-9 w-full rounded-lg border bg-background px-3 text-xs"
                    >
                      <option value="">
                        {t("inventory.quantity_options.all")}
                      </option>
                      <option value="out">
                        {t("inventory.quantity_options.out")}
                      </option>
                      <option value="very_low">
                        {t("inventory.quantity_options.very_low")}
                      </option>
                      <option value="low">
                        {t("inventory.quantity_options.low")}
                      </option>
                      <option value="medium">
                        {t("inventory.quantity_options.medium")}
                      </option>
                      <option value="plenty">
                        {t("inventory.quantity_options.plenty")}
                      </option>
                    </select>
                  </div>

                  {/* الترتيب */}
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">
                      {t("inventory.sort_title")}
                    </Label>

                    <select
                      {...register("sort_by")}
                      className="h-9 w-full rounded-lg border bg-background px-3 text-xs"
                    >
                      <option value="">
                        {t("inventory.sort_options.default")}
                      </option>
                      <option value="name_asc">
                        {t("inventory.sort_options.name_asc")}
                      </option>
                      <option value="name_desc">
                        {t("inventory.sort_options.name_desc")}
                      </option>
                      <option value="price_asc">
                        {t("inventory.sort_options.price_asc")}
                      </option>
                      <option value="price_desc">
                        {t("inventory.sort_options.price_desc")}
                      </option>
                      <option value="stock_desc">
                        {t("inventory.sort_options.stock_desc")}
                      </option>
                      <option value="stock_asc">
                        {t("inventory.sort_options.stock_asc")}
                      </option>
                      <option value="expiry_asc">
                        {t("inventory.sort_options.expiry_asc")}
                      </option>
                      <option value="expiry_desc">
                        {t("inventory.sort_options.expiry_desc")}
                      </option>
                    </select>
                  </div>

                  {/* أزرار الحفظ والإلغاء */}
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      type="button"
                      onClick={resetMoreFilters}
                    >
                      {t("inventory.reset_filters")}
                    </Button>
                    <Button size="sm" type="button" onClick={applyMoreFilters}>
                      {t("inventory.apply_filters")}
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>

      {/* جدول المنتجات */}
      <InventoryTable
        products={products}
        meta={meta}
        totalPages={totalPages}
        currentPage={currentPage}
        isArabic={isArabic}
        t={t}
        handleNextPage={handleNextPage}
        handlePreviousPage={handlePreviousPage}
        onEdit={handleOpenEditModal}
        onDelete={handleDeleteProduct}
      />

      {/* الـ Modal المشترك */}
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={categories}
        companies={companies}
        t={t}
        isArabic={isArabic}
        productToEdit={selectedProduct}
        onSuccess={() => {}}
      />
    </div>
  );
}
