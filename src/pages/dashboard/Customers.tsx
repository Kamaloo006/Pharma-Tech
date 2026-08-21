import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { useCustomers } from "@/features/customers/hooks/useCustomers";
import { useCustomerMutations } from "@/features/customers/hooks/useCustomerMutations";
import { CustomerFormModal } from "@/features/customers/components/CustomerFormModal";
import { type CustomerFormValues } from "@/features/customers/schemas/CustomerSchema";
import { type Customer } from "@/features/customers/types/Customer";

import { CustomerPageHeader } from "@/features/customers/components/CustomerPageHeader";
import { CustomerSearch } from "@/features/customers/components/CustomerSearch";
import { CustomerTable } from "@/features/customers/components/CustomerTable";
import { CustomerConfirmDialog } from "@/features/customers/components/CustomerConfirmDialog";

export default function CustomersPage() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [showDeleted] = useState(false);
  const perPage = 15;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: "delete" | "restore";
    customer: Customer | null;
  }>({
    isOpen: false,
    type: "delete",
    customer: null,
  });

  // إعادة ضبط الصفحة للأولى فقط عند تغير البحث بالفعل (بعد الـ Debounce)
  useEffect(() => {
    setPage(1);
  }, [searchTerm, showDeleted]);

  const { data, isLoading, isFetching, isError, refetch } = useCustomers({
    page,
    per_page: perPage,
    search: searchTerm,
    trashed: showDeleted,
  });

  const { createCustomer, updateCustomer, deleteCustomer, restoreCustomer } =
    useCustomerMutations();

  // 👈 1. تثبيت مرجع المصفوفة للجدول
  const customers = useMemo(() => data?.data || [], [data?.data]);
  const meta = data?.meta;

  // 👈 2. تثبيت مرجع دوال التعامل لمنع Re-render الجدول
  const handleOpenAddModal = useCallback(() => {
    setSelectedCustomer(null);
    setIsModalOpen(true);
  }, []);

  const handleOpenEditModal = useCallback((customer: Customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  }, []);

  const handleConfirmActionTrigger = useCallback(
    (type: "delete" | "restore", customer: Customer) => {
      setConfirmDialog({ isOpen: true, type, customer });
    },
    [],
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleCloseConfirmDialog = useCallback(() => {
    setConfirmDialog({ isOpen: false, type: "delete", customer: null });
  }, []);

  const handleFormSubmit = async (formData: CustomerFormValues) => {
    try {
      if (selectedCustomer) {
        await updateCustomer.mutateAsync({
          id: selectedCustomer.id,
          data: formData,
        });
      } else {
        await createCustomer.mutateAsync(formData);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const handleConfirmAction = async () => {
    if (!confirmDialog.customer) return;

    try {
      if (confirmDialog.type === "delete") {
        await deleteCustomer.mutateAsync(confirmDialog.customer.id);
      } else {
        await restoreCustomer.mutateAsync(confirmDialog.customer.id);
      }
    } catch (error) {
      console.error("Action error:", error);
    } finally {
      setConfirmDialog({ isOpen: false, type: "delete", customer: null });
    }
  };

  const isSubmitting = createCustomer.isPending || updateCustomer.isPending;
  const isActionLoading = deleteCustomer.isPending || restoreCustomer.isPending;

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="space-y-6 max-w-8xl px-6 mx-auto"
    >
      <CustomerPageHeader
        showDeleted={showDeleted}
        onOpenAddModal={handleOpenAddModal}
      />

      {/* 👈 أصبح يتلقى التحديث فقط عندما يكتمل البحث */}
      <CustomerSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <CustomerTable
        customers={customers}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        showDeleted={showDeleted}
        page={page}
        meta={meta}
        onRefetch={refetch}
        onEdit={handleOpenEditModal}
        onConfirmAction={handleConfirmActionTrigger}
        onPageChange={setPage}
      />

      <CustomerFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        customer={selectedCustomer}
        isLoading={isSubmitting}
      />

      <CustomerConfirmDialog
        isOpen={confirmDialog.isOpen}
        type={confirmDialog.type}
        customer={confirmDialog.customer}
        isLoading={isActionLoading}
        onClose={handleCloseConfirmDialog}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
}
