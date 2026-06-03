import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/types/authValidation";
import api, { getErrorMessage } from "@/lib/api";

export const useForgotPassword = () => {
  const { t } = useTranslation();
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
      const needsTranslation = errMsg.startsWith("auth.") || errMsg.startsWith("common.");
      const finalMessage = needsTranslation ? t(errMsg) : errMsg;
      
      toast.error(t("common.error"), {
        description: finalMessage,
      });
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    if (countdown > 0) return;
    forgotPasswordMutation.mutate(data);
  });

  return {
    form,
    onSubmit,
    countdown,
    isPending: forgotPasswordMutation.isPending,
  };
};