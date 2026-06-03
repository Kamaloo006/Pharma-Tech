import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import * as authApi from "@/services/api/auth";
import { getErrorMessage } from "@/lib/api";

const RESEND_COOLDOWN_SECONDS = 60;

export const useVerifyEmail = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [resendCooldown, setResendCooldown] = useState<number>(0);


  const userEmail = (location.state as { email?: string })?.email || "";

  useEffect(() => {
    const targetTime = localStorage.getItem("email_verification_timeout");

    if (targetTime) {
      const calculateRemaining = () => {
        const remaining = Math.ceil((parseInt(targetTime) - Date.now()) / 1000);
        if (remaining > 0) {
          setResendCooldown(remaining);
        } else {
          setResendCooldown(0);
          localStorage.removeItem("email_verification_timeout");
        }
      };

      calculateRemaining();
      const interval = setInterval(calculateRemaining, 1000);
      return () => clearInterval(interval);
    }
  }, [resendCooldown]);

  const resendMutation = useMutation({
    mutationFn: async () => {
      if (!userEmail) throw new Error("Email not found");
      return await authApi.resendVerificationEmail(userEmail);
    },
    onSuccess: () => {
      const expiryTime = Date.now() + RESEND_COOLDOWN_SECONDS * 1000;
      localStorage.setItem("email_verification_timeout", expiryTime.toString());
      setResendCooldown(RESEND_COOLDOWN_SECONDS);

      toast.success(t("auth.resendSuccessTitle"), {
        description: t("auth.resendSuccessDesc"),
      });
    },
    onError: (error: unknown) => {
      const errMsg = getErrorMessage(error, t("auth.resendFailed"));

      if (errMsg === "auth.tooManyAttempts") {
        const expiryTime = Date.now() + RESEND_COOLDOWN_SECONDS * 1000;
        localStorage.setItem("email_verification_timeout", expiryTime.toString());
        setResendCooldown(RESEND_COOLDOWN_SECONDS);
      }

      const needsTranslation = errMsg.startsWith("auth.") || errMsg.startsWith("common.");
      const finalMessage = needsTranslation ? t(errMsg) : errMsg;

      toast.error(t("common.error"), {
        description: finalMessage,
      });
    },
  });

  const handleResend = () => {
    if (resendCooldown > 0) return;
    resendMutation.mutate();
  };

  return {
    userEmail,
    resendCooldown,
    handleResend,
    isPending: resendMutation.isPending,
  };
};