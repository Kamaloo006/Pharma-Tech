import { type FormEventHandler, type ReactNode } from "react";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Spinner } from "../ui/spinner";
import { useGoogleLogin } from "@/hooks/useGoogleLogin";
import { GoogleLogin } from "@react-oauth/google";
import { useTheme } from "@/context/theme-provider";

type Props = {
  children: ReactNode;
  onSubmit: FormEventHandler<HTMLFormElement>;
  isSubmitting: boolean;
  submitLabelKey?: string;
  showSubmitButton?: boolean;
  footer?: ReactNode;
  includeGoogle?: boolean;
};

export default function AuthForm({
  children,
  onSubmit,
  isSubmitting,
  submitLabelKey = "submit",
  showSubmitButton = true,
  footer,
  includeGoogle = false,
}: Props) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { mutate, isPending: isGoogleLoading } = useGoogleLogin();
  const isAuthLoading = isSubmitting || isGoogleLoading;
  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div className="space-y-4">{children}</div>

      {showSubmitButton && (
        <Button
          type="submit"
          disabled={isAuthLoading}
          className="h-14 w-full rounded-2xl bg-primary text-primary-foreground text-lg font-semibold shadow-lg shadow-primary/30 transition-all duration-300 hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <Spinner />
              <span>{t("auth.processing")}</span>
            </div>
          ) : (
            <>
              <ShieldCheck className="size-5 mx-2" />
              {t(submitLabelKey)}
            </>
          )}
        </Button>
      )}

      {includeGoogle && (
        <div className="flex flex-col gap-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                {t("auth.orContinueWith")}
              </span>
            </div>
          </div>
          <div className="relative flex h-12 justify-center overflow-hidden rounded-2xl mx-auto">
            <div
              className="w-full "
              style={{
                pointerEvents: isAuthLoading ? "none" : "auto",
                opacity: isAuthLoading ? 0.55 : 1,
              }}
            >
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  const credential = credentialResponse.credential;
                  if (credential && !isAuthLoading) {
                    mutate(credential);
                  }
                }}
                type="standard"
                text="signin_with"
                shape="pill"
                theme={theme === "light" ? "outline" : "filled_black"}
                size="large"
                width="400"
              />
            </div>
            {isGoogleLoading && (
              <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-2xl bg-background/70 text-sm font-medium text-foreground backdrop-blur-sm">
                <Spinner />
                <span>{t("auth.processing")}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {footer && !isSubmitting && <div className="pt-2">{footer}</div>}
    </form>
  );
}
