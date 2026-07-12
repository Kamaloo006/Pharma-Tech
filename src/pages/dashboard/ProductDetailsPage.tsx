import { useProductDetails } from "@/features/inventory/hooks/useProductDetails";
import ProductErrorState from "./ProductErrorState";
import ProductHeaderCardSkeleton from "@/features/inventory/components/productDetails/skeletons/ProductHeaderCardSkeleton";
import InventoryCardSkeleton from "@/features/inventory/components/productDetails/skeletons/InventoryCardSkeleton";
import TableCardSkeleton from "@/features/inventory/components/productDetails/skeletons/TableCardSkeleton";

import ProductHeader from "@/features/inventory/components/productDetails/ProductHeader";
import ProductInventoryCard from "@/features/inventory/components/productDetails/ProductInventoryCard";
import StockBatchesCard from "@/features/inventory/components/productDetails/StockBatchesCard";
import StockMovementsCard from "@/features/inventory/components/productDetails/StockMovementsCard";
import MedicalInformationCard from "@/features/inventory/components/productDetails/MedicalInformationCard";

import ProductSummaryCards from "@/features/inventory/components/productDetails/ProductSummaryCards";
import ProductInformationCard from "@/features/inventory/components/productDetails/ProductInformationCard";

import AddProductModal from "@/features/inventory/components/AddProductModal";

export default function ProductDetailsPage() {
  const {
    product,
    productLoading,
    productError,
    batches,
    batchesLoading,
    batchesError,
    refetchBatches,
    movements,
    movementsLoading,
    movementsError,
    refetchMovements,
    isArabic,
    isEditModalOpen,
    refetchProduct,
    setIsEditModalOpen,
    t = (key: string) => key,
  } = useProductDetails();

  if (productError) {
    return (
      <ProductErrorState
        status={productError?.response?.status}
        isArabic={isArabic}
        onRetry={() => window.location.reload()}
      />
    );
  }

  const totalQuantity = product?.total_quantity ?? 0;
  const minStock = product?.min_stock ?? 0;
  const isOut = totalQuantity === 0;
  const isLowStock = totalQuantity <= minStock;

  return (
    <div
      className="p-6 space-y-6 max-w-7xl mx-auto"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {productLoading ? (
        <ProductHeaderCardSkeleton />
      ) : product ? (
        <ProductHeader
          product={product}
          isArabic={isArabic}
          isOut={isOut}
          isLowStock={isLowStock}
          onEditClick={() => setIsEditModalOpen(true)}
        />
      ) : null}

      {productLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <InventoryCardSkeleton />
          <InventoryCardSkeleton />
          <InventoryCardSkeleton />
          <InventoryCardSkeleton />
        </div>
      ) : product ? (
        <ProductSummaryCards product={product} isArabic={isArabic} />
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6 lg:col-span-1">
          {productLoading ? (
            <InventoryCardSkeleton />
          ) : product ? (
            <ProductInventoryCard
              product={product}
              isArabic={isArabic}
              isOut={isOut}
              isLowStock={isLowStock}
            />
          ) : null}

          {productLoading ? (
            <InventoryCardSkeleton />
          ) : product ? (
            <MedicalInformationCard product={product} isArabic={isArabic} />
          ) : null}
        </div>

        <div className="space-y-6 lg:col-span-2">
          {productLoading ? (
            <TableCardSkeleton
              title={
                isArabic ? "المعلومات العامة للمنتج" : "GENERAL INFORMATION"
              }
            />
          ) : product ? (
            <ProductInformationCard product={product} isArabic={isArabic} />
          ) : null}

          {batchesLoading ? (
            <TableCardSkeleton
              title={isArabic ? "التشغيلات المتاحة" : "AVAILABLE BATCHES"}
            />
          ) : batchesError ? (
            <div className="p-6 text-center border rounded-2xl bg-destructive/5 border-destructive/10 text-xs text-muted-foreground">
              {isArabic
                ? "تعذر تحميل التشغيلات المخزنية."
                : "Couldn't load stock batches."}
              <button
                onClick={() => refetchBatches()}
                className="text-emerald-500 font-bold underline ms-2"
              >
                {isArabic ? "إعادة" : "Retry"}
              </button>
            </div>
          ) : (
            <StockBatchesCard
              batches={batches}
              baseUnitName={product?.base_unit?.name || ""}
              isArabic={isArabic}
            />
          )}

          {movementsLoading ? (
            <TableCardSkeleton
              title={isArabic ? "سجل الحركات" : "MOVEMENT LOG"}
            />
          ) : movementsError ? (
            <div className="p-6 text-center border rounded-2xl bg-destructive/5 border-destructive/10 text-xs text-muted-foreground">
              {isArabic
                ? "تعذر تحميل سجل حركات المخزن."
                : "Unable to load stock movement log."}
              <button
                onClick={() => refetchMovements()}
                className="text-emerald-500 font-bold underline ms-2"
              >
                {isArabic ? "إعادة" : "Retry"}
              </button>
            </div>
          ) : (
            <StockMovementsCard movements={movements} isArabic={isArabic} />
          )}
        </div>
      </div>

      {/* 🛠️ تضمين الـ Modal هنا وتمرير الـ Props المطلوبة له */}
      <AddProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        productToEdit={product}
        categories={product?.category ? [product?.category] : []}
        companies={product?.company ? [product?.company] : []}
        isArabic={isArabic}
        t={t}
        onSuccess={() => {
          refetchProduct(); // سيقوم بتحديث البيانات في الخلفية فوراً
          setIsEditModalOpen(false); // إغلاق المودال
        }}
      />
    </div>
  );
}
