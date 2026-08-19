import { Users, UserPlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface PharmacistHeaderProps {
  onAddClick: () => void;
}

export function PharmacistHeader({ onAddClick }: PharmacistHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border/40">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
          <Users className="size-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {t("pharmacists.title")}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("pharmacists.subtitle")}
          </p>
        </div>
      </div>

      <Button
        onClick={onAddClick}
        className="gap-2 rounded-xl text-xs h-10 px-4 self-start sm:self-auto"
      >
        <UserPlus className="size-4" />
        <span>{t("pharmacists.add_button")}</span>
      </Button>
    </div>
  );
}
