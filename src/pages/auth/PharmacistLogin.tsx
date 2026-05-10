import { type FormEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MoonStar, ShieldCheck, Stethoscope, SunMedium } from "lucide-react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import pharmaLogin from "../../assets/pharmaLogin.png";
import { Button } from "@/components/ui/button";
// Card UI provided by AuthCard
import AuthForm from "@/components/auth/AuthForm";
import { useTheme } from "@/context/theme-provider";
// Checkbox/input moved into AuthForm
import { setAuthSession } from "@/lib/auth";
import AuthCard from "@/components/auth/AuthCard";

const PharmacistLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [rememberMe, setRememberMe] = useState(false);
  const fromPath =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname ?? "/dashboard";

  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const isArabic = i18n.language === "ar";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setAuthSession({
      role: "pharmacist",
      identifier: identifier.trim() || "pharmacist",
    });
    navigate(fromPath, { replace: true });
  };

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
                  PharmaTech
                </h2>
              </div>

              <AuthCard
                titleKey="pharmacistLogin.cardTitle"
                descriptionKey="pharmacistLogin.cardDescription"
                roleTagKey="pharmacistLogin.roleTag"
              >
                <AuthForm
                  prefix="pharmacistLogin"
                  identifier={identifier}
                  setIdentifier={setIdentifier}
                  password={password}
                  setPassword={setPassword}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  isArabic={isArabic}
                  rememberMe={rememberMe}
                  setRememberMe={setRememberMe}
                  isSubmitting={isSubmitting}
                  onSubmit={handleSubmit}
                  includeGoogle
                  footer={
                    <div
                      className={clsx(
                        "pt-2  text-sm text-muted-foreground flex justify-center transition-all duration-300",
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
                />
              </AuthCard>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default PharmacistLogin;
