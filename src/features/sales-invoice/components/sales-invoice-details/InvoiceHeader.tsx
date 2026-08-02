import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Ban, Loader2 } from "lucide-react";

interface InvoiceHeaderProps {
  invoiceNumber: string;
  invoiceDate: string;
  status: string;
  isCancelled: boolean;
  isCancelling: boolean;
  onCancelClick: () => void;
  formatDate: (date: string) => string;
}

export function InvoiceHeader({
  invoiceNumber,
  invoiceDate,
  status,
  isCancelled,
  isCancelling,
  onCancelClick,
  formatDate,
}: InvoiceHeaderProps) {
  const { t } = useTranslation();

  return (
    <Card className="border-border/60 shadow-xs rounded-2xl overflow-hidden">
      <CardContent className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              {t("salesInvoice.detailsTitle", { number: invoiceNumber })}
            </h1>
            <Badge
              className={
                isCancelled
                  ? "bg-destructive/15 text-destructive border-destructive/20 font-bold px-2.5 py-0.5 rounded-lg text-xs capitalize"
                  : "bg-emerald-500/15 text-emerald-600 border-emerald-500/20 font-bold px-2.5 py-0.5 rounded-lg text-xs capitalize"
              }
            >
              [{status}]
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            {formatDate(invoiceDate)}
          </p>
        </div>

        <Button
          variant="destructive"
          size="sm"
          disabled={isCancelled || isCancelling}
          onClick={onCancelClick}
          className="h-9 px-4 text-xs font-bold gap-1.5 rounded-xl shrink-0"
        >
          {isCancelling ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Ban className="h-3.5 w-3.5" />
          )}
          {isCancelled
            ? t("salesInvoice.statusCancelled")
            : t("salesInvoice.cancelButton")}
        </Button>
      </CardContent>
    </Card>
  );
}
