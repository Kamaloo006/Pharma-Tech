import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Printer,
  CheckCircle2,
  XCircle,
  Ban,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { type SupplierReturnInvoiceDetail } from "../../types/SupplierReturn";
import { useCancelSupplierReturn } from "../../hooks/useSupplierReturns";

interface Props {
  details: SupplierReturnInvoiceDetail;
  isArabic: boolean;
}

export function ReturnDetailsHeader({ details, isArabic }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const cancelMutation = useCancelSupplierReturn();

  const isCancelled = details.status.toLowerCase() === "cancelled";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/dashboard/supplier-return")}
          className="h-9 w-9 border-border/80"
        >
          {isArabic ? (
            <ArrowRight className="h-4 w-4" />
          ) : (
            <ArrowLeft className="h-4 w-4" />
          )}
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground font-mono">
              {details.invoice_number}
            </h1>
            <Badge
              className={
                isCancelled
                  ? "bg-red-800/15 text-red-800 border-red-800/30 gap-1 text-[11px] font-semibold uppercase"
                  : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 gap-1 text-[11px] font-semibold uppercase"
              }
            >
              {isCancelled ? (
                <XCircle className="w-3 h-3" />
              ) : (
                <CheckCircle2 className="w-3 h-3" />
              )}
              {details.status}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("supplierReturn.details.subtitle")}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {!isCancelled && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                className="h-9 bg-red-800 hover:bg-red-800/90 cursor-pointer text-xs gap-1.5"
                disabled={cancelMutation.isPending}
              >
                {cancelMutation.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Ban className="w-3.5 h-3.5" />
                )}
                {t("supplierReturn.details.cancelReturn")}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent
              className={`${isArabic && "flex flex-col items-start"}`}
            >
              <AlertDialogHeader>
                <AlertDialogTitle
                  className={` w-full ${isArabic ? "text-right" : "text-left"} `}
                >
                  {t("common.areYouSure")}
                </AlertDialogTitle>
                <AlertDialogDescription
                  className={`${isArabic ? "text-right" : "text-left"}`}
                >
                  {t("supplierReturn.details.cancelWarning")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => cancelMutation.mutate(details.id)}
                  className="bg-red-800 text-red-800-foreground cursor-pointer hover:bg-red-800/90"
                >
                  {t("common.confirm")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => window.print()}
          className="h-9 text-xs gap-1.5 border-border/80"
        >
          <Printer className="w-3.5 h-3.5 text-muted-foreground" />
          {t("common.print")}
        </Button>
      </div>
    </div>
  );
}
