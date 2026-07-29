import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function InvoiceHeader({ isArabic }: { isArabic: boolean }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1 text-start">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          {t("purchaseInvoice.header.title")}
        </h2>
        <p className="text-xs text-muted-foreground">
          {t("purchaseInvoice.header.description")}
        </p>
      </div>
      <Link to="/dashboard/purchases/new">
        <Button className="h-10 text-xs font-bold gap-2 self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          <span>{t("purchaseInvoice.header.newInvoice")}</span>
        </Button>
      </Link>
    </div>
  );
}
