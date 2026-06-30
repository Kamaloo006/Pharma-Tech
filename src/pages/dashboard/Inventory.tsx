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

export default function Inventory() {
  const {
    t,
    isArabic,
    register,
    categories,
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
              {meta?.total || 0} {t("inventory.registered_products")}
            </span>
            {isFetching && (
              <Loader2 className="size-3 animate-spin text-primary ml-1" />
            )}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button className="flex h-9 items-center justify-center gap-2 rounded-xl border border-border/80 bg-card px-4 text-xs font-medium hover:bg-muted shadow-sm">
            {t("inventory.export_report")}
          </button>
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
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-border/40">
          <label className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground">
            <input
              type="checkbox"
              {...register("with_trashed")}
              className="size-3.5 rounded border-border/80 accent-primary text-primary-foreground focus:ring-primary cursor-pointer"
            />
            <span>{t("inventory.include_deleted")}</span>
          </label>
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
        t={t}
        isArabic={isArabic}
        productToEdit={selectedProduct}
      />
    </div>
  );
}
