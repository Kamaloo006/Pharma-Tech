import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { registerSchema, type RegisterInput } from "@/types/authValidation";
import * as authApi from "@/services/api/auth";
import { getErrorMessage } from "@/lib/api";

export const useRegisterForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

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
      navigate("/email-verify", {
        replace: true,
        state: { email: variables.email },
      });
    },
    onError: (error: unknown) => {
      const errMsg = getErrorMessage(
        error,
        t("pharmacistSignup.registrationFailed"),
      );
      toast.error(t("common.error"), {
        description: errMsg === "auth.tooManyAttempts" ? t(errMsg) : errMsg,
      });
    },
  });

  const handleNextStep = async () => {
    const fieldsToValidate: Array<keyof RegisterInput> = [
      "email",
      "first_name",
      "last_name",
      "phone_number",
      "password",
      "password_confirmation",
    ];

    const isValid = await form.trigger(fieldsToValidate);

    if (isValid) {
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


  const handleBackStep = () => {
    setCurrentStep(1);
  };

  const onSubmit = form.handleSubmit((data) => {
    registerMutation.mutate(data);
  });

  return {
    form,
    currentStep,
    onSubmit,
    handleNextStep,
    handleBackStep,
    isPending: registerMutation.isPending,
  };
};