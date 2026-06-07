import { getErrorMessage } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import * as authApi from "@/services/api/auth";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { loginSchema, type LoginInput } from "@/types/authValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";

export const useLogin = () => {
  const navigate = useNavigate();
  const { setAuthData } = useAuth();
  const { t } = useTranslation();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [rememberMe, setRememberMe] = useState(false);

  const loginMutation = useMutation({
    mutationFn: async (values: LoginInput) =>
      authApi.login({
        email: values.email.trim(),
        password: values.password,
      }),
    onSuccess: (response) => {
      const payload = response?.data?.data ?? response?.data ?? response;
      const userData = payload?.user;
      const pharmacyData = payload?.pharmacy ?? null;
      const accessTokenValue = userData?.access_token ?? payload?.access_token ?? payload?.token;
      const refreshTokenValue = userData?.refresh_token ?? payload?.refresh_token;

      if (!userData || !accessTokenValue || !refreshTokenValue) {
        toast.error(t("common.error"), { description: t("auth.invalidCredentials") });
        return;
      }

      setAuthData(accessTokenValue, refreshTokenValue, userData, pharmacyData, rememberMe);

      if (!pharmacyData) {
        navigate("/complete-setup", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    },
    onError: (error: unknown) => {
      const errMsg = getErrorMessage(error, "auth.invalidCredentials");
      const needsTranslation = errMsg.startsWith("auth.") || errMsg.startsWith("common.");
      const finalMessage = needsTranslation ? t(errMsg) : errMsg;

      toast.error(t("common.error"), {
        description: finalMessage,
        duration: 5000,
      });

      form.reset({ email: "", password: "" });
    },
  });

  return {
    form,
    loginMutation,
    rememberMe,
    setRememberMe,
    onSubmit: form.handleSubmit((values) => loginMutation.mutate(values)),
    isLoading: loginMutation.isPending,
  };
};