import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type UseFormReturn } from "react-hook-form";
import { type RegisterInput } from "@/types/authValidation.ts";
import { useTranslation } from "react-i18next";
import { Mail, Lock, Phone } from "lucide-react";
import clsx from "clsx";

interface Props {
  form: UseFormReturn<RegisterInput>;
}

export function PersonalInfoFields({ form }: Props) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const directionClass = isArabic ? "text-right" : "text-left";
  const tKey = (k: string) => `pharmacistSignup.${k}`;

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      {/* Email Field */}
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel className={clsx("text-md font-medium", directionClass)}>
              {t(tKey("emailLabel"))}
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Mail
                  className={clsx(
                    "absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground",
                    isArabic ? "right-3" : "left-3",
                  )}
                />
                <Input
                  {...field}
                  className={clsx(
                    "h-12 rounded-2xl border-border bg-input ps-10",
                    isArabic ? "pr-10" : "pl-10",
                  )}
                  placeholder={t(tKey("emailPlaceholder"))}
                />
              </div>
            </FormControl>
            <FormMessage className={directionClass} />
          </FormItem>
        )}
      />

      {/* First & Last Name */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                className={clsx("text-md font-medium", directionClass)}
              >
                {t(tKey("firstNameLabel"))}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="h-12 rounded-2xl bg-input"
                  placeholder={t(tKey("firstNamePlaceholder"))}
                />
              </FormControl>
              <FormMessage className={directionClass} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                className={clsx("text-md font-medium", directionClass)}
              >
                {t(tKey("lastNameLabel"))}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="h-12 rounded-2xl bg-input"
                  placeholder={t(tKey("lastNamePlaceholder"))}
                />
              </FormControl>
              <FormMessage className={directionClass} />
            </FormItem>
          )}
        />
      </div>

      {/* Phone Number */}
      <FormField
        control={form.control}
        name="phone_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={clsx("text-md font-medium", directionClass)}>
              {t(tKey("phoneLabel"))}
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Phone
                  className={clsx(
                    "absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground",
                    isArabic ? "right-3" : "left-3",
                  )}
                />
                <Input
                  {...field}
                  className={clsx(
                    "h-12 rounded-2xl bg-input",
                    isArabic ? "pr-10" : "pl-10",
                  )}
                  placeholder="09xxxxxxxx"
                />
              </div>
            </FormControl>
            <FormMessage className={directionClass} />
          </FormItem>
        )}
      />

      {/* Password */}
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={clsx("text-md font-medium", directionClass)}>
              {t(tKey("passwordLabel"))}
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Lock
                  className={clsx(
                    "absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground",
                    isArabic ? "right-3" : "left-3",
                  )}
                />
                <Input
                  {...field}
                  type="password"
                  className={clsx(
                    "h-12 rounded-2xl bg-input",
                    isArabic ? "pr-10" : "pl-10",
                  )}
                  placeholder={t(tKey("passwordPlaceholder"))}
                />
              </div>
            </FormControl>
            <FormMessage className={directionClass} />
          </FormItem>
        )}
      />

      {/* Confirm Password */}
      <FormField
        control={form.control}
        name="password_confirmation"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={clsx("text-md font-medium", directionClass)}>
              {t(tKey("confirmPasswordLabel"))}
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Lock
                  className={clsx(
                    "absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground",
                    isArabic ? "right-3" : "left-3",
                  )}
                />
                <Input
                  {...field}
                  type="password"
                  className={clsx(
                    "h-12 rounded-2xl bg-input",
                    isArabic ? "pr-10" : "pl-10",
                  )}
                  placeholder={t(tKey("confirmPasswordPlaceholder"))}
                />
              </div>
            </FormControl>
            <FormMessage className={directionClass} />
          </FormItem>
        )}
      />
    </div>
  );
}
