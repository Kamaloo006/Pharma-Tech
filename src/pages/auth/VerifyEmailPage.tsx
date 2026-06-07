import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import {
  Stethoscope,
  MailCheck,
  RefreshCw,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import AuthCard from "@/components/auth/AuthCard";
import AuthHeader from "@/components/auth/AuthHeader";

// Hooks
import { useVerifyEmail } from "@/hooks/useVerifyEmail";

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const isArabic = i18n.language === "ar";

  const { userEmail, resendCooldown, handleResend, isPending } =
    useVerifyEmail();

  useEffect(() => {
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language, isArabic]);

  return (
    <main className="min-h-screen transition-all duration-300 bg-background text-foreground flex flex-col">
      <div className="mx-auto flex w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8 flex-1">
        <AuthHeader />

        <section className="flex flex-1 items-center justify-center relative overflow-hidden py-10">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(5,150,105,0.15),transparent_68%)] blur-3xl" />

          <div className="w-full max-w-lg relative z-10">
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
                <Stethoscope className="size-7" />
              </div>
              <h2 className="mt-4 text-3xl font-semibold text-foreground tracking-tight">
                {t("common.appName")}
              </h2>
            </div>

            <AuthCard
              titleKey="auth.verifyEmailCardTitle"
              descriptionKey="auth.verifyEmailCardDesc"
              roleTagKey="pharmacistSignup.roleTag"
            >
              <div className="flex flex-col items-center text-center py-6">
                <div className="relative mb-5">
                  <div className="absolute inset-0 animate-ping rounded-full bg-primary/10" />
                  <div className="relative inline-flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <MailCheck className="size-10" />
                  </div>
                </div>

                <h3 className="text-xl font-medium text-foreground mb-2">
                  {t("auth.checkInbox")}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mb-4">
                  {t("auth.weSentLinkTo")}{" "}
                  <span className="font-semibold text-xl text-foreground block mt-1.5 break-all bg-muted px-3 py-2 rounded-xl border border-border">
                    {userEmail || "your-email@example.com"}
                  </span>
                </p>

                <p className="text-xs bg-primary/5 px-3 py-1.5 rounded-full text-primary font-medium">
                  {t("auth.linkExpirationNotice")}
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-4 border-t border-border">
                <Button
                  type="button"
                  disabled={isPending || resendCooldown > 0}
                  className="w-full h-12 rounded-2xl bg-primary text-[16px] font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-primary/10"
                  onClick={handleResend}
                >
                  <RefreshCw
                    className={clsx("size-4", isPending && "animate-spin")}
                  />
                  {isPending
                    ? t("auth.sending")
                    : resendCooldown > 0
                      ? `${t("auth.resendEmailBtn")} (${resendCooldown}s)`
                      : t("auth.resendEmailBtn")}
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
            </AuthCard>
          </div>
        </section>
      </div>
    </main>
  );
};

export default VerifyEmailPage;
