import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface DeletePharmacistDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export function DeletePharmacistDialog({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: DeletePharmacistDialogProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-md rounded-2xl p-6"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-rose-500">
            {t("pharmacists.delete_dialog.title")}
          </DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground leading-relaxed pt-2">
          {t("pharmacists.delete_dialog.description")}
        </p>
        <DialogFooter className="pt-4 gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-xl text-xs h-9 px-4"
          >
            {t("pharmacists.delete_dialog.cancel")}
          </Button>
          <Button
            variant="destructive"
            disabled={isDeleting}
            onClick={onConfirm}
            className="rounded-xl text-xs h-9 px-5 gap-2"
          >
            {isDeleting && <Loader2 className="size-3.5 animate-spin" />}
            <span>{t("pharmacists.delete_dialog.confirm")}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
