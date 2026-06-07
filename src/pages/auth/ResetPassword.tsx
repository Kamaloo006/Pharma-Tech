import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { Stethoscope, Lock, Eye, EyeOff, Save } from "lucide-react";

// Components & UI
import { Button } from "@/components/ui/button";
import AuthCard from "@/components/auth/AuthCard";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Custom Hooks
import { useResetPassword } from "@/hooks/useResetPassword";
import AuthHeader from "@/components/auth/AuthHeader";

const ResetPassword = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const {
    form,
    onSubmit,
    onInvalid,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    isPending,
  } = useResetPassword();

  useEffect(() => {
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [isArabic, i18n.language]);

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
              titleKey="auth.resetPasswordTitle"
              descriptionKey="auth.resetPasswordDesc"
              roleTagKey="pharmacistSignup.roleTag"
            >
              <div className="flex flex-col items-center text-center py-4">
                <div className="relative inline-flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform duration-300 hover:scale-105">
                  <Lock className="size-7" />
                </div>
              </div>

              <Form {...form}>
                <form
                  onSubmit={onSubmit}
                  onError={onInvalid}
                  className="space-y-4"
                >
                  {/* حقل الإيميل المحمي غير القابل للتعديل */}
                  <FormItem className="space-y-1.5">
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
                        type="email"
                        disabled
                        className={clsx(
                          "h-12 rounded-xl border-border bg-muted/60 font-medium text-muted-foreground select-none opacity-80 cursor-not-allowed",
                          isArabic ? "text-right" : "text-left",
                        )}
                        value={form.watch("email")}
                      />
                    </FormControl>
                  </FormItem>

                  {/* حقل كلمة المرور الجديدة */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel
                          className={clsx(
                            "text-sm font-medium",
                            isArabic ? "text-right block" : "text-left block",
                          )}
                        >
                          {t("auth.newPasswordLabel")}
                        </FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              type={showPassword ? "text" : "password"}
                              className={clsx(
                                "h-12 rounded-xl border-border bg-background focus-visible:ring-primary pr-10 pl-10",
                                isArabic ? "text-right" : "text-left",
                              )}
                              {...field}
                            />
                          </FormControl>
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className={clsx(
                              "absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
                              isArabic ? "left-3" : "right-3",
                            )}
                          >
                            {showPassword ? (
                              <EyeOff className="size-5" />
                            ) : (
                              <Eye className="size-5" />
                            )}
                          </button>
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* حقل تأكيد كلمة المرور الجديدة */}
                  <FormField
                    control={form.control}
                    name="password_confirmation"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel
                          className={clsx(
                            "text-sm font-medium",
                            isArabic ? "text-right block" : "text-left block",
                          )}
                        >
                          {t("auth.confirmNewPasswordLabel")}
                        </FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              className={clsx(
                                "h-12 rounded-xl border-border bg-background focus-visible:ring-primary pr-10 pl-10",
                                isArabic ? "text-right" : "text-left",
                              )}
                              {...field}
                            />
                          </FormControl>
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className={clsx(
                              "absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
                              isArabic ? "left-3" : "right-3",
                            )}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="size-5" />
                            ) : (
                              <Eye className="size-5" />
                            )}
                          </button>
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* زر الحفظ والتنفيذ */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={isPending}
                      className="w-full h-12 rounded-2xl bg-primary text-[16px] font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-primary/10"
                    >
                      <Save
                        className={clsx("size-4", isPending && "animate-spin")}
                      />
                      {isPending
                        ? t("auth.saving")
                        : t("auth.resetPasswordBtn")}
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

export default ResetPassword;
