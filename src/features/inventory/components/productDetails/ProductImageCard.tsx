import { UploadCloud } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ProductImageCardProps {
  isArabic: boolean;
}

export default function ProductImageCard({}: ProductImageCardProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
      <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase block">
        {t("inventory.productImage.title")}
      </span>
      <div className="border border-dashed border-border hover:border-muted bg-muted/20 rounded-xl h-35 flex flex-col items-center justify-center text-center cursor-pointer group transition-colors">
        <UploadCloud className="h-5 w-5 text-muted-foreground group-hover:text-foreground mb-1" />
        <p className="text-[11px] text-muted-foreground">
          {t("inventory.productImage.noImage")}
        </p>
        <button className="mt-2 bg-card hover:bg-accent border border-border text-foreground text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-colors">
          {t("inventory.productImage.uploadBtn")}
        </button>
      </div>
    </div>
  );
}
