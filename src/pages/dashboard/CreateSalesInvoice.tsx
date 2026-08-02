import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

// Hooks & Types
import { useCustomers } from "@/features/customers/hooks/useCustomers";
import { useCreateSalesInvoice } from "@/features/sales-invoice/hooks/useCreateSalesInvoice";
import type { Customer } from "@/features/customers/types/Customer";

// Sub-components
import { InvoiceHeader } from "@/features/sales-invoice/components/create-sales-invoice/InvoiceHeader";
import { CustomerSelectorCard } from "@/features/sales-invoice/components/create-sales-invoice/CustomerSelectorCard";
import { ProductSearchPopover } from "@/features/sales-invoice/components/create-sales-invoice/ProductSearchPopover";
import { SalesInvoiceItemsTable } from "@/features/sales-invoice/components/create-sales-invoice/SalesInvoicesItemsTable";
import { PaymentSummaryCard } from "@/features/sales-invoice/components/create-sales-invoice/SalesPaymentSummaryCard";

// Skeleton Loading Component
function CreateSalesInvoiceSkeleton() {
  return (
    <div className="px-6 space-y-4 max-w-8xl mx-auto pb-20 animate-pulse">
      {/* 1. Header Skeleton */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48 rounded-lg" />
          <Skeleton className="h-4 w-32 rounded-md" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-24 rounded-xl" />
          <Skeleton className="h-9 w-32 rounded-xl" />
        </div>
      </div>

      {/* Grid Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left / Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* 2. Customer Selector Skeleton */}
          <Card className="border-border/60 shadow-xs rounded-2xl overflow-hidden">
            <CardHeader className="bg-muted/20 border-b border-border/60 pb-3">
              <Skeleton className="h-4 w-32 rounded-md" />
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <Skeleton className="h-10 w-full rounded-xl" />
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-4 w-28 rounded-md" />
              </div>
            </CardContent>
          </Card>

          {/* 3. Products Section Skeleton */}
          <Card className="border-border/60 shadow-xs rounded-2xl overflow-hidden">
            <CardHeader className="bg-muted/20 border-b border-border/60 pb-3">
              <Skeleton className="h-4 w-36 rounded-md" />
            </CardHeader>

            <CardContent className="p-4 space-y-5">
              {/* Product Search Input Skeleton */}
              <Skeleton className="h-10 w-full rounded-xl" />

              {/* Items Table Skeleton */}
              <div className="border border-border/40 rounded-xl overflow-hidden">
                <div className="bg-muted/30 p-3 flex justify-between items-center border-b border-border/40">
                  <Skeleton className="h-4 w-24 rounded-md" />
                  <Skeleton className="h-4 w-12 rounded-md" />
                  <Skeleton className="h-4 w-16 rounded-md" />
                  <Skeleton className="h-4 w-20 rounded-md" />
                  <Skeleton className="h-4 w-8 rounded-md" />
                </div>
                <div className="p-3 space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center py-1"
                    >
                      <Skeleton className="h-4 w-32 rounded-md" />
                      <Skeleton className="h-8 w-16 rounded-lg" />
                      <Skeleton className="h-4 w-16 rounded-md" />
                      <Skeleton className="h-4 w-20 rounded-md" />
                      <Skeleton className="h-8 w-8 rounded-lg" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right / Sidebar Column */}
        <div className="space-y-6">
          {/* 4. Payment & Summary Skeleton */}
          <Card className="border-border/60 shadow-xs rounded-2xl overflow-hidden">
            <CardHeader className="bg-muted/20 border-b border-border/60 pb-3">
              <Skeleton className="h-4 w-40 rounded-md" />
            </CardHeader>

            <CardContent className="p-4 space-y-5">
              {/* Payment Method Selector */}
              <div className="space-y-2">
                <Skeleton className="h-3 w-24 rounded-md" />
                <div className="grid grid-cols-3 gap-2">
                  <Skeleton className="h-9 rounded-xl" />
                  <Skeleton className="h-9 rounded-xl" />
                  <Skeleton className="h-9 rounded-xl" />
                </div>
              </div>

              {/* Amount Inputs */}
              <div className="space-y-3 pt-2">
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-20 rounded-md" />
                  <Skeleton className="h-10 w-full rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-28 rounded-md" />
                  <Skeleton className="h-20 w-full rounded-xl" />
                </div>
              </div>

              {/* Totals Breakdown */}
              <div className="space-y-3 pt-4 border-t border-border/50">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16 rounded-md" />
                  <Skeleton className="h-4 w-20 rounded-md" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-12 rounded-md" />
                  <Skeleton className="h-4 w-16 rounded-md" />
                </div>
                <div className="flex justify-between pt-2 border-t border-border/40">
                  <Skeleton className="h-5 w-24 rounded-md" />
                  <Skeleton className="h-6 w-24 rounded-md" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function CreateSalesInvoicePage() {
  const {
    isArabic,
    customerId,
    setCustomerId,
    notes,
    setNotes,
    searchQuery,
    setSearchQuery,
    items,
    filteredProducts,
    isSearchingProducts,
    handleAddProduct,
    updateItemField,
    removeItem,
    totals,
    paymentMethod,
    setPaymentMethod,
    amountPaid,
    setAmountPaid,
    isSaving,
    isSaveDisabled,
    handleSaveInvoice,
  } = useCreateSalesInvoice();

  // Local state for UI popovers & search
  const [customerSearch, setCustomerSearch] = useState("");
  const [isCustomerPopoverOpen, setIsCustomerPopoverOpen] = useState(false);
  const [isProductSearchOpen, setIsProductSearchOpen] = useState(false);

  // Fetch Customers
  const { data: customersData, isLoading: isLoadingCustomers } = useCustomers({
    page: 1,
    per_page: 50,
    search: customerSearch,
    trashed: false,
  });

  // Display Skeleton while customers data is loading initially
  if (isLoadingCustomers) {
    return <CreateSalesInvoiceSkeleton />;
  }

  const customersList: Customer[] = customersData?.data || [];
  const selectedCustomer =
    customersList.find((c) => String(c.id) === customerId) || null;

  return (
    <div className="px-6 space-y-4 max-w-8xl mx-auto">
      {/* 1. Header */}
      <InvoiceHeader
        isArabic={isArabic}
        isSaving={isSaving}
        isSaveDisabled={isSaveDisabled}
        onSave={handleSaveInvoice}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left / Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* 2. Customer Selector */}
          <CustomerSelectorCard
            isArabic={isArabic}
            customerId={customerId}
            setCustomerId={setCustomerId}
            selectedCustomer={selectedCustomer}
            customersList={customersList}
            isLoadingCustomers={isLoadingCustomers}
            customerSearch={customerSearch}
            setCustomerSearch={setCustomerSearch}
            isOpen={isCustomerPopoverOpen}
            setIsOpen={setIsCustomerPopoverOpen}
          />

          {/* 3. Products Section */}
          <Card className="border-border/60 shadow-xs rounded-2xl overflow-hidden">
            <CardHeader className="bg-muted/20 border-b border-border/60 pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Search className="h-4 w-4 text-primary" />
                {isArabic ? "منتجات الفاتورة" : "Invoice Products"}
              </CardTitle>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              <ProductSearchPopover
                isArabic={isArabic}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                isOpen={isProductSearchOpen}
                setIsOpen={setIsProductSearchOpen}
                isSearchingProducts={isSearchingProducts}
                filteredProducts={filteredProducts}
                onAddProduct={handleAddProduct}
              />

              <SalesInvoiceItemsTable
                isArabic={isArabic}
                items={items}
                updateItemField={updateItemField}
                removeItem={removeItem}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right / Sidebar Column */}
        <div className="space-y-6">
          {/* 4. Payment & Summary */}
          <PaymentSummaryCard
            isArabic={isArabic}
            totals={totals}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            amountPaid={amountPaid}
            setAmountPaid={setAmountPaid}
            notes={notes}
            setNotes={setNotes}
          />
        </div>
      </div>
    </div>
  );
}
