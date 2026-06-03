import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

// components & UI
import AuthCard from "@/components/auth/AuthCard";
import AuthForm from "@/components/auth/AuthForm";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { PharmacyInfoFields } from "./PharmacyInfoFields";
// hooks
import { useRegisterForm } from "@/hooks/useRegisterForm";

export default function RegisterForm() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isArabic = i18n.language === "ar";

  const {
    form,
    currentStep,
    onSubmit,
    handleNextStep,
    handleBackStep,
    isPending,
  } = useRegisterForm();

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
      <Progress value={currentStep === 1 ? 50 : 100} className="mb-4" />

      <Form {...form}>
        <AuthForm
          onSubmit={onSubmit}
          isSubmitting={isPending}
          showSubmitButton={currentStep === 2}
          submitLabelKey="pharmacistSignup.submit"
          footer={
            <div className="pt-2 text-sm text-muted-foreground flex justify-center gap-1">
              <span className={clsx(isArabic ? "order-2" : "order-1")}>
                {t("pharmacistSignup.haveAccount")}
              </span>
              <Button
                type="button"
                variant="link"
                className={clsx(
                  "h-auto p-0 font-medium text-primary",
                  isArabic && "order-2",
                )}
                onClick={() => navigate("/login/pharmacist")}
              >
                {t("pharmacistSignup.loginNow")}
              </Button>
            </div>
          }
        >
          {currentStep === 1 ? (
            <PersonalInfoFields form={form} />
          ) : (
            <PharmacyInfoFields form={form} />
          )}

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
                disabled={isPending}
                className={clsx(
                  "w-full h-12 rounded-2xl text-[18px] font-semibold flex items-center justify-center gap-2",
                  isArabic ? "flex-row-reverse" : "flex-row",
                )}
                onClick={handleBackStep}
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
