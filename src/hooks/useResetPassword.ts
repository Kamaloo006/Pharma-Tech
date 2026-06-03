import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { resetPasswordSchema, type ResetPasswordInput } from "@/types/authValidation";
import api, { getErrorMessage } from "@/lib/api";

export const useResetPassword = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isArabic = i18n.language === "ar";


  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const tokenFromUrl = searchParams.get("token") || "";
  const emailFromUrl = searchParams.get("email") || "";

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: emailFromUrl,
      token: tokenFromUrl,
      password: "",
      password_confirmation: "",
    },
  });

  useEffect(() => {
    if (emailFromUrl) form.setValue("email", emailFromUrl);
    if (tokenFromUrl) form.setValue("token", tokenFromUrl);
  }, [emailFromUrl, tokenFromUrl, form]);

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ResetPasswordInput) => {
      const response = await api.post("/password/reset", {
        ...data,
        platform: "web",
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success(t("auth.resetPasswordSuccessTitle"), {
        description: t("auth.resetPasswordSuccessDesc"),
      });
      setTimeout(() => {
        navigate("/login/pharmacist", { replace: true, state:{email:emailFromUrl} });
      }, 2000);
    },
    onError: (error: unknown) => {
      const errMsg = getErrorMessage(error, t("auth.resetPasswordFailed"));

      const needsTranslation = errMsg.startsWith("auth.") || errMsg.startsWith("common.");
      const finalMessage = needsTranslation ? t(errMsg) : errMsg;

      toast.error(t("common.error"), {
        description: finalMessage,
      });
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    resetPasswordMutation.mutate(data);
  });

  const onInvalid = (errors: any) => {
    if (errors.password_confirmation?.message === "auth.passwordMismatch") {
      toast.error(t("common.error"), {
        description: t("auth.passwordMismatchToast", {
          defaultValue: isArabic
            ? "كلمتا المرور غير متطابقتين، يرجى التأكد وإعادة المحاولة."
            : "Passwords do not match. Please verify and try again.",
        }),
      });
    }
  };

  return {
    form,
    onSubmit,
    onInvalid,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    isPending: resetPasswordMutation.isPending,
  };
};