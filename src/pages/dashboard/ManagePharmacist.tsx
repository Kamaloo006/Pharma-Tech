import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { usePharmacists } from "@/features/pharmacists/hooks/usePharmacists";
import {
  pharmacistSchema,
  type Pharmacist,
  type PharmacistPayload,
} from "@/features/pharmacists/types/Pharmacist";

import { PharmacistHeader } from "@/features/pharmacists/components/PharmacistHeader";
import { PharmacistsTable } from "@/features/pharmacists/components/PharmacistsTable";
import { PharmacistFormModal } from "@/features/pharmacists/components/PharmacistFormModal";
import { DeletePharmacistDialog } from "@/features/pharmacists/components/DeletePharmacistDialog";

export default function ManagePharmacist() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const {
    pharmacists,
    isLoading,
    addPharmacist,
    isAdding,
    updatePharmacist,
    isUpdating,
    deletePharmacist,
    isDeleting,
  } = usePharmacists();

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPharmacist, setEditingPharmacist] = useState<Pharmacist | null>(
    null,
  );
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const form = useForm<PharmacistPayload>({
    resolver: zodResolver(pharmacistSchema),
    defaultValues: {
      first_name: "",
      father_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      password: "",
    },
  });

  const handleOpenAddModal = () => {
    setEditingPharmacist(null);
    form.reset({
      first_name: "",
      father_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      password: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (pharmacist: Pharmacist) => {
    setEditingPharmacist(pharmacist);
    form.reset({
      first_name: pharmacist.first_name,
      father_name: pharmacist.father_name || "",
      last_name: pharmacist.last_name,
      email: pharmacist.email,
      phone_number: pharmacist.phone_number || "",
      password: "",
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: PharmacistPayload) => {
    try {
      if (editingPharmacist?.id) {
        const res = await updatePharmacist({
          id: editingPharmacist.id,
          ...data,
        });
        toast.success(res.message || t("pharmacists.toast.updated"));
      } else {
        const res = await addPharmacist(data);
        toast.success(res.message || t("pharmacists.toast.created"));
      }
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || t("pharmacists.toast.error"),
      );
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await deletePharmacist(id);
      toast.success(res.message || t("pharmacists.toast.deleted"));
      setDeletingId(null);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || t("pharmacists.toast.delete_error"),
      );
    }
  };

  const filteredPharmacists = pharmacists.filter((p) => {
    const fullName =
      `${p.first_name} ${p.father_name || ""} ${p.last_name}`.toLowerCase();
    const query = searchTerm.toLowerCase();
    return (
      fullName.includes(query) ||
      p.email.toLowerCase().includes(query) ||
      (p.phone_number && p.phone_number.includes(query))
    );
  });

  const isSubmitting = isAdding || isUpdating;

  return (
    <div
      className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <PharmacistHeader onAddClick={handleOpenAddModal} />

      <PharmacistsTable
        pharmacists={filteredPharmacists}
        isLoading={isLoading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onEdit={handleOpenEditModal}
        onDelete={(id) => setDeletingId(id)}
      />

      <PharmacistFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        form={form}
        editingPharmacist={editingPharmacist}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />

      <DeletePharmacistDialog
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={() => deletingId && handleDelete(deletingId)}
        isDeleting={isDeleting}
      />
    </div>
  );
}
