import { Search, Plus, Loader2, AlertTriangle, Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInventoryController } from "@/features/inventory/hooks/useInventoryContoller";
import AddProductModal from "@/features/inventory/components/AddProductModal";
import InventoryTable from "@/features/inventory/components/InventoryTable";
import { useState } from "react";
import type { Product } from "@/features/inventory/types/Product";
import { useDeleteProduct } from "@/features/inventory/hooks/UseProducts";
import { toast } from "sonner";
import { Controller } from "react-hook-form";
import WeatherPredictModal from "@/features/inventory/components/WeatherPredictModal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Inventory() {
  const {
    t,
    isArabic,
    register,
    control,
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
  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState(false);

  const { mutate: deleteProduct } = useDeleteProduct();

  const handleOpenAddModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

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
          {isArabic ? "جاري جلب بيانات المستودع..." : "Fetching inventory"}
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
          <button
            onClick={() => setIsWeatherModalOpen(true)}
            className="flex h-9 items-center justify-center gap-1.5 rounded-xl bg-violet-600 cursor-pointer px-4 text-xs font-medium hover:bg-violet-700 hover:shadow-2xl transition-all text-white shadow-md"
          >
            {t("inventory.drug_suggestion")}
            <Brain className="w-5" />
          </button>
        </div>
      </div>

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
            <div className="w-full sm:w-40">
              <Controller
                name="category_id"
                control={control}
                defaultValue="all"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(val) => {
                      field.onChange(val);
                      handleFilterFocus();
                    }}
                  >
                    <SelectTrigger className="h-9 rounded-xl border-border/80 bg-background/50 text-xs">
                      <SelectValue
                        placeholder={t("inventory.all_categories")}
                      />
                    </SelectTrigger>
                    <SelectContent
                      className="bg-muted"
                      dir={isArabic ? "rtl" : "ltr"}
                    >
                      <SelectItem className="hover:bg-primary/70" value="all">
                        {t("inventory.all_categories")}
                      </SelectItem>
                      {categories.map((category) => (
                        <SelectItem
                          className="hover:bg-primary/70"
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="w-full sm:w-40">
              <Controller
                name="company_id"
                control={control}
                defaultValue="all"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(val) => {
                      field.onChange(val);
                      handleFilterFocus();
                    }}
                  >
                    <SelectTrigger className="h-9 rounded-xl border-border/80 bg-background/50 text-xs">
                      <SelectValue placeholder={t("inventory.all_companies")} />
                    </SelectTrigger>
                    <SelectContent
                      className="bg-muted"
                      dir={isArabic ? "rtl" : "ltr"}
                    >
                      <SelectItem className="hover:bg-primary/70" value="all">
                        {t("inventory.all_companies")}
                      </SelectItem>
                      {companies.map((company) => (
                        <SelectItem
                          className="hover:bg-primary/70"
                          key={company.id}
                          value={company.id.toString()}
                        >
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="col-span-2 sm:col-span-1 w-full sm:w-35">
              <Controller
                name="stock_status"
                control={control}
                defaultValue="all"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(val) => {
                      field.onChange(val);
                      handleFilterFocus();
                    }}
                  >
                    <SelectTrigger className="h-9 rounded-xl border-border/80 bg-background/50 text-xs">
                      <SelectValue
                        placeholder={t("inventory.stock_status.all")}
                      />
                    </SelectTrigger>
                    <SelectContent
                      className="bg-muted"
                      dir={isArabic ? "rtl" : "ltr"}
                    >
                      <SelectItem className="hover:bg-primary/70" value="all">
                        {t("inventory.stock_status.all")}
                      </SelectItem>
                      <SelectItem
                        className="hover:bg-primary/70"
                        value="available"
                      >
                        {t("inventory.stock_status.available")}
                      </SelectItem>
                      <SelectItem className="hover:bg-primary/70" value="low">
                        {t("inventory.stock_status.low")}
                      </SelectItem>
                      <SelectItem className="hover:bg-primary/70" value="out">
                        {t("inventory.stock_status.out")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-9 w-full rounded-xl text-xs border-border/80"
                  >
                    {t("inventory.more_filters")}
                  </Button>
                </PopoverTrigger>

                <PopoverContent
                  align={isArabic ? "start" : "end"}
                  className="w-85 rounded-xl p-5 space-y-5 flex flex-col  bg-background"
                  dir={isArabic ? "rtl" : "ltr"}
                >
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

                  <div className="space-y-2 w-full">
                    <Label className="text-xs font-semibold">
                      {t("inventory.prescription")}
                    </Label>

                    <div className="w-full">
                      <Controller
                        name="prescription_required"
                        control={control}
                        defaultValue="all"
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="h-9 text-xs rounded-lg w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent
                              className="bg-muted"
                              dir={isArabic ? "rtl" : "ltr"}
                            >
                              <SelectItem
                                className="hover:bg-primary/70"
                                value="all"
                              >
                                {t("inventory.prescription_status.all")}
                              </SelectItem>
                              <SelectItem
                                className="hover:bg-primary/70"
                                value="true"
                              >
                                {t("inventory.prescription_status.required")}
                              </SelectItem>
                              <SelectItem
                                className="hover:bg-primary/70"
                                value="false"
                              >
                                {t(
                                  "inventory.prescription_status.not_required",
                                )}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>

                  {/* تاريخ الانتهاء */}
                  <div className="space-y-2 w-full">
                    <Label className="text-xs font-semibold">
                      {t("inventory.expiry_title")}
                    </Label>

                    <Controller
                      name="expiry_filter"
                      control={control}
                      defaultValue="all"
                      render={({ field }) => (
                        <Select
                          value={field.value || "all"}
                          onValueChange={(val) =>
                            field.onChange(val === "all" ? "" : val)
                          }
                        >
                          <SelectTrigger className="h-9 text-xs rounded-lg w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent
                            className="bg-muted"
                            dir={isArabic ? "rtl" : "ltr"}
                          >
                            <SelectItem
                              className="hover:bg-primary/70"
                              value="all"
                            >
                              {t("inventory.expiry_options.all")}
                            </SelectItem>
                            <SelectItem
                              className="hover:bg-primary/70"
                              value="expired"
                            >
                              {t("inventory.expiry_options.expired")}
                            </SelectItem>
                            <SelectItem
                              className="hover:bg-primary/70"
                              value="30days"
                            >
                              {t("inventory.expiry_options.days_30")}
                            </SelectItem>
                            <SelectItem
                              className="hover:bg-primary/70"
                              value="60days"
                            >
                              {t("inventory.expiry_options.days_60")}
                            </SelectItem>
                            <SelectItem
                              className="hover:bg-primary/70"
                              value="90days"
                            >
                              {t("inventory.expiry_options.days_90")}
                            </SelectItem>
                            <SelectItem
                              className="hover:bg-primary/70"
                              value="6months"
                            >
                              {t("inventory.expiry_options.months_6")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  {/* الكمية */}
                  <div className="space-y-2 w-full">
                    <Label className="text-xs font-semibold">
                      {t("inventory.quantity_title")}
                    </Label>

                    <Controller
                      name="stock_range"
                      control={control}
                      defaultValue="all"
                      render={({ field }) => (
                        <Select
                          value={field.value || "all"}
                          onValueChange={(val) =>
                            field.onChange(val === "all" ? "" : val)
                          }
                        >
                          <SelectTrigger className="h-9 text-xs rounded-lg w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent
                            className="bg-muted"
                            dir={isArabic ? "rtl" : "ltr"}
                          >
                            <SelectItem
                              className="hover:bg-primary/70"
                              value="all"
                            >
                              {t("inventory.quantity_options.all")}
                            </SelectItem>
                            <SelectItem
                              className="hover:bg-primary/70"
                              value="out"
                            >
                              {t("inventory.quantity_options.out")}
                            </SelectItem>
                            <SelectItem
                              className="hover:bg-primary/70"
                              value="very_low"
                            >
                              {t("inventory.quantity_options.very_low")}
                            </SelectItem>
                            <SelectItem
                              className="hover:bg-primary/70"
                              value="low"
                            >
                              {t("inventory.quantity_options.low")}
                            </SelectItem>
                            <SelectItem
                              className="hover:bg-primary/70"
                              value="medium"
                            >
                              {t("inventory.quantity_options.medium")}
                            </SelectItem>
                            <SelectItem
                              className="hover:bg-primary/70"
                              value="plenty"
                            >
                              {t("inventory.quantity_options.plenty")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  {/* الترتيب */}
                  <div className="space-y-2 w-full">
                    <Label className="text-xs font-semibold">
                      {t("inventory.sort_title")}
                    </Label>

                    <Controller
                      name="sort_by"
                      control={control}
                      defaultValue="default"
                      render={({ field }) => (
                        <Select
                          value={field.value || "default"}
                          onValueChange={(val) =>
                            field.onChange(val === "default" ? "" : val)
                          }
                        >
                          <SelectTrigger className="h-9 text-xs rounded-lg w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent
                            className="bg-muted"
                            dir={isArabic ? "rtl" : "ltr"}
                          >
                            <SelectItem
                              className="hover:bg-primary/70"
                              value="default"
                            >
                              {t("inventory.sort_options.default")}
                            </SelectItem>
                            <SelectItem
                              className="hover:bg-primary/70"
                              value="name_asc"
                            >
                              {t("inventory.sort_options.name_asc")}
                            </SelectItem>
                            <SelectItem
                              className="hover:bg-primary/70"
                              value="name_desc"
                            >
                              {t("inventory.sort_options.name_desc")}
                            </SelectItem>
                            <SelectItem
                              className="hover:bg-primary/70"
                              value="price_asc"
                            >
                              {t("inventory.sort_options.price_asc")}
                            </SelectItem>
                            <SelectItem
                              className="hover:bg-primary/70"
                              value="price_desc"
                            >
                              {t("inventory.sort_options.price_desc")}
                            </SelectItem>
                            <SelectItem
                              className="hover:bg-primary/70"
                              value="stock_desc"
                            >
                              {t("inventory.sort_options.stock_desc")}
                            </SelectItem>
                            <SelectItem
                              className="hover:bg-primary/70"
                              value="stock_asc"
                            >
                              {t("inventory.sort_options.stock_asc")}
                            </SelectItem>
                            <SelectItem
                              className="hover:bg-primary/70"
                              value="expiry_asc"
                            >
                              {t("inventory.sort_options.expiry_asc")}
                            </SelectItem>
                            <SelectItem
                              className="hover:bg-primary/70"
                              value="expiry_desc"
                            >
                              {t("inventory.sort_options.expiry_desc")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

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

      <WeatherPredictModal
        isOpen={isWeatherModalOpen}
        onClose={() => setIsWeatherModalOpen(false)}
        isArabic={isArabic}
      />
    </div>
  );
}
