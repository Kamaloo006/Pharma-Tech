import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  MoonStar,
  ShieldCheck,
  Stethoscope,
  SunMedium,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import pharmaLogin from "../../assets/pharmaLogin.png";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import AuthForm from "@/components/auth/AuthForm";
import { useTheme } from "@/context/theme-provider";
import AuthCard from "@/components/auth/AuthCard";

import { toast } from "sonner";
import { useLogin } from "@/hooks/useLogin";

const PharmacistLogin = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [rememberMe, setRememberMe] = useState(false);

  const { form, onSubmit, isLoading: isLoggingIn } = useLogin();
  const location = useLocation();

  const emailFromState = (location.state as { email?: string })?.email || "";

  useEffect(() => {
    form.setValue("email", emailFromState);
    const emailFromUrl = searchParams.get("email");
    if (emailFromUrl) {
      form.setValue("email", emailFromUrl);
    }

    const status = searchParams.get("status");
    if (status === "success" || status === "already_verified") {
      toast.success(t("auth.emailVerifiedSuccessfully"), {
        description: t("auth.youCanLoginNow"),
        duration: 5000,
      });

      searchParams.delete("status");
      setSearchParams(searchParams, { replace: true });
    }
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language, searchParams, setSearchParams, t]);

  const isArabic = i18n.language === "ar";

  return (
    <main className="min-h-screen transition-all duration-300 bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        {/* Header - Language & Theme Toggle */}
        <header
          className={clsx("flex items-center gap-3 pb-4", {
            "justify-start": !isArabic,
            "justify-end": isArabic,
          })}
        >
          <div className="flex items-center gap-1 rounded-full border border-border bg-header-bg p-1 shadow-sm backdrop-blur transition-all duration-300">
            <Button
              type="button"
              size="sm"
              className={clsx(
                "h-8 rounded-full px-3 transition-all duration-300",
                {
                  "bg-primary/30 text-primary font-semibold hover:bg-primary/40":
                    i18n.language === "en",
                  "bg-transparent text-muted-foreground hover:bg-muted/50":
                    i18n.language !== "en",
                },
              )}
              onClick={() => i18n.changeLanguage("en")}
            >
              EN
            </Button>
            <Button
              type="button"
              size="sm"
              className={clsx(
                "h-8 rounded-full px-3 transition-all duration-300",
                {
                  "bg-primary/30 text-primary font-semibold hover:bg-primary/40":
                    i18n.language === "ar",
                  "bg-transparent text-muted-foreground hover:bg-muted/50":
                    i18n.language !== "ar",
                },
              )}
              onClick={() => i18n.changeLanguage("ar")}
            >
              AR
            </Button>
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-10 rounded-full border border-border bg-header-bg shadow-sm backdrop-blur transition-all duration-300"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <SunMedium className="size-4" />
            ) : (
              <MoonStar className="size-4" />
            )}
          </Button>
        </header>

        <section
          className={`grid flex-1 items-center gap-10 transition-all duration-300 bg ${
            isArabic
              ? "lg:grid-cols-[1.1fr_0.9fr]"
              : "lg:grid-cols-[0.9fr_1.1fr]"
          }`}
        >
          <div
            className={`relative overflow-hidden flex flex-col justify-center transition-all duration-300 bg-background-alpha min-h-full p-10 rounded-4xl ${
              isArabic
                ? "order-2 lg:order-1 lg:pr-8"
                : "order-1 lg:order-2 lg:pl-8"
            }`}
          >
            <div className="pointer-events-none absolute left-0 top-0 h-56 w-56 -translate-x-1/3 -translate-y-1/3 rounded-full bg-[radial-gradient(circle_at_top_left,rgba(5,150,105,0.24),transparent_68%)] blur-3xl dark:bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.22),transparent_68%)]" />

            {/* Badge */}
            <div
              className={clsx("flex", {
                "justify-end": !isArabic,
                "justify-start": isArabic,
              })}
            >
              <div className="inline-flex  w-fit items-center  gap-2 rounded-full border border-badge-border bg-badge-border/10 px-3 py-1 text-xs font-medium text-badge-text transition-all duration-300">
                <ShieldCheck className="size-4" />
                {t("pharmacistLogin.badge")}
              </div>
            </div>

            <h1
              className={clsx(
                "mt-5 text-4xl font-semibold tracking-tight  text-primary sm:text-5xl lg:text-6xl transition-all duration-300",
                {
                  "text-right": isArabic,
                  "text-left": !isArabic,
                },
              )}
            >
              {t("pharmacistLogin.title")}
            </h1>

            <p
              className={clsx(
                "mt-5  text-base leading-7 text-muted-foreground sm:text-lg transition-all duration-300",
                {
                  "text-right": isArabic,
                  "text-left": !isArabic,
                },
              )}
            >
              {t("pharmacistLogin.description")}
            </p>

            <div className="mt-8 overflow-hidden rounded-4xl border border-border bg-card p-3 shadow-2xl transition-all duration-300 shadow-primary/10">
              <img
                loading="lazy"
                src={pharmaLogin}
                alt={t("pharmacistLogin.heroAlt")}
                className="h-88 w-full rounded-3xl object-cover object-center"
              />
            </div>
          </div>

          <div
            className={`flex justify-center transition-all duration-300 ${
              isArabic
                ? "order-1 lg:order-2 lg:justify-end"
                : "order-2 lg:order-1 lg:justify-start"
            }`}
          >
            <div className="w-full max-w-lg">
              <div className="mb-6 flex flex-col items-center text-center">
                <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
                  <Stethoscope className="size-7" />
                </div>
                <h2 className="mt-4 text-3xl font-semibold text-foreground text-center transition-all duration-300">
                  {t("common.appName")}
                </h2>
              </div>

              <AuthCard
                titleKey="pharmacistLogin.cardTitle"
                descriptionKey="pharmacistLogin.cardDescription"
                roleTagKey="pharmacistLogin.roleTag"
              >
                <Form {...form}>
                  <AuthForm
                    isSubmitting={isLoggingIn}
                    onSubmit={onSubmit}
                    submitLabelKey="pharmacistLogin.submit"
                    includeGoogle
                    footer={
                      <div
                        className={clsx(
                          "pt-2 text-sm text-muted-foreground flex justify-center transition-all duration-300",
                          {
                            "text-center": isArabic,
                            "text-left": !isArabic,
                          },
                        )}
                      >
                        <span className={clsx({ "order-2": !isArabic })}>
                          {t("pharmacistLogin.noAccount")}
                        </span>
                        <Button
                          type="button"
                          variant="link"
                          className="h-auto p-0 mx-1 text-sm font-medium text-primary text-right"
                          onClick={() => navigate("/signup/pharmacist")}
                        >
                          {t("pharmacistLogin.createAccount")}
                        </Button>
                      </div>
                    }
                  >
                    <div
                      dir={isArabic ? "rtl" : "ltr"}
                      className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500"
                    >
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel
                              className={clsx(
                                "text-md font-medium",
                                isArabic ? "text-right" : "text-left",
                              )}
                            >
                              {t("pharmacistLogin.identifierLabel")}
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
                                  type="email"
                                  disabled={isLoggingIn}
                                  className={clsx(
                                    "h-12 rounded-2xl bg-input",
                                    isArabic ? "pr-10" : "pl-10",
                                  )}
                                  placeholder={t("auth.emailPlaceholder")}
                                />
                              </div>
                            </FormControl>
                            <FormMessage
                              className={clsx(
                                "text-right",
                                isArabic ? "text-right" : "text-left",
                              )}
                            />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <div className="flex justify-between gap-3">
                              <FormLabel
                                className={clsx(
                                  "text-md font-medium",
                                  isArabic ? "text-right" : "text-left",
                                )}
                              >
                                {t("pharmacistLogin.passwordLabel")}
                              </FormLabel>
                              <button
                                type="button"
                                disabled={isLoggingIn}
                                onClick={() =>
                                  navigate("/forgot-password", {
                                    state: { email: form.getValues("email") },
                                  })
                                }
                                className="text-sm font-medium text-primary hover:underline disabled:opacity-50"
                              >
                                {t("pharmacistLogin.forgotPassword")}
                              </button>
                            </div>
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
                                  type={showPassword ? "text" : "password"}
                                  disabled={isLoggingIn}
                                  className={clsx(
                                    "h-12 rounded-2xl bg-input",
                                    isArabic ? "pr-10 pl-10" : "pl-10 pr-10",
                                  )}
                                  placeholder={t("auth.passwordPlaceholder")}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className={clsx(
                                    "absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
                                    isArabic ? "left-1" : "right-1",
                                  )}
                                  onClick={() =>
                                    setShowPassword((prev) => !prev)
                                  }
                                >
                                  {showPassword ? (
                                    <EyeOff className="size-4" />
                                  ) : (
                                    <Eye className="size-4" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage
                              className={clsx(
                                "text-right",
                                isArabic ? "text-right" : "text-left",
                              )}
                            />
                          </FormItem>
                        )}
                      />

                      <div
                        className={clsx(
                          "flex items-center gap-2",
                          isArabic ? "justify-end" : "justify-start",
                        )}
                      >
                        <Checkbox
                          id="pharmacist-remember"
                          disabled={isLoggingIn}
                          checked={rememberMe}
                          onCheckedChange={(checked) =>
                            setRememberMe(!!checked)
                          }
                        />
                        <label
                          htmlFor="pharmacist-remember"
                          className="text-sm select-none"
                        >
                          {t("pharmacistLogin.rememberMe")}
                        </label>
                      </div>
                    </div>
                  </AuthForm>
                </Form>
              </AuthCard>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default PharmacistLogin;
