import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";
import { getErrorMessage } from "@/lib/api";
import * as authApi from "@/services/api/auth";
import {
  completeProfileSchema,
  type CompleteProfileInput,
} from "@/types/authValidation";
import { useState } from "react";

export const useCompleteProfile = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { accessToken ,user, setAuthData } = useAuth(); 
  const [rememberMe, setRememberMe] = useState(false);

  const form = useForm<CompleteProfileInput>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      role: "pharmacy_owner", 
      first_name: user?.first_name ?? "",
      last_name: user?.last_name ?? "",
      phone_number: user?.phone_number ?? "",
      licence_number: "",
      pharmacy_name: "",
      city_id: "",
      address: "",
    },
    mode: "onChange",
  });

  const completeProfileMutation = useMutation({
    mutationFn: authApi.completeGoogleProfile,
    onSuccess: (response) => {
      const payload = response?.data?.data ?? response?.data ?? response;
      const updatedUser = payload?.user ?? user;
      const updatedPharmacy = payload?.pharmacy ?? payload?.data?.pharmacy ?? null;
      
      
      const nextAccessToken =
        updatedUser?.access_token ?? payload?.access_token ?? payload?.token ?? accessToken;
      const nextRefreshToken =
        updatedUser?.refresh_token ??
        payload?.refresh_token ??
        localStorage.getItem("refresh_token");

      
      if (updatedUser && nextAccessToken) {
        setAuthData(
          nextAccessToken,
          nextRefreshToken || "",
          updatedUser,
          updatedPharmacy,
          rememberMe
        );
      }

      toast.success(t("completeProfile.successTitle"), {
        description: t("completeProfile.successDesc"),
      });

      
      const targetPath =
        updatedUser?.role === "pharmacy_owner"
          ? "/dashboard"
          : "/dashboard/inventory";

      navigate(targetPath, { replace: true });
    },
    onError: (error: unknown) => {
      const errMsg = getErrorMessage(error, t("completeProfile.failed"));
      const finalMessage =
        errMsg.startsWith("auth.") || errMsg.startsWith("common.")
          ? t(errMsg)
          : errMsg;

      toast.error(t("common.error"), {
        description: finalMessage,
      });
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    
    completeProfileMutation.mutate({
      ...values,
      role: "pharmacy_owner",
    });
  });

  return {
    form,
    onSubmit,
    isPending: completeProfileMutation.isPending,
  };
};