import { useState } from "react";
import { useTranslation } from "react-i18next";
import { type UseFormReturn } from "react-hook-form";
import {
  Loader2,
  Lock,
  Mail,
  Phone,
  User as UserIcon,
  EyeOff,
  Eye,
} from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);

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

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">
                    {t("pharmacists.form.password")}{" "}
                    {!editingPharmacist && (
                      <span className="text-rose-500">*</span>
                    )}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto pointer-events-none" />

                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={
                          editingPharmacist
                            ? t("pharmacists.form.password_edit_placeholder")
                            : "••••••••"
                        }
                        className="rtl:pr-9 rtl:pl-10 ltr:pl-9 ltr:pr-10 rounded-xl text-xs h-9"
                        {...field}
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors rtl:left-3 rtl:right-auto ltr:right-3 ltr:left-auto"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

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
