import { type FormEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Building2,
  Eye,
  EyeOff,
  Lock,
  MoonStar,
  ShieldCheck,
  Stethoscope,
  SunMedium,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import pharmaLogin from "../../assets/pharmaLogin.png";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/context/theme-provider";
import { Checkbox } from "@/components/ui/checkbox";
import { setAuthSession } from "@/lib/auth";

const PharmacistSignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    if (password !== confirmPassword) {
      return;
    }

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
                  "bg-primary/30 text-primary font-semibold hover:bg-primary/40": i18n.language === "en",
                  "bg-transparent text-muted-foreground hover:bg-muted/50": i18n.language !== "en",
                }
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
                  "bg-primary/30 text-primary font-semibold hover:bg-primary/40": i18n.language === "ar",
                  "bg-transparent text-muted-foreground hover:bg-muted/50": i18n.language !== "ar",
                }
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
            className={`flex flex-col justify-center transition-all duration-300 bg-background-alpha min-h-full  px-10 ${
              isArabic
                ? "order-2 lg:order-1 lg:pr-8"
                : "order-1 lg:order-2 lg:pl-8"
            }`}
          >
            {/* Badge */}
            <div
              className={clsx("flex", {
                "justify-end": !isArabic,
                "justify-start": isArabic,
              })}
            >
              <div className="inline-flex  w-fit items-center  gap-2 rounded-full border border-badge-border bg-badge-border/10 px-3 py-1 text-xs font-medium text-badge-text transition-all duration-300">
                <ShieldCheck className="size-4" />
                {t("pharmacistSignup.badge")}
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
              {t("pharmacistSignup.title")}
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
              {t("pharmacistSignup.description")}
            </p>

            <div className="mt-8 overflow-hidden rounded-4xl border border-border bg-card p-3 shadow-2xl transition-all duration-300 shadow-primary/10">
              <img
                src={pharmaLogin}
                alt={t("pharmacistSignup.heroAlt")}
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

              <Card className="rounded-[1.75rem] border-border bg-card shadow-2xl shadow-black/10 backdrop-blur transition-all duration-300">
                <CardHeader className="  gap-1 border-b border-border pb-5 transition-colors duration-300">
                  <div
                    className={clsx("flex items-center justify-between gap-3", {
                      "flex-row": isArabic,
                      "flex-row-reverse": !isArabic,
                    })}
                  >
                    <div>
                      <CardTitle
                        className={clsx(
                          "text-2xl font-semibold text-foreground transition-all duration-300",
                          {
                            "text-right": isArabic,
                            "text-left": !isArabic,
                          },
                        )}
                      >
                        {t("pharmacistSignup.cardTitle")}
                      </CardTitle>
                      <CardDescription
                        className={clsx(
                          "mt-1 text-sm text-muted-foreground transition-all duration-300",
                          {
                            "text-right": isArabic,
                            "text-left": !isArabic,
                          },
                        )}
                      >
                        {t("pharmacistSignup.cardDescription")}
                      </CardDescription>
                    </div>
                    <div className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary transition-all duration-300">
                      <Building2 className="size-3.5" />
                      {t("pharmacistSignup.roleTag")}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-5 pt-6">
                  <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                      <div
                        className={clsx("flex ", {
                          "justify-start": isArabic,
                          "justify-end": !isArabic,
                        })}
                      >
                        <label
                          className={clsx(
                            "text-md font-medium text-foreground transition-all duration-300",
                            {
                              "text-right": isArabic,
                              "text-left": !isArabic,
                            },
                          )}
                          htmlFor="pharmacist-identifier"
                        >
                          {t("pharmacistSignup.identifierLabel")}
                        </label>
                      </div>
                      <div className="relative">
                        <Building2
                          className={clsx(
                            "pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors duration-300",
                            {
                              "right-3": isArabic,
                              "left-3": !isArabic,
                            },
                          )}
                        />
                        <Input
                          id="pharmacist-identifier"
                          type="email"
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          placeholder={t(
                            "pharmacistSignup.identifierPlaceholder",
                          )}
                          className={clsx(
                            "mt-2 h-12 flex rounded-2xl border-border bg-input text-foreground placeholder:text-muted-foreground transition-all duration-300",
                            {
                              "pr-10": isArabic,
                              "pl-10": !isArabic,
                            },
                          )}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div
                        className={clsx(
                          "flex items-center justify-between gap-3",
                          {
                            "flex-row": isArabic,
                            "flex-row-reverse": !isArabic,
                          },
                        )}
                      >
                        <label
                          className={clsx(
                            "text-md font-medium text-foreground transition-all duration-300",
                            {
                              "text-right": isArabic,
                              "text-left": !isArabic,
                            },
                          )}
                          htmlFor="pharmacist-password"
                        >
                          {t("pharmacistSignup.passwordLabel")}
                        </label>
                      </div>
                      <div className="relative">
                        <Lock
                          className={clsx(
                            "pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors duration-300",
                            {
                              "right-3": isArabic,
                              "left-3": !isArabic,
                            },
                          )}
                        />
                        <Input
                          id="pharmacist-password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••"
                          className={clsx(
                            "mt-2 h-12 rounded-2xl border-border bg-input text-foreground flex placeholder:text-muted-foreground transition-all duration-300",
                            {
                              "pr-10 pl-12": isArabic,
                              "pl-10 pr-12": !isArabic,
                            },
                          )}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className={clsx(
                            "absolute top-1/2 size-10 -translate-y-1/2 rounded-full text-muted-foreground hover:text-foreground",
                            {
                              "left-1": isArabic,
                              "right-1": !isArabic,
                            },
                          )}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="size-4" color="#10b981" />
                          ) : (
                            <Eye className="size-4" color="#10b981" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div
                        className={clsx("flex ", {
                          "justify-start": isArabic,
                          "justify-end": !isArabic,
                        })}
                      >
                        <label
                          className={clsx(
                            "text-md font-medium text-foreground transition-all duration-300",
                            {
                              "text-right": isArabic,
                              "text-left": !isArabic,
                            },
                          )}
                          htmlFor="pharmacist-confirm-password"
                        >
                          {t("pharmacistSignup.confirmPasswordLabel")}
                        </label>
                      </div>
                      <div className="relative">
                        <Lock
                          className={clsx(
                            "pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors duration-300",
                            {
                              "right-3": isArabic,
                              "left-3": !isArabic,
                            },
                          )}
                        />
                        <Input
                          id="pharmacist-confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••••"
                          className={clsx(
                            "mt-2 h-12 rounded-2xl border-border bg-input text-foreground flex placeholder:text-muted-foreground transition-all duration-300",
                            {
                              "pr-10 pl-12": isArabic,
                              "pl-10 pr-12": !isArabic,
                            },
                          )}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className={clsx(
                            "absolute top-1/2 size-10 -translate-y-1/2 rounded-full text-muted-foreground hover:text-foreground",
                            {
                              "left-1": isArabic,
                              "right-1": !isArabic,
                            },
                          )}
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="size-4" color="#10b981" />
                          ) : (
                            <Eye className="size-4" color="#10b981" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id="remember-me"
                          checked={rememberMe}
                          className="border-primary"
                          onCheckedChange={(checked) =>
                            setRememberMe(checked === true)
                          }
                        />
                        <label
                          htmlFor="remember-me"
                          className="text-sm text-muted-foreground"
                        >
                          {t("pharmacistSignup.rememberMe")}
                        </label>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="google"
                        className="flex p-2 items-center gap-2 text-md"
                      >
                        {/* Visual-only Google button */}
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden
                        >
                          <path
                            d="M17.64 9.2045c0-.638-.057-1.25-.164-1.84H9v3.48h4.844c-.209 1.12-.844 2.07-1.8 2.71v2.26h2.9c1.7-1.57 2.68-3.86 2.68-6.61z"
                            fill="#4285F4"
                          />
                          <path
                            d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.58-5.05-3.7H1.02v2.32C2.5 15.9 5.52 18 9 18z"
                            fill="#34A853"
                          />
                          <path
                            d="M3.95 11.7a5.4 5.4 0 010-3.6V5.78H1.02A8.99 8.99 0 000 9c0 1.43.34 2.78.94 3.97l2.99-1.27z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M9 3.6c1.32 0 2.5.45 3.43 1.33l2.57-2.57C13.47.98 11.43 0 9 0 5.52 0 2.5 2.1 1.02 5.22l2.99 2.32C4.66 5.18 6.65 3.6 9 3.6z"
                            fill="#EA4335"
                          />
                        </svg>

                        {t("pharmacistSignup.googleSignIn")}
                      </Button>
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-14 w-full rounded-2xl bg-primary text-primary-foreground text-lg font-semibold shadow-lg shadow-primary/30 transition-all duration-300 hover:opacity-90 disabled:opacity-50"
                    >
                      <ShieldCheck className="size-5" />
                      {t("pharmacistSignup.submit")}
                    </Button>
                  </form>

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
                      {t("pharmacistSignup.haveAccount")}
                    </span>
                    <Button
                      type="button"
                      variant="link"
                      className="h-auto p-0 mx-1 text-sm font-medium text-primary text-right"
                      onClick={() => navigate("/login/pharmacist")}
                    >
                      {t("pharmacistSignup.loginNow")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default PharmacistSignUp;
