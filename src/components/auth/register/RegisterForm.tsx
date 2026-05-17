import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner"; // استخدام الـ Sonner Toaster الخاص بـ Shadcn
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

// الـ Logic والـ Components
import AuthCard from "@/components/auth/AuthCard";
import AuthForm from "@/components/auth/AuthForm";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { registerSchema, type RegisterInput } from "@/types/authValidation";
import { PersonalInfoFields } from "@/components/auth/register/PersonalInfoFields";
import { PharmacyInfoFields } from "@/components/auth/register/PharmacyInfoFields";
import * as authApi from "@/services/api/auth"; // استيراد دوال الـ API الخاصة بالمصادقة

export default function RegisterForm() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const isArabic = i18n.language === "ar";

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (_, variables) => {
      toast.success(t("pharmacistSignup.registrationSuccess"), {
        description: t("pharmacistSignup.checkEmailMessage"),
      });
      navigate("/verify-email-dev", {
        replace: true,
        state: { email: variables.email },
      });
    },
    onError: (error: any) => {
      const errMsg =
        error?.response?.data?.message ||
        t("pharmacistSignup.registrationFailed");
      toast.error(t("common.error"), { description: errMsg });
    },
  });

  // فحص حقول الخطوة الأولى قبل الانتقال
  const handleNextStep = async () => {
    const fieldsToValidate = [
      "email",
      "first_name",
      "last_name",
      "phone_number",
      "password",
      "password_confirmation",
    ] as any;
    const isValid = await form.trigger(fieldsToValidate);

    if (isValid) {
      // Explicit check for password confirmation equality
      const password = form.getValues("password");
      const passwordConfirmation = form.getValues("password_confirmation");

      if (password !== passwordConfirmation) {
        toast.error(t("common.error"), {
          description: t("validation.passwordsDoNotMatch"),
        });
        return;
      }

      setCurrentStep(2);
    }
  };

  const onSubmit = (data: RegisterInput) => {
    registerMutation.mutate(data); // تشغيل الـ Mutation النظيف لشحن الـ JSON
  };

  return (
    <AuthCard
      titleKey="pharmacistSignup.cardTitle"
      descriptionKey={
        currentStep === 1
          ? "pharmacistSignup.personalStepDesc"
          : "pharmacistSignup.pharmacyStepDesc"
      }
      roleTagKey="pharmacistSignup.roleTag"
    >
      {/* مؤشر الخطوات */}
      <Progress value={currentStep === 1 ? 50 : 100} className="mb-4" />

      <Form {...form}>
        <AuthForm
          onSubmit={form.handleSubmit(onSubmit)}
          isSubmitting={registerMutation.isPending}
          showSubmitButton={currentStep === 2} // لا يظهر زر الإرسال النهائي لـ AuthForm إلا بالخطوة الثانية
          submitLabelKey="pharmacistSignup.submit"
          footer={
            <div className="pt-2 text-sm text-muted-foreground flex justify-center gap-1">
              <span>{t("pharmacistSignup.haveAccount")}</span>
              <Button
                type="button"
                variant="link"
                className="h-auto p-0 font-medium text-primary"
                onClick={() => navigate("/login/pharmacist")}
              >
                {t("pharmacistSignup.loginNow")}
              </Button>
            </div>
          }
        >
          {/* تبديل حقول الإدخال الذكية */}
          {currentStep === 1 ? (
            <PersonalInfoFields form={form} />
          ) : (
            <PharmacyInfoFields form={form} />
          )}

          {/* أزرار التحكم بالخطوات */}
          <div className="flex gap-3 pt-2">
            {currentStep === 1 && (
              <Button
                type="button"
                className={clsx(
                  "w-full h-12 rounded-2xl bg-primary text-[18px] font-semibold flex items-center justify-center gap-2",
                  isArabic ? "flex-row-reverse" : "flex-row",
                )}
                onClick={handleNextStep}
              >
                {t("common.next")}
                {isArabic ? (
                  <ChevronLeft className="size-5" />
                ) : (
                  <ChevronRight className="size-5" />
                )}
              </Button>
            )}

            {currentStep === 2 && (
              <Button
                type="button"
                variant="outline"
                disabled={registerMutation.isPending}
                className={clsx(
                  "w-full h-12 rounded-2xl text-[18px] font-semibold flex items-center justify-center gap-2",
                  isArabic ? "flex-row-reverse" : "flex-row",
                )}
                onClick={() => setCurrentStep(1)}
              >
                {isArabic ? (
                  <ChevronRight className="size-5" />
                ) : (
                  <ChevronLeft className="size-5" />
                )}
                {t("common.back")}
              </Button>
            )}
          </div>
        </AuthForm>
      </Form>
    </AuthCard>
  );
}
