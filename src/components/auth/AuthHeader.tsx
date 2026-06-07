import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/theme-provider";
import { useTranslation } from "react-i18next";
import { SunMedium, MoonStar } from "lucide-react";
import clsx from "clsx";

export default function AuthHeader() {
  const { theme, setTheme } = useTheme();
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <header
      className={clsx("flex items-center gap-3 pb-4 w-full", {
        "justify-start": !isArabic,
        "justify-end": isArabic,
      })}
    >
      <div className="flex items-center gap-1 rounded-full border border-border bg-header-bg p-1 shadow-sm backdrop-blur transition-all duration-300">
        <Button
          type="button"
          size="sm"
          className={clsx("h-8 rounded-full px-3 transition-all duration-300", {
            "bg-primary/30 text-primary font-semibold hover:bg-primary/40":
              i18n.language === "en",
            "bg-transparent text-muted-foreground hover:bg-muted/50":
              i18n.language !== "en",
          })}
          onClick={() => i18n.changeLanguage("en")}
        >
          EN
        </Button>
        <Button
          type="button"
          size="sm"
          className={clsx("h-8 rounded-full px-3 transition-all duration-300", {
            "bg-primary/30 text-primary font-semibold hover:bg-primary/40":
              i18n.language === "ar",
            "bg-transparent text-muted-foreground hover:bg-muted/50":
              i18n.language !== "ar",
          })}
          onClick={() => i18n.changeLanguage("ar")}
        >
          AR
        </Button>
      </div>

      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-10 rounded-full border border-border bg-header-bg shadow-sm backdrop-blur transition-all duration-300"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? (
          <SunMedium className="size-4" />
        ) : (
          <MoonStar className="size-4" />
        )}
      </Button>
    </header>
  );
}
