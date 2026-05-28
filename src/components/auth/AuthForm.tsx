import { type FormEventHandler, type ReactNode } from "react";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Spinner } from "../ui/spinner";

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

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div className="space-y-4">{children}</div>

      {showSubmitButton && (
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-14 w-full rounded-2xl bg-primary text-primary-foreground text-lg font-semibold shadow-lg shadow-primary/30 transition-all duration-300 hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <Spinner />
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
          <Button
            type="button"
            variant="outline"
            className="h-12 w-full rounded-2xl flex items-center gap-3 text-md transition-all hover:bg-muted"
          >
            <GoogleIcon />
            {t("auth.googleSignIn")}
          </Button>
        </div>
      )}

      {/* 4. التذييل (Footer) */}
      {footer && !isSubmitting && <div className="pt-2">{footer}</div>}
    </form>
  );
}

// مكون صغير لأيقونة جوجل للحفاظ على نظافة الكود
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M17.64 9.2045c0-.638-.057-1.25-.164-1.84H9v3.48h4.844c-.209 1.12-.844 2.07-1.8 2.71v2.26h2.9c1.7-1.57 2.68-3.86 2.68-6.61z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.58-5.05-3.7H1.02v2.32C2.5 15.9 5.52 18 9 18z"
        fill="#34A853"
      />
      <path
        d="M3.95 11.7a5.4 5.4 0 010-3.6V5.78H1.02A8.99 8.99 0 000 9c0 1.43.34 2.78.94 3.97l2.99-1.27z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.6c1.32 0 2.5.45 3.43 1.33l2.57-2.57C13.47.98 11.43 0 9 0 5.52 0 2.5 2.1 1.02 5.22l2.99 2.32C4.66 5.18 6.65 3.6 9 3.6z"
        fill="#EA4335"
      />
    </svg>
  );
}
