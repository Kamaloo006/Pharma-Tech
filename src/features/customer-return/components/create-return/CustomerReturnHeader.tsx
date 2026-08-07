import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  isArabic: boolean;
}

export function CustomerReturnHeader({ isArabic }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between pb-2 border-b border-border/60">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-xl border-border/80 hover:bg-muted"
          onClick={() => navigate("/dashboard/customer-returns")}
        >
          {isArabic ? (
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ArrowLeft className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            {t("customerReturn.create.title", "Create Customer Return")}
            <RotateCcw className="w-5 h-5 text-primary" />
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t(
              "customerReturn.create.subtitle",
              "Process a return for sales invoices",
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
