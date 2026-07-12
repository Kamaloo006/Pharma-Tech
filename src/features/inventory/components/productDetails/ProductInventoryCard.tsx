import {
  ShoppingCart,
  PlusCircle,
  AlertCircle,
  PackageCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface ProductInventoryCardProps {
  product: any;
  isArabic: boolean;
  isOut: boolean;
  isLowStock: boolean;
  onManualAdjustClick?: () => void;
}

export default function ProductInventoryCard({
  product,
  isArabic,
  isOut,
  isLowStock,
  onManualAdjustClick,
}: ProductInventoryCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isQuantityZero = product.total_quantity === 0;

  return (
    <div
      className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase border-b border-border pb-2 text-start">
        {t("inventory.inventoryCard.title")}
      </h3>

      <div className="grid grid-cols-2 gap-2 text-center pt-1">
        <div className="bg-muted/40 p-2.5 rounded-xl border border-border/40">
          <span className="text-[9px] text-muted-foreground uppercase font-semibold block">
            {t("inventory.inventoryCard.current")}
          </span>
          <span
            className={`text-base font-bold ${isQuantityZero ? "text-red-400" : "text-foreground"}`}
          >
            {product.total_quantity}
          </span>
        </div>
        <div className="bg-muted/40 p-2.5 rounded-xl border border-border/40">
          <span className="text-[9px] text-muted-foreground uppercase font-semibold block">
            {t("inventory.inventoryCard.minimum")}
          </span>
          <span className="text-base font-bold text-amber-500">
            {product.min_stock}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs py-2 border-t border-b border-border/40">
        <span className="text-muted-foreground">
          {t("inventory.inventoryCard.statusLabel")}
        </span>
        <span
          className={`font-bold px-2 py-0.5 rounded-md text-[11px] ${
            isOut
              ? "bg-red-500/10 text-red-400 border border-red-500/20"
              : isLowStock
                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          }`}
        >
          {isOut
            ? t("inventory.inventoryCard.status.outOfStock")
            : isLowStock
              ? t("inventory.inventoryCard.status.lowStock")
              : t("inventory.inventoryCard.status.available")}
        </span>
      </div>

      {isQuantityZero ? (
        <div className="space-y-3 pt-1">
          <div className="flex gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 text-[11px] leading-relaxed text-start text-muted-foreground">
            <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <p>{t("inventory.inventoryCard.outOfStockWarning")}</p>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              onClick={() => navigate("/purchases/new")}
              className="w-full h-9 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold text-xs gap-1.5 shadow-sm transition-all"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              {t("inventory.inventoryCard.createInvoice")}
            </Button>

            <Button
              variant="outline"
              onClick={onManualAdjustClick}
              className="w-full h-9 rounded-xl border-border bg-transparent text-muted-foreground hover:text-foreground text-xs gap-1.5 transition-colors"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              {t("inventory.inventoryCard.manualAdjustment")}
            </Button>
          </div>
        </div>
      ) : (
        <div className="pt-1">
          <Button
            onClick={() => navigate("/purchases/new")}
            variant="secondary"
            className="w-full h-9 rounded-xl bg-muted border border-border/60 hover:bg-muted/80 text-foreground font-semibold text-xs gap-1.5 transition-all"
          >
            <PackageCheck className="h-3.5 w-3.5 text-emerald-500" />
            {t("inventory.inventoryCard.receivePurchase")}
          </Button>
        </div>
      )}
    </div>
  );
}
