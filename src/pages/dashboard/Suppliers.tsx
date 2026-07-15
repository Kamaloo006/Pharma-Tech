import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useSuppliers } from "@/features/suppliers/hooks/useSuppliers";
import { type Supplier } from "../../features/suppliers/types/Supplier";
import { SupplierFormModal } from "@/features/suppliers/components/SupplierFormModal";
import SuppliersTable from "@/features/suppliers/components/SuppliersTable";
import { Loader2, Plus, Users } from "lucide-react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export default function SuppliersPage() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const {
    suppliers,
    meta,
    setPage,
    isLoading,
    createSupplier,
    isCreating,
    updateSupplier,
    isUpdating,
    deleteSupplier,
    isDeleting,
    restoreSupplier,
  } = useSuppliers();

  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!selectedSupplier) return;
    try {
      await deleteSupplier(selectedSupplier.id);
      toast.success(t("suppliers.messages.deleteSuccess"));
      setIsDeleteOpen(false);
    } catch (err) {
      toast.error(t("suppliers.messages.deleteError"));
    }
  };

  const handleRestoreClick = async (id: number) => {
    try {
      await restoreSupplier(id);
      toast.success(t("suppliers.messages.restoreSuccess"));
    } catch (err) {
      toast.error(t("suppliers.messages.restoreError"));
    }
  };

  const handleFormSubmit = async (formData: any) => {
    if (selectedSupplier) {
      await updateSupplier({ id: selectedSupplier.id, data: formData });
    } else {
      await createSupplier(formData);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" dir={isArabic ? "rtl" : "ltr"}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold  text-foreground flex gap-2 items-center">
          {t("suppliers.title")}
          <Users className=" text-primary " />
        </h1>
        <Button
          onClick={() => {
            setSelectedSupplier(null);
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>{t("suppliers.buttons.addSupplier")}</span>
        </Button>
      </div>

      <SuppliersTable
        suppliers={suppliers}
        isArabic={isArabic}
        meta={meta}
        onPageChange={(pageNum) => setPage(pageNum)}
        onDelete={(id) => {
          const supplier = suppliers.find((s: Supplier) => s.id === id);
          if (supplier) {
            setSelectedSupplier(supplier);
            setIsDeleteOpen(true);
          }
        }}
        onRestore={(id) => handleRestoreClick(id)}
        onEdit={(supplier) => {
          setSelectedSupplier(supplier);
          setIsFormOpen(true);
        }}
      />

      <SupplierFormModal
        supplier={selectedSupplier}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedSupplier(null);
        }}
        onSubmitAction={handleFormSubmit}
        isLoading={isCreating || isUpdating}
      />

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className={isArabic ? "text-right" : "text-left"}>
              {t("suppliers.dialogs.deleteTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription
              className={isArabic ? "text-right" : "text-left"}
            >
              {t("suppliers.dialogs.deleteDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter
            className={`gap-2 ${isArabic ? "flex-row-reverse justify-start" : ""}`}
          >
            <AlertDialogCancel disabled={isDeleting}>
              {t("common.buttons.cancel")}
            </AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              <span>{t("common.buttons.confirmDelete")}</span>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
