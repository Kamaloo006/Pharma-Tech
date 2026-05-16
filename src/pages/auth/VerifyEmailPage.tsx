import axios from "axios";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const performEmailVerification = async () => {
      const encodedUrl = searchParams.get("url");
      if (!encodedUrl) {
        setStatus("error");
        setErrorMessage(t("auth.invalid_verification_link"));
        return;
      }
      try {
        const decodedUrl = decodeURIComponent(encodedUrl);
        const response = await axios.get(decodedUrl);

        if (response.data?.data?.token) {
          const resData = response.data.data;
        }
      } catch (error: any) {
        setStatus("error");
        setErrorMessage(t("auth.verification_failed"));
      }
    };

    performEmailVerification();
  }, [searchParams, navigate, t]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-[1.75rem] border border-border bg-card shadow-2xl text-center space-y-6 transition-all duration-300">
        {status === "loading" && (
          <div className="flex flex-col items-center space-y-4 animate-pulse">
            <Loader2 className="size-16 text-primary animate-spin" />
            <h2 className="text-2xl font-semibold text-foreground">
              {t("auth.verifying_account")}
            </h2>
            <p className="text-muted-foreground text-sm">
              {t("auth.please_wait")}
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center space-y-4 animate-in fade-in zoom-in-95 duration-500">
            <CheckCircle2 className="size-16 text-emerald-500" />
            <h2 className="text-2xl font-semibold text-foreground">
              {t("auth.verified_successfully")}
            </h2>
            <p className="text-muted-foreground text-sm">
              {t("auth.redirecting_to_dashboard")}
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center space-y-4 animate-in fade-in zoom-in-95 duration-500">
            <XCircle className="size-16 text-destructive" />
            <h2 className="text-2xl font-semibold text-foreground">
              {t("auth.verification_error")}
            </h2>
            <p className="text-destructive text-sm font-medium">
              {errorMessage}
            </p>
            <button
              onClick={() => navigate("/login/pharmacist")}
              className="mt-2 text-sm text-primary hover:underline font-semibold"
            >
              {t("auth.back_to_login")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
