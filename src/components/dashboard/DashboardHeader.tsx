import { useTranslation } from "react-i18next";
import AuthHeader from "../auth/AuthHeader";
import { Bell, Search, Plus } from "lucide-react";
import clsx from "clsx";

const DashboardHeader = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <div
      className={clsx(
        "flex w-full items-center justify-between border-b border-border/40 bg-background/50 px-6 py-4 backdrop-blur-md sm:px-8 lg:px-10",
        {
          "flex-row-reverse": isArabic,
        },
      )}
    >
      <div
        className={clsx("flex flex-1 items-center gap-6", {
          "flex-row-reverse": isArabic,
        })}
      >
        <h2 className="text-xl font-bold tracking-wide text-foreground sm:text-2xl">
          {t("common.appName")}
        </h2>

        <div className="relative w-full max-w-md hidden md:block">
          <span
            className={clsx(
              "absolute inset-y-0 flex items-center text-muted-foreground pointer-events-none",
              isArabic ? "left-auto right-4" : "left-4 right-auto",
            )}
          >
            <Search className="size-4" />
          </span>
          <input
            dir={isArabic ? "rtl" : "ltr"}
            type="text"
            placeholder={
              isArabic ? "ابحث عن أي شيء..." : "Search for anything..."
            }
            className={clsx(
              "w-full h-10 rounded-full border border-border/60 bg-muted/20 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all duration-300 shadow-inner",
              isArabic ? "pr-11 pl-4" : "pl-11 pr-4",
            )}
          />
        </div>

        <button
          className={clsx(
            "inline-flex items-center gap-2 px-5 h-10 rounded-full font-medium text-sm transition-all duration-300 shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40",
            "bg-primary text-primary-foreground hover:opacity-90 active:scale-98",
            { "flex-row-reverse": isArabic },
          )}
        >
          <Plus className="size-4" />
          <span>{t("dashboard.addProduct")}</span>
        </button>
      </div>

      <div
        className={clsx("flex items-center gap-4", {
          "flex-row-reverse": isArabic,
        })}
      >
        <button
          type="button"
          className="relative flex size-10 items-center justify-center rounded-full border border-border/80 bg-muted/10 text-foreground transition-all duration-300 hover:bg-muted/30 hover:border-primary/30 cursor-pointer shadow-sm"
        >
          <Bell className="size-4 text-muted-foreground hover:text-foreground transition-colors" />

          <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
        </button>

        <div className="flex items-center  pl-4  mt-4">
          <AuthHeader />
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
