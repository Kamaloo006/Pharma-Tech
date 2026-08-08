import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";

import { usePurchaseInvoices } from "@/features/purchase-invoice/hooks/usePurchaseInvoices";
import { type InvoiceFilters } from "@/features/purchase-invoice/types/purchase-invoice";
import { useSuppliers } from "@/features/suppliers/hooks/useSuppliers";

import { InvoiceHeader } from "@/features/purchase-invoice/components/InvoiceHeader";
import { InvoiceFiltersForm } from "@/features/purchase-invoice/components/InvoiceFiltersForm";
import { InvoicesTable } from "@/features/purchase-invoice/components/InvoicesTable";

interface ExtendedInvoiceFilters extends InvoiceFilters {
  search?: string;
}

export default function PurchaseInvoiceList() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmittingFilters, setIsSubmittingFilters] = useState(false);

  const { suppliers = [], isLoading: isLoadingSuppliers } = useSuppliers();

  const { control, handleSubmit, reset, watch, setValue } =
    useForm<ExtendedInvoiceFilters>({
      defaultValues: {
        search: "",
        supplier_id: "all",
        status: "all",
        payment_status: "all",
        from_date: "",
        to_date: "",
      },
    });

  const fromDateValue = watch("from_date");
  const searchTerm = watch("search") || "";

  const [activeFilters, setActiveFilters] = useState<ExtendedInvoiceFilters>({
    search: "",
    supplier_id: "",
    status: "",
    payment_status: "",
    from_date: "",
    to_date: "",
  });

  const { data, isLoading, isFetching, isError, refetch } = usePurchaseInvoices(
    currentPage,
    activeFilters,
  );

  const invoices = data?.data || [];

  // إجبار إعادة جلب البيانات فور الدخول إلى الصفحة
  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (!isFetching) {
      setIsSubmittingFilters(false);
    }
  }, [isFetching]);

  const handleSearchChange = (value: string) => {
    setValue("search", value, { shouldValidate: true, shouldDirty: true });
  };

  const onSubmit = (formData: ExtendedInvoiceFilters) => {
    setIsSubmittingFilters(true);

    const cleanedFilters: ExtendedInvoiceFilters = {
      search: formData.search?.trim() || "",
      supplier_id: formData.supplier_id === "all" ? "" : formData.supplier_id,
      status: formData.status === "all" ? "" : formData.status,
      payment_status:
        formData.payment_status === "all" ? "" : formData.payment_status,
      from_date: formData.from_date || "",
      to_date: formData.to_date || "",
    };

    setActiveFilters(cleanedFilters);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    reset({
      search: "",
      supplier_id: "all",
      status: "all",
      payment_status: "all",
      from_date: "",
      to_date: "",
    });
    setIsSubmittingFilters(false);
    setActiveFilters({
      search: "",
      supplier_id: "",
      status: "",
      payment_status: "",
      from_date: "",
      to_date: "",
    });
    setCurrentPage(1);
  };

  const formatCurrency = (amount: number) => `${amount.toLocaleString()} ل.س`;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      isArabic ? "ar-EG" : "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      },
    );
  };

  const hasActiveFilters = Object.values(activeFilters).some(
    (value) => value !== "",
  );

  const watchedFields = watch();
  const isFiltersChanged =
    JSON.stringify(watchedFields) !== JSON.stringify(activeFilters);
  const showFilterLoading = isFetching && isSubmittingFilters;

  return (
    <div className="space-y-6 p-6" dir={isArabic ? "rtl" : "ltr"}>
      <InvoiceHeader isArabic={isArabic} />

      <Card className="border border-border bg-card shadow-sm rounded-2xl overflow-hidden relative">
        {showFilterLoading && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary animate-pulse z-10" />
        )}

        <InvoiceFiltersForm
          control={control}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          searchTerm={searchTerm}
          setSearchTerm={handleSearchChange}
          hasActiveFilters={hasActiveFilters}
          handleResetFilters={handleResetFilters}
          isFiltersChanged={isFiltersChanged}
          showFilterLoading={showFilterLoading}
          isLoadingSuppliers={isLoadingSuppliers}
          suppliers={suppliers}
          isArabic={isArabic}
          fromDateValue={fromDateValue}
        />

        <CardContent className="p-0">
          <InvoicesTable
            isLoading={isLoading}
            isError={isError}
            invoices={invoices}
            showFilterLoading={showFilterLoading}
            refetch={refetch}
            isArabic={isArabic}
            formatDate={formatDate}
            formatCurrency={formatCurrency}
          />
        </CardContent>
      </Card>
    </div>
  );
}
