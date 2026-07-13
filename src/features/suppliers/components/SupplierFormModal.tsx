import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Supplier, SupplierFormData } from "../types/Supplier";
import { useCompanies } from "@/features/inventory/hooks/useCompanies";
import { Loader2 } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SupplierFormModalProps {
  supplier: Supplier | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitAction: (data: SupplierFormData) => Promise<any>;
  isLoading: boolean;
}

export function SupplierFormModal({
  supplier,
  isOpen,
  onClose,
  onSubmitAction,
  isLoading,
}: SupplierFormModalProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const { data: companies, isLoading: isLoadingCompanies } = useCompanies();

  const [formData, setFormData] = useState<SupplierFormData>({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
    company_id: null,
  });

  useEffect(() => {
    if (isOpen) {
      if (supplier) {
        setFormData({
          name: supplier.name,
          phone: supplier.phone,
          email: supplier.email,
          address: supplier.address ?? "",
          notes: supplier.notes ?? "",
          company_id: supplier.company_id ?? null,
        });
      } else {
        setFormData({
          name: "",
          phone: "",
          email: "",
          address: "",
          notes: "",
          company_id: null,
        });
      }
    }
  }, [supplier, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCompanyChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      company_id: value === "none" ? null : Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmitAction(formData);
      toast.success(
        supplier
          ? t("suppliers.notifications.updateSuccess")
          : t("suppliers.notifications.createSuccess"),
      );
      onClose();
    } catch (err) {
      toast.error(t("suppliers.notifications.errorOccurred"));
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && !isLoading && onClose()}
    >
      <DialogContent className="sm:max-w-106.25" dir={isArabic ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle className="text-left">
            {supplier
              ? t("suppliers.form.editTitle")
              : t("suppliers.form.addTitle")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-1">
            <Label htmlFor="name">{t("suppliers.form.labels.name")}</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-1">
            <Label>{t("suppliers.form.labels.company")}</Label>
            <Select
              disabled={isLoading || isLoadingCompanies}
              value={formData.company_id ? String(formData.company_id) : "none"}
              onValueChange={handleCompanyChange}
            >
              <SelectTrigger
                className={`w-full bg-background text-foreground border-border ${isArabic ? "text-right" : "text-left"}`}
              >
                <SelectValue
                  placeholder={
                    isLoadingCompanies
                      ? t("common.loading")
                      : t("suppliers.form.placeholders.selectCompany")
                  }
                />
              </SelectTrigger>

              <SelectContent className="bg-background text-foreground border-border">
                <SelectItem value="none">
                  {t("suppliers.form.placeholders.noCompany")}
                </SelectItem>
                {companies?.map((company) => (
                  <SelectItem key={company.id} value={String(company.id)}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="phone">{t("suppliers.form.labels.phone")}</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="email">{t("suppliers.form.labels.email")}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="address">
              {t("suppliers.form.labels.address")}
            </Label>
            <Input
              id="address"
              name="address"
              value={formData.address ?? ""}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="notes">{t("suppliers.form.labels.notes")}</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes ?? ""}
              onChange={handleChange}
              rows={3}
              disabled={isLoading}
            />
          </div>

          <DialogFooter
            className={`pt-4 gap-2 ${isArabic ? "flex-row-reverse justify-start" : ""}`}
          >
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && (
                <Loader2
                  className={`h-4 w-4 animate-spin ${isArabic ? "ml-2" : "mr-2"}`}
                />
              )}
              {supplier ? t("common.save") : t("common.add")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
