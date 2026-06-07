import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { getErrorMessage } from "@/lib/api";
import * as authApi from "@/services/api/auth";


export const useGoogleLogin = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setAuthData } = useAuth();

  return useMutation({
    mutationFn: async (credential: string) => {
      if (!credential.trim()) {
        throw new Error("Missing Google credential");
      }

      return authApi.googleLogin(credential);
    },
    onSuccess: (response) => {
      const payload = response?.data?.data ?? response?.data ?? response;
      const userData = payload?.user;
      const pharmacyData = payload?.pharmacy ?? null;
      const accessTokenValue =
        userData?.access_token ?? payload?.access_token ?? payload?.token;
      const refreshTokenValue = userData?.refresh_token ?? payload?.refresh_token;

      if (!userData || !accessTokenValue || !refreshTokenValue) {
        toast.error(t("common.error"), {
          description: t("auth.invalidCredentials"),
          className:"bg-destructive text-destructive-foreground",
          duration: 5000,
        });
        return;
      }

      setAuthData(accessTokenValue, refreshTokenValue, userData, pharmacyData);

      if (!pharmacyData) {
        navigate("/complete-profile", { replace: true });
        return;
      }

      navigate("/dashboard", { replace: true });
    },
    onError: (error) => {
      const errMsg = getErrorMessage(error, "auth.invalidCredentials");

      const needsTranslation =
        errMsg.startsWith("auth.") || errMsg.startsWith("common.");

      const finalMessage = needsTranslation ? t(errMsg) : errMsg;

      toast.error(t("common.error"), {
        description: finalMessage,
        duration: 5000,
      });
    },
  });
};