import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";

// Hooks & Types
import { useCustomers } from "@/features/customers/hooks/useCustomers";
import { useCreateSalesInvoice } from "@/features/sales-invoice/hooks/useCreateSalesInvoice";
import type { Customer } from "@/features/customers/types/Customer";

// Sub-components
import { InvoiceHeader } from "@/features/sales-invoice/components/InvoiceHeader";
import { CustomerSelectorCard } from "@/features/sales-invoice/components/CustomerSelectorCard";
import { ProductSearchPopover } from "@/features/sales-invoice/components/ProductSearchPopover";
import { SalesInvoiceItemsTable } from "@/features/sales-invoice/components/SalesInvoicesItemsTable";
import { PaymentSummaryCard } from "@/features/sales-invoice/components/SalesPaymentSummaryCard";

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

  const customersList: Customer[] = customersData?.data || [];
  const selectedCustomer =
    customersList.find((c) => String(c.id) === customerId) || null;

  return (
    <div className="p-6 space-y-6 text-start max-w-7xl mx-auto pb-20">
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
