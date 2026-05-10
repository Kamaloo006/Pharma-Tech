import React from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2 } from "lucide-react";

type AuthCardProps = {
  titleKey: string;
  descriptionKey?: string;
  roleTagKey?: string;
  children?: React.ReactNode;
  className?: string;
};

export default function AuthCard({
  titleKey,
  descriptionKey,
  roleTagKey,
  children,
  className,
}: AuthCardProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <Card
      className={clsx(
        "rounded-[1.75rem] border-border bg-card shadow-2xl shadow-black/10 backdrop-blur transition-all duration-300",
        className,
      )}
    >
      <CardHeader className="gap-1 border-b border-border pb-5 transition-colors duration-300">
        <div
          className={clsx("flex items-center justify-between gap-3", {
            "flex-row": isArabic,
            "flex-row-reverse": !isArabic,
          })}
        >
          <div>
            <CardTitle
              className={clsx(
                "text-2xl font-semibold text-foreground transition-all duration-300",
                {
                  "text-right": isArabic,
                  "text-left": !isArabic,
                },
              )}
            >
              {t(titleKey)}
            </CardTitle>
            {descriptionKey ? (
              <CardDescription
                className={clsx(
                  "mt-1 text-sm text-muted-foreground transition-all duration-300",
                  {
                    "text-right": isArabic,
                    "text-left": !isArabic,
                  },
                )}
              >
                {t(descriptionKey)}
              </CardDescription>
            ) : null}
          </div>

          {roleTagKey ? (
            <div className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary transition-all duration-300">
              <Building2 className="size-3.5" />
              {t(roleTagKey)}
            </div>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="space-y-5 pt-6">{children}</CardContent>
    </Card>
  );
}
