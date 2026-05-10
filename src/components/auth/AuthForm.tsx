import { type FormEvent } from "react";
import clsx from "clsx";
import { Building2, Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslation } from "react-i18next";

type Props = {
  prefix: string; // translation key prefix, e.g. 'pharmacistLogin'
  identifier: string;
  setIdentifier: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  confirmPassword?: string;
  setConfirmPassword?: (v: string) => void;
  showPassword: boolean;
  setShowPassword: (b: boolean) => void;
  showConfirmPassword?: boolean;
  setShowConfirmPassword?: (b: boolean) => void;
  isArabic: boolean;
  rememberMe: boolean;
  setRememberMe: (b: boolean) => void;
  isSubmitting: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  includeConfirm?: boolean;
  includeGoogle?: boolean;
  footer?: React.ReactNode;
};

export default function AuthForm({
  prefix,
  identifier,
  setIdentifier,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  isArabic,
  rememberMe,
  setRememberMe,
  isSubmitting,
  onSubmit,
  includeConfirm = false,
  includeGoogle = false,
  footer,
}: Props) {
  const tKey = (k: string) => `${prefix}.${k}`;
  const { t } = useTranslation();

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div className="space-y-2">
        <div
          className={clsx("flex", {
            "justify-start": isArabic,
            "justify-end": !isArabic,
          })}
        >
          <label
            className={clsx(
              "text-md font-medium text-foreground transition-all duration-300",
              { "text-right": isArabic, "text-left": !isArabic },
            )}
            htmlFor={`${prefix}-identifier`}
          >
            {t(tKey("identifierLabel"))}
          </label>
        </div>

        <div className="relative">
          <Building2
            className={clsx(
              "pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors duration-300",
              { "right-3": isArabic, "left-3": !isArabic },
            )}
          />
          <Input
            id={`${prefix}-identifier`}
            type="email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder={t(tKey("identifierPlaceholder"))}
            className={clsx(
              "mt-2 h-12 flex rounded-2xl border-border bg-input text-foreground placeholder:text-muted-foreground transition-all duration-300",
              { "pr-10": isArabic, "pl-10": !isArabic },
            )}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <div
          className={clsx("flex items-center justify-between gap-3", {
            "flex-row": isArabic,
            "flex-row-reverse": !isArabic,
          })}
        >
          <label
            className={clsx(
              "text-md font-medium text-foreground transition-all duration-300",
              { "text-right": isArabic, "text-left": !isArabic },
            )}
            htmlFor={`${prefix}-password`}
          >
            {t(tKey("passwordLabel"))}
          </label>
          <Button
            type="button"
            variant="link"
            className="h-auto p-0 text-md font-medium text-primary"
          >
            {t(tKey("forgotPassword"))}
          </Button>
        </div>

        <div className="relative">
          <Lock
            className={clsx(
              "pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors duration-300",
              { "right-3": isArabic, "left-3": !isArabic },
            )}
          />
          <Input
            id={`${prefix}-password`}
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••"
            className={clsx(
              "mt-2 h-12 rounded-2xl border-border bg-input text-foreground flex placeholder:text-muted-foreground transition-all duration-300",
              { "pr-10 pl-12": isArabic, "pl-10 pr-12": !isArabic },
            )}
            required
          />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={clsx(
              "absolute top-1/2 size-10 -translate-y-1/2 rounded-full text-muted-foreground hover:text-foreground",
              { "left-1": isArabic, "right-1": !isArabic },
            )}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </Button>
        </div>
      </div>

      {includeConfirm && (
        <div className="space-y-2">
          <div
            className={clsx("flex", {
              "justify-start": isArabic,
              "justify-end": !isArabic,
            })}
          >
            <label
              className={clsx(
                "text-md font-medium text-foreground transition-all duration-300",
                { "text-right": isArabic, "text-left": !isArabic },
              )}
              htmlFor={`${prefix}-confirm-password`}
            >
              {t(tKey("confirmPasswordLabel"))}
            </label>
          </div>
          <div className="relative">
            <Lock
              className={clsx(
                "pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors duration-300",
                { "right-3": isArabic, "left-3": !isArabic },
              )}
            />
            <Input
              id={`${prefix}-confirm-password`}
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword?.(e.target.value)}
              placeholder="••••••••••"
              className={clsx(
                "mt-2 h-12 rounded-2xl border-border bg-input text-foreground flex placeholder:text-muted-foreground transition-all duration-300",
                { "pr-10 pl-12": isArabic, "pl-10 pr-12": !isArabic },
              )}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={clsx(
                "absolute top-1/2 size-10 -translate-y-1/2 rounded-full text-muted-foreground hover:text-foreground",
                { "left-1": isArabic, "right-1": !isArabic },
              )}
              onClick={() => setShowConfirmPassword?.(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Checkbox
            id={`${prefix}-remember-me`}
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked === true)}
          />
          <label
            htmlFor={`${prefix}-remember-me`}
            className="text-sm text-muted-foreground"
          >
            {t(tKey("rememberMe"))}
          </label>
        </div>

        {includeGoogle && (
          <Button
            type="button"
            variant="outline"
            size="google"
            className="flex p-2 items-center gap-2 text-md"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
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
            {t(tKey("googleSignIn"))}
          </Button>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-14 w-full rounded-2xl bg-primary text-primary-foreground text-lg font-semibold shadow-lg shadow-primary/30 transition-all duration-300 hover:opacity-90 disabled:opacity-50"
      >
        <ShieldCheck className="size-5" />
        {t(tKey("submit"))}
      </Button>

      {footer}
    </form>
  );
}
