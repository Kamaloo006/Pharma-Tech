import { useTranslation } from "react-i18next";
import { type UseFormReturn } from "react-hook-form";
import { Loader2, Mail, Phone, User as UserIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import type {
  Pharmacist,
  PharmacistPayload,
} from "@/features/pharmacists/types/Pharmacist";

interface PharmacistFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: UseFormReturn<PharmacistPayload>;
  editingPharmacist: Pharmacist | null;
  onSubmit: (data: PharmacistPayload) => void;
  isSubmitting: boolean;
}

export function PharmacistFormModal({
  isOpen,
  onClose,
  form,
  editingPharmacist,
  onSubmit,
  isSubmitting,
}: PharmacistFormModalProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-lg rounded-2xl p-6"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <UserIcon className="size-5 text-primary" />
            <span>
              {editingPharmacist
                ? t("pharmacists.modal.edit_title")
                : t("pharmacists.modal.add_title")}
            </span>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-2"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">
                      {t("pharmacists.form.first_name")}{" "}
                      <span className="text-rose-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t(
                          "pharmacists.form.first_name_placeholder",
                        )}
                        className="rounded-xl text-xs h-9"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="father_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">
                      {t("pharmacists.form.father_name")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t(
                          "pharmacists.form.father_name_placeholder",
                        )}
                        className="rounded-xl text-xs h-9"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">
                      {t("pharmacists.form.last_name")}{" "}
                      <span className="text-rose-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t(
                          "pharmacists.form.last_name_placeholder",
                        )}
                        className="rounded-xl text-xs h-9"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">
                      {t("pharmacists.form.email")}{" "}
                      <span className="text-rose-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto" />
                        <Input
                          type="email"
                          placeholder="pharmacist@example.com"
                          className="rtl:pr-9 ltr:pl-9 rounded-xl text-xs h-9"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">
                      {t("pharmacists.form.phone")}{" "}
                      <span className="text-rose-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto" />
                        <Input
                          placeholder="0940476813"
                          className="rtl:pr-9 ltr:pl-9 rounded-xl text-xs h-9 font-mono"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4 border-t border-border/40 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="rounded-xl text-xs h-9 px-4"
              >
                {t("pharmacists.modal.cancel")}
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl text-xs h-9 px-5 gap-2"
              >
                {isSubmitting && <Loader2 className="size-3.5 animate-spin" />}
                <span>
                  {editingPharmacist
                    ? t("pharmacists.modal.save_edit")
                    : t("pharmacists.modal.save_add")}
                </span>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
