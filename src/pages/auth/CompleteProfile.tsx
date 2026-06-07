import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { ShieldCheck, Stethoscope } from "lucide-react";
import { useTranslation } from "react-i18next";

import AuthCard from "@/components/auth/AuthCard";
import AuthForm from "@/components/auth/AuthForm";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import AuthHeader from "@/components/auth/AuthHeader";
import { useAuth } from "@/context/AuthContext";
import { useGetCities } from "@/hooks/useGetCities";
import { useCompleteProfile } from "@/hooks/useCompleteProfile";

const CompleteProfile = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { data: governorates = [] } = useGetCities();
  const { form, onSubmit, isPending } = useCompleteProfile();
  const [selectedGovernorate, setSelectedGovernorate] = useState("");
  const isArabic = i18n.language === "ar";

  useEffect(() => {
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language, isArabic]);

  useEffect(() => {
    if (!user) {
      return;
    }

    form.reset({
      first_name: user.first_name ?? "",
      last_name: user.last_name ?? "",
      phone_number: user.phone_number ?? "",
      licence_number: "",
      pharmacy_name: "",
      city_id: "",
      address: "",
    });
  }, [form, user]);

  const availableCities = useMemo(() => {
    if (!selectedGovernorate) {
      return [];
    }

    return (
      governorates.find((gov) => String(gov.id) === selectedGovernorate)
        ?.cities ?? []
    );
  }, [governorates, selectedGovernorate]);

  return (
    <main className="min-h-screen bg-background text-foreground transition-all duration-300">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <AuthHeader />

        <section className="flex flex-1 items-center justify-center py-8">
          <div className="w-full max-w-3xl">
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
                <Stethoscope className="size-7" />
              </div>
              <h2 className="mt-4 text-3xl font-semibold text-foreground">
                {t("common.appName")}
              </h2>
            </div>

            <AuthCard
              titleKey="completeProfile.cardTitle"
              descriptionKey="completeProfile.cardDescription"
              roleTagKey="completeProfile.roleTag"
              className="mx-auto"
            >
              <div className="mb-4 flex items-center gap-2 rounded-2xl border border-border bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
                <ShieldCheck className="size-4 text-primary" />
                <span>{t("completeProfile.badge")}</span>
              </div>

              <Form {...form}>
                <AuthForm
                  onSubmit={onSubmit}
                  isSubmitting={isPending}
                  submitLabelKey="completeProfile.submit"
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            {t("completeProfile.firstNameLabel")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="h-12 rounded-2xl bg-input"
                              placeholder={t(
                                "completeProfile.firstNamePlaceholder",
                              )}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            {t("completeProfile.lastNameLabel")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="h-12 rounded-2xl bg-input"
                              placeholder={t(
                                "completeProfile.lastNamePlaceholder",
                              )}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          {t("completeProfile.phoneLabel")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="h-12 rounded-2xl bg-input"
                            placeholder={t("completeProfile.phonePlaceholder")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="pharmacy_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            {t("completeProfile.pharmacyNameLabel")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="h-12 rounded-2xl bg-input"
                              placeholder={t(
                                "completeProfile.pharmacyNamePlaceholder",
                              )}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="licence_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            {t("completeProfile.licenceLabel")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="h-12 rounded-2xl bg-input"
                              placeholder={t(
                                "completeProfile.licencePlaceholder",
                              )}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="rounded-2xl border border-border bg-muted/20 p-4">
                    <FormField
                      control={form.control}
                      name="city_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            {t("completeProfile.cityLabel")}
                          </FormLabel>
                          <FormControl>
                            <div className="space-y-3">
                              <select
                                value={selectedGovernorate}
                                onChange={(event) => {
                                  setSelectedGovernorate(event.target.value);
                                  form.setValue("city_id", "");
                                }}
                                className={clsx(
                                  "flex h-12 w-full appearance-none rounded-2xl border border-input bg-background px-4 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50",
                                  isArabic ? "text-right" : "text-left",
                                )}
                              >
                                <option value="">
                                  {t("completeProfile.selectGovernorate")}
                                </option>
                                {governorates.map((gov) => (
                                  <option key={gov.id} value={gov.id}>
                                    {gov.name}
                                  </option>
                                ))}
                              </select>

                              <select
                                {...field}
                                disabled={!selectedGovernorate}
                                className={clsx(
                                  "flex h-12 w-full appearance-none rounded-2xl border border-input bg-background px-4 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50",
                                  isArabic ? "text-right" : "text-left",
                                )}
                              >
                                <option value="">
                                  {selectedGovernorate
                                    ? t("completeProfile.selectCity")
                                    : t(
                                        "completeProfile.selectGovernorateFirst",
                                      )}
                                </option>
                                {availableCities.map((city) => (
                                  <option key={city.id} value={city.id}>
                                    {city.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          {t("completeProfile.addressLabel")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="h-12 rounded-2xl bg-input"
                            placeholder={t(
                              "completeProfile.addressPlaceholder",
                            )}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </AuthForm>
              </Form>
            </AuthCard>
          </div>
        </section>
      </div>
    </main>
  );
};

export default CompleteProfile;
