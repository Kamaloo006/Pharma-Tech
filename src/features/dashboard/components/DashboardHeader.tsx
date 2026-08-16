import { useTranslation } from "react-i18next";

export function DashboardHeader() {
  const { t } = useTranslation();

  return (
    <div data-aos="fade-down" className="flex flex-col gap-1">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
        {t("dashboard.header.greeting")}{" "}
        <span className="animate-bounce">👋</span>
      </h1>
      <p className="text-sm text-muted-foreground">
        {t("dashboard.header.subheading")}
      </p>
    </div>
  );
}
