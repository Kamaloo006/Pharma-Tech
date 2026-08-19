import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Receipt, Loader2 } from "lucide-react";

import { SupplierForm } from "@/features/purchase-invoice/components/CreatePurchaseInvoice/SupplierForm";
import { LiveAlerts } from "@/features/purchase-invoice/components/CreatePurchaseInvoice/LiveAlerts";
import { ProductSearchPOS } from "@/features/purchase-invoice/components/CreatePurchaseInvoice/ProductSearchPOS";
import { InvoiceItemsTable } from "@/features/purchase-invoice/components/CreatePurchaseInvoice/InvoiceItemsTable";
import { InvoiceSummaryCard } from "@/features/purchase-invoice/components/CreatePurchaseInvoice/InvoiceSummaryCard";
import { PaymentDetailsCard } from "@/features/purchase-invoice/components/CreatePurchaseInvoice/PaymentDetailsCard";

import { useCreatePurchaseInvoice } from "@/features/purchase-invoice/hooks/useCreatePurchaseInvoice";
import { useCheckDrugInteractions } from "@/hooks/useCheckDrugInteractions";
import DrugInteractionsModal from "@/components/Layout/DrugInteractionsModal";

export default function CreatePurchaseInvoice() {
  const {
    isArabic,
    supplierId,
    setSupplierId,
    invoiceDate,
    setInvoiceDate,
    notes,
    setNotes,
    searchQuery,
    setSearchQuery,
    items,
    filteredProducts,
    isSearchingProducts,
    isDebouncing,
    handleAddProduct,
    updateItemField,
    removeItem,
    cashBox,
    isCheckingCashBox,
    isCashBoxConfigured,
    totals,
    paymentMethod,
    setPaymentMethod,
    amountPaid,
    setAmountPaid,
    isAmountPaidExceeded,
    paymentStatus,
    duplicateBatchNumbers,
    hasDuplicateBatches,
    isSaving,
    isSaveDisabled,
    handleSaveInvoice,
    navigateToCashbox,
  } = useCreatePurchaseInvoice();

  const [isInteractionsModalOpen, setIsInteractionsModalOpen] = useState(false);
  const {
    mutate: checkInteractions,
    data: interactionsData,
    isPending: isCheckingInteractions,
    isError: isInteractionsError,
  } = useCheckDrugInteractions();

  const handleCheckInteractions = () => {
    if (items.length < 2) return;

    const productIds: number[] = items
      .map((item) => Number(item.product_id || item.product_id))
      .filter((id) => !isNaN(id) && id > 0);

    setIsInteractionsModalOpen(true);
    checkInteractions({ product_ids: productIds });
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-400 mx-auto text-start dir-rtl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/60 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-foreground flex items-center gap-2.5">
            {isArabic ? "إنشاء فاتورة مشتريات" : "Create Purchase Invoice"}
            <Receipt className="h-7 w-7 text-primary" />
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {isArabic
              ? "إضافة وشراء أدوية جديدة وإدخال التشغيلات والمبالغ المستحقة"
              : "Manage inventory stock-in, batches, and supplier balance."}
          </p>
        </div>

        {isSaving && (
          <div className="flex items-center gap-2 text-xs text-primary font-bold bg-primary/10 px-3 py-1.5 rounded-full">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>
              {isArabic ? "جاري حفظ الفاتورة..." : "Saving invoice..."}
            </span>
          </div>
        )}
      </div>

      {paymentMethod === "cash" && !isCheckingCashBox && !cashBox && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-600 dark:text-amber-400">
          <div className="flex items-center gap-2.5 text-sm font-semibold">
            <span>⚠️</span>
            <span>
              {isArabic
                ? "صندوق الكاش (Cash Box) غير معرّف لهذه الصيدلية."
                : "Cash Box is not configured."}
            </span>
          </div>

          <Button
            size="sm"
            onClick={navigateToCashbox}
            className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shrink-0"
          >
            {isArabic ? "إنشاء صندوق كاش" : "Create Cash Box"}
          </Button>
        </div>
      )}

      <LiveAlerts
        paymentMethod={paymentMethod}
        isCashBoxConfigured={isCashBoxConfigured}
        hasDuplicateBatches={hasDuplicateBatches}
        duplicateBatchNumbers={duplicateBatchNumbers}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SupplierForm
            supplierId={supplierId}
            setSupplierId={setSupplierId}
            invoiceDate={invoiceDate}
            setInvoiceDate={setInvoiceDate}
            notes={notes}
            setNotes={setNotes}
          />

          <Card className="border-border bg-card shadow-sm rounded-2xl">
            <CardHeader className="pb-3 border-b border-border/40 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                {isArabic ? "إدارة منتجات الفاتورة" : "Products & Items"}
              </CardTitle>

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-mono bg-muted px-2.5 py-1 rounded-full">
                  {items.length} {isArabic ? "منتجات" : "Items"}
                </span>
              </div>
            </CardHeader>

            <CardContent className="pt-5 space-y-5">
              <ProductSearchPOS
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filteredProducts={filteredProducts}
                onAddProduct={handleAddProduct}
                isLoading={isSearchingProducts}
                isDebouncing={isDebouncing}
              />

              <InvoiceItemsTable
                items={items}
                updateItemField={updateItemField}
                removeItem={removeItem}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <InvoiceSummaryCard totals={totals} />

          <PaymentDetailsCard
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            amountPaid={amountPaid}
            setAmountPaid={setAmountPaid}
            grandTotal={totals.grandTotal}
            isAmountPaidExceeded={isAmountPaidExceeded}
            paymentStatus={paymentStatus}
            isSaveDisabled={isSaveDisabled}
            onSaveInvoice={handleSaveInvoice}
          />
        </div>
      </div>

      <DrugInteractionsModal
        isOpen={isInteractionsModalOpen}
        onClose={() => setIsInteractionsModalOpen(false)}
        isArabic={isArabic}
        isLoading={isCheckingInteractions}
        data={interactionsData}
        isError={isInteractionsError}
        onRetry={handleCheckInteractions}
      />
    </div>
  );
}
