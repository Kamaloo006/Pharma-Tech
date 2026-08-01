import { useTranslation } from "react-i18next";
import { Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CustomerPageHeaderProps {
  showDeleted: boolean;
  onOpenAddModal: () => void;
}

export function CustomerPageHeader({
  showDeleted,
  onOpenAddModal,
}: CustomerPageHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          {t("customers.title")}
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          {t("customers.subtitle")}
        </p>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto">
        {!showDeleted && (
          <Button
            size="sm"
            onClick={onOpenAddModal}
            className="h-9 text-xs gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {t("customers.addCustomer")}
          </Button>
        )}
      </div>
    </div>
  );
}
