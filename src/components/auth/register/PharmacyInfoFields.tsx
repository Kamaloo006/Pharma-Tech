import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type UseFormReturn } from "react-hook-form";
import { useState } from "react";
import { type RegisterInput } from "@/types/authValidation";
import { useTranslation } from "react-i18next";
import { Building2, MapPin, Hash, GraduationCap } from "lucide-react";
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

  const { data: governorates = [] } = useGetCities();

  const [selectedGovernorate, setSelectedGovernorate] = useState<
    string | number
  >("");

  const availableCities = selectedGovernorate
    ? governorates.find((g) => String(g.id) === String(selectedGovernorate))
        ?.cities || []
    : [];

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pharmacy Name */}
        <FormField
          control={form.control}
          name="pharmacy_name"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel
                className={clsx("text-md font-medium", directionClass)}
              >
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
              <FormLabel
                className={clsx("text-md font-medium", directionClass)}
              >
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
      </div>

      {/* Location: Governorate -> City */}
      <div className="p-3 rounded-2xl border border-input bg-transparent">
        <FormField
          control={form.control}
          name="city_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                className={clsx("text-md font-medium", directionClass)}
              >
                {t(tKey("cityLabel"))}
              </FormLabel>

              <FormControl>
                <div className="relative">
                  <MapPin
                    className={clsx(
                      "absolute top-3.5 size-4 left-0 text-muted-foreground",
                      isArabic ? "right-3" : "left-3",
                    )}
                  />

                  {/* Governorate select - not registered on the form, used to filter cities */}
                  <select
                    value={selectedGovernorate}
                    onChange={(e) => {
                      setSelectedGovernorate(e.target.value);
                      form.setValue("city_id", "");
                    }}
                    className={clsx(
                      "flex h-12 w-full  rounded-2xl border border-input bg-input px-10 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary appearance-none disabled:opacity-50 mb-2",
                      isArabic ? "pr-10" : "pl-10",
                    )}
                  >
                    <option value="">{t(tKey("selectGovernorate"))}</option>
                    {governorates.map((gov) => (
                      <option key={gov.id} value={gov.id}>
                        {gov.name}
                      </option>
                    ))}
                  </select>

                  {/* City select - registered on the form and depends on selected governorate */}
                  <select
                    {...field}
                    disabled={!selectedGovernorate}
                    className={clsx(
                      "flex h-12 w-full rounded-2xl border border-input bg-input px-10 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary appearance-none disabled:opacity-50",
                      isArabic ? "pr-10" : "pl-10",
                    )}
                  >
                    <option value="">
                      {selectedGovernorate
                        ? t(tKey("selectCity"))
                        : t(tKey("selectGovernorateFirst"))}
                    </option>
                    {availableCities.map((city) => (
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
      </div>

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
