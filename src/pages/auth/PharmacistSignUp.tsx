import { useEffect } from "react";
import { MoonStar, Stethoscope, SunMedium, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

// Assets & UI
import pharmaLogin from "../../assets/pharmaLogin.png";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/theme-provider";

import RegisterForm from "@/components/auth/register/RegisterForm"; // الفورم المفصل

const PharmacistSignUp = () => {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const isArabic = i18n.language === "ar";

  useEffect(() => {
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language, isArabic]);

  return (
    <main className="min-h-screen transition-all duration-300 bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        {/* Header - Language & Theme Toggle */}
        <header
          className={clsx(
            "flex items-center gap-3 pb-4",
            isArabic ? "justify-end" : "justify-start",
          )}
        >
          <div className="flex items-center gap-1 rounded-full border border-border bg-card/50 p-1 shadow-sm backdrop-blur">
            <Button
              type="button"
              size="sm"
              className={clsx(
                "h-8 rounded-full px-3 transition-all",
                i18n.language === "en"
                  ? "bg-primary/30 text-primary font-semibold"
                  : "bg-transparent text-muted-foreground",
              )}
              onClick={() => i18n.changeLanguage("en")}
            >
              EN
            </Button>
            <Button
              type="button"
              size="sm"
              className={clsx(
                "h-8 rounded-full px-3 transition-all",
                i18n.language === "ar"
                  ? "bg-primary/30 text-primary font-semibold"
                  : "bg-transparent text-muted-foreground",
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
            className="size-10 rounded-full border border-border shadow-sm backdrop-blur"
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
          className={clsx(
            "grid flex-1 items-center gap-10",
            isArabic
              ? "lg:grid-cols-[1.1fr_0.9fr]"
              : "lg:grid-cols-[0.9fr_1.1fr]",
          )}
        >
          {/* Hero Content Side */}
          <div
            className={clsx(
              "relative overflow-hidden flex flex-col justify-center transition-all duration-300 bg-background-alpha min-h-full p-10 rounded-4xl",
              isArabic
                ? "order-2 lg:order-1 lg:pr-8"
                : "order-1 lg:order-2 lg:pl-8",
            )}
          >
            <div className="pointer-events-none absolute left-0 top-0 h-56 w-56 -translate-x-1/3 -translate-y-1/3 rounded-full bg-[radial-gradient(circle_at_top_left,rgba(5,150,105,0.24),transparent_68%)] blur-3xl dark:bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.22),transparent_68%)]" />
            <div
              className={clsx(
                "flex",
                isArabic ? "justify-start" : "justify-end",
              )}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <ShieldCheck className="size-4" />
                {t("pharmacistSignup.badge")}
              </div>
            </div>
            <h1
              className={clsx(
                "mt-5 text-4xl font-semibold tracking-tight text-primary sm:text-5xl lg:text-6xl",
                isArabic ? "text-right" : "text-left",
              )}
            >
              {t("pharmacistSignup.title")}
            </h1>
            <p
              className={clsx(
                "mt-5 text-base leading-7 text-muted-foreground sm:text-lg",
                isArabic ? "text-right" : "text-left",
              )}
            >
              {t("pharmacistSignup.description")}
            </p>
            <div className="mt-8 overflow-hidden rounded-4xl border border-border bg-card p-3 shadow-2xl">
              <img
                loading="lazy"
                src={pharmaLogin}
                alt={t("pharmacistSignup.heroAlt")}
                className="h-88 w-full rounded-3xl object-cover"
              />
            </div>
          </div>

          {/* Form Side */}
          <div
            className={clsx(
              "flex justify-center",
              isArabic
                ? "order-1 lg:order-2 lg:justify-end"
                : "order-2 lg:order-1 lg:justify-start",
            )}
          >
            <div className="w-full max-w-lg">
              <div className="mb-6 flex flex-col items-center text-center">
                <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
                  <Stethoscope className="size-7" />
                </div>
                <h2 className="mt-4 text-3xl font-semibold text-foreground">
                  PharmaTech
                </h2>
              </div>

              <RegisterForm />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default PharmacistSignUp;
