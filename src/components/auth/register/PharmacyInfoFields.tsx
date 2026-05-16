import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type UseFormReturn } from "react-hook-form";
import { type RegisterInput } from "@/types/authValidation";
import { useTranslation } from "react-i18next";
import { Building2, MapPin, Hash, GraduationCap, Loader2 } from "lucide-react";
import clsx from "clsx";
import { useGetCities } from "@/hooks/useGetCities";

interface Props {
  form: UseFormReturn<RegisterInput>;
}

export function PharmacyInfoFields({ form }: Props) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const directionClass = isArabic ? "text-right" : "text-left";
  const tKey = (k: string) => `pharmacistSignup.${k}`;

  // Fetch cities using TanStack Query with caching
  const {
    data: cities = [],
    isLoading: isLoadingCities,
    isError: citiesError,
  } = useGetCities();

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      {/* Pharmacy Name */}
      <FormField
        control={form.control}
        name="pharmacy_name"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel className={clsx("text-md font-medium", directionClass)}>
              {t(tKey("pharmacyNameLabel"))}
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Building2
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
                  placeholder={t(tKey("pharmacyPlaceholder"))}
                />
              </div>
            </FormControl>
            <FormMessage className={directionClass} />
          </FormItem>
        )}
      />

      {/* Licence Number */}
      <FormField
        control={form.control}
        name="licence_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={clsx("text-md font-medium", directionClass)}>
              {t(tKey("licenceLabel"))}
            </FormLabel>
            <FormControl>
              <div className="relative">
                <GraduationCap
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
                  placeholder={t(tKey("licencePlaceholder"))}
                />
              </div>
            </FormControl>
            <FormMessage className={directionClass} />
          </FormItem>
        )}
      />

      {/* City (Select) */}
      <FormField
        control={form.control}
        name="city_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={clsx("text-md font-medium", directionClass)}>
              {t(tKey("cityLabel"))}
            </FormLabel>
            <FormControl>
              <div className="relative">
                {isLoadingCities && (
                  <Loader2
                    className={clsx(
                      "absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground animate-spin",
                      isArabic ? "right-3" : "left-3",
                    )}
                  />
                )}
                {!isLoadingCities && (
                  <MapPin
                    className={clsx(
                      "absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground",
                      isArabic ? "right-3" : "left-3",
                    )}
                  />
                )}
                <select
                  {...field}
                  disabled={isLoadingCities}
                  className={clsx(
                    "flex h-12 w-full rounded-2xl border border-input bg-input px-10 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary appearance-none disabled:opacity-50",
                    isArabic ? "pr-10" : "pl-10",
                  )}
                >
                  <option value="">
                    {isLoadingCities
                      ? t("pharmacistSignup.loadingCities")
                      : citiesError
                        ? t("pharmacistSignup.failedLoadCities")
                        : t(tKey("selectCity"))}
                  </option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
            </FormControl>
            <FormMessage className={directionClass} />
          </FormItem>
        )}
      />

      {/* Address Details */}
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={clsx("text-md font-medium", directionClass)}>
              {t(tKey("addressLabel"))}
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Hash
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
                  placeholder={t(tKey("addressPlaceholder"))}
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
