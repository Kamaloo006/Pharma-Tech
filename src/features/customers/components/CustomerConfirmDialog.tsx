import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { type Customer } from "@/features/customers/types/Customer";

interface CustomerConfirmDialogProps {
  isOpen: boolean;
  type: "delete" | "restore";
  customer: Customer | null;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function CustomerConfirmDialog({
  isOpen,
  type,
  customer,
  isLoading,
  onClose,
  onConfirm,
}: CustomerConfirmDialogProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent dir={isArabic ? "rtl" : "ltr"}>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base font-bold">
            {type === "delete"
              ? t("customers.deleteConfirmTitle")
              : t("customers.restoreConfirmTitle")}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-muted-foreground">
            {type === "delete"
              ? t("customers.deleteConfirmDesc", {
                  name: customer?.full_name || "",
                })
              : t("customers.restoreConfirmDesc", {
                  name: customer?.full_name || "",
                })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel disabled={isLoading} className="h-8 text-xs">
            {t("common.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className={`h-8 text-xs ${
              type === "delete"
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : "bg-emerald-600 text-white hover:bg-emerald-700"
            }`}
          >
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin me-1" />}
            {type === "delete" ? t("common.delete") : t("common.restore")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
