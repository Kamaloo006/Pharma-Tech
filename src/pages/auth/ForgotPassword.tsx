import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import clsx from "clsx";
import {
  MoonStar,
  Stethoscope,
  SunMedium,
  KeyRound,
  Send,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

// Components & UI
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/theme-provider";
import AuthCard from "@/components/auth/AuthCard";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Validation & API
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/types/authValidation";
import api, { getErrorMessage } from "@/lib/api";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();

  const isArabic = i18n.language === "ar";

  const [countdown, setCountdown] = useState<number>(0);

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  useEffect(() => {
    const targetTime = localStorage.getItem("reset_password_timeout");

    if (targetTime) {
      const calculateRemaining = () => {
        const remaining = Math.ceil((parseInt(targetTime) - Date.now()) / 1000);
        if (remaining > 0) {
          setCountdown(remaining);
        } else {
          setCountdown(0);
          localStorage.removeItem("reset_password_timeout");
        }
      };

      calculateRemaining();

      const interval = setInterval(calculateRemaining, 1000);
      return () => clearInterval(interval);
    }
  }, [countdown]);

  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: ForgotPasswordInput) => {
      const response = await api.post("/password/forgot", {
        ...data,
        platform: "web",
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success(t("auth.forgotPasswordSuccessTitle"), {
        description: t("auth.forgotPasswordSuccessDesc"),
      });

      const expiryTime = Date.now() + 60 * 1000;
      localStorage.setItem("reset_password_timeout", expiryTime.toString());
      setCountdown(60);
    },
    onError: (error: unknown) => {
      const errMsg = getErrorMessage(error, t("auth.emailInvalid"));
      const needsTranslation =
        errMsg.startsWith("auth.") || errMsg.startsWith("common.");

      const finalMessage = needsTranslation ? t(errMsg) : errMsg;
      toast.error(t("common.error"), {
        description: finalMessage,
      });
    },
  });

  const onSubmit = (data: ForgotPasswordInput) => {
    if (countdown > 0) return;
    forgotPasswordMutation.mutate(data);
  };

  useEffect(() => {
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language, isArabic]);

  return (
    <main className="min-h-screen transition-all duration-300 bg-background text-foreground flex flex-col">
      <div className="mx-auto flex w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8 flex-1">
        {/* Header - Language & Theme Toggle */}
        <header
          className={clsx(
            "flex items-center gap-3 pb-4",
            isArabic ? "justify-end" : "justify-start",
          )}
        >
          <div className="flex items-center gap-1 rounded-full border border-border bg-card/50 p-1 shadow-sm backdrop-blur transition-all duration-300">
            <Button
              type="button"
              size="sm"
              className={clsx(
                "h-8 rounded-full px-3 transition-all duration-300",
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
                "h-8 rounded-full px-3 transition-all duration-300",
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
            className="size-10 rounded-full border border-border shadow-sm backdrop-blur transition-all duration-300"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <SunMedium className="size-4" />
            ) : (
              <MoonStar className="size-4" />
            )}
          </Button>
        </header>

        <section className="flex flex-1 items-center justify-center relative overflow-hidden py-10">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(5,150,105,0.15),transparent_68%)] blur-3xl" />

          <div className="w-full max-w-lg relative z-10">
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
                <Stethoscope className="size-7" />
              </div>
              <h2 className="mt-4 text-3xl font-semibold text-foreground tracking-tight">
                PharmaTech
              </h2>
            </div>

            <AuthCard
              titleKey="auth.forgotPasswordTitle"
              descriptionKey="auth.forgotPasswordDesc"
              roleTagKey="pharmacistSignup.roleTag"
            >
              <div className="flex flex-col items-center text-center ">
                <div className="relative mb-5 flex items-center justify-center">
                  <div className="absolute inset-0 animate-ping rounded-full bg-primary/20 duration-1000 opacity-75" />
                  <div className="absolute size-24 rounded-full bg-primary/5 animate-pulse" />

                  <div className="relative inline-flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary transition-all duration-500 hover:scale-110 hover:rotate-12 shadow-inner">
                    <KeyRound className="size-10 " />
                  </div>
                </div>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5 text-right">
                        <FormLabel
                          className={clsx(
                            "text-sm font-medium",
                            isArabic ? "text-right block" : "text-left block",
                          )}
                        >
                          {t("auth.emailLabel")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="name@example.com"
                            type="email"
                            autoComplete="email"
                            className={clsx(
                              "h-12 rounded-xl border-border bg-background focus-visible:ring-primary",
                              isArabic ? "text-right" : "text-left",
                            )}
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-col gap-3 pt-2">
                    <Button
                      type="submit"
                      disabled={
                        forgotPasswordMutation.isPending || countdown > 0
                      }
                      className="w-full h-12 rounded-2xl bg-primary text-[16px] font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-primary/10"
                    >
                      <Send
                        className={clsx(
                          "size-4",
                          forgotPasswordMutation.isPending && "animate-spin",
                        )}
                      />
                      {forgotPasswordMutation.isPending
                        ? t("auth.sending")
                        : countdown > 0
                          ? `${t("auth.sendResetLinkBtn")} (${countdown}s)`
                          : t("auth.sendResetLinkBtn")}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className={clsx(
                        "w-full h-12 rounded-2xl text-[16px] font-semibold flex items-center justify-center gap-2 border-border bg-card hover:bg-muted",
                        isArabic ? "flex-row-reverse" : "flex-row",
                      )}
                      onClick={() => navigate("/login/pharmacist")}
                    >
                      {isArabic ? (
                        <ArrowRight className="size-4" />
                      ) : (
                        <ArrowLeft className="size-4" />
                      )}
                      {t("auth.backToLogin")}
                    </Button>
                  </div>
                </form>
              </Form>
            </AuthCard>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ForgotPassword;
