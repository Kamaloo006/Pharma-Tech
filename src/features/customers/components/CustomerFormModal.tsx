import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Phone, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  customerSchema,
  type CustomerFormValues,
} from "@/features/customers/schemas/CustomerSchema";
import type { Customer } from "../types/Customer";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CustomerFormValues) => Promise<void> | void;
  customer?: Customer | null;
  isLoading?: boolean;
}

export function CustomerFormModal({
  isOpen,
  onClose,
  onSubmit,
  customer,
  isLoading = false,
}: Props) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const isEditMode = Boolean(customer);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      full_name: "",
      phone: "",
      notes: "",
    },
  });

  // إعادة تعبئة المودال عند التغيير بين حالة الإضافة والتعديل
  useEffect(() => {
    if (isOpen) {
      if (customer) {
        reset({
          full_name: customer.full_name || "",
          phone: customer.phone || "",
          notes: customer.notes || "",
        });
      } else {
        reset({
          full_name: "",
          phone: "",
          notes: "",
        });
      }
    }
  }, [customer, isOpen, reset]);

  const handleFormSubmit = async (data: CustomerFormValues) => {
    await onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        dir={isArabic ? "rtl" : "ltr"}
        className="sm:max-w-[425px] border-border/60"
      >
        <DialogHeader>
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            {isEditMode
              ? t("customers.modal.editTitle", "تعديل بيانات الزبون")
              : t("customers.modal.addTitle", "إضافة زبون جديد")}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isEditMode
              ? t(
                  "customers.modal.editSubtitle",
                  "قم بتعديل بيانات الزبون المحددة أدناه.",
                )
              : t(
                  "customers.modal.addSubtitle",
                  "أدخل بيانات الزبون الجديد لطرائقه في النظام.",
                )}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-4 py-2"
        >
          {/* Full Name Field */}
          <div className="space-y-1.5">
            <Label htmlFor="full_name" className="text-xs font-semibold">
              {t("customers.modal.fullName", "الاسم الكامل")}{" "}
              <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground rtl:right-3 rtl:left-auto" />
              <Input
                id="full_name"
                {...register("full_name")}
                placeholder={t(
                  "customers.modal.fullNamePlaceholder",
                  "مثال: أحمد علي",
                )}
                className="pl-9 rtl:pr-9 rtl:pl-3 h-9 text-xs bg-card"
              />
            </div>
            {errors.full_name && (
              <p className="text-[11px] text-destructive mt-0.5">
                {errors.full_name.message}
              </p>
            )}
          </div>

          {/* Phone Field */}
          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-xs font-semibold">
              {t("customers.modal.phone", "رقم الهاتف")}
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground rtl:right-3 rtl:left-auto" />
              <Input
                id="phone"
                type="tel"
                {...register("phone")}
                placeholder={t(
                  "customers.modal.phonePlaceholder",
                  "مثال: 0935123456",
                )}
                className="pl-9 rtl:pr-9 rtl:pl-3 h-9 text-xs font-mono bg-card"
              />
            </div>
            {errors.phone && (
              <p className="text-[11px] text-destructive mt-0.5">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Notes Field */}
          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-xs font-semibold">
              {t("customers.modal.notes", "ملاحظات")}
            </Label>
            <Textarea
              id="notes"
              rows={3}
              {...register("notes")}
              placeholder={t(
                "customers.modal.notesPlaceholder",
                "أي ملاحظات إضافية...",
              )}
              className="text-xs bg-card resize-none"
            />
            {errors.notes && (
              <p className="text-[11px] text-destructive mt-0.5">
                {errors.notes.message}
              </p>
            )}
          </div>

          <DialogFooter className="pt-2 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
              className="h-8 text-xs"
            >
              {t("common.cancel", "إلغاء")}
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isLoading}
              className="h-8 text-xs gap-1.5"
            >
              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {isEditMode
                ? t("common.saveChanges", "حفظ التعديلات")
                : t("customers.modal.create", "إضافة الزبون")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
