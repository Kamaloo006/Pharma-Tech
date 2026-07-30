// components/productDetails/ProductSummaryCards.tsx
import { useTranslation } from "react-i18next";
import type { Product } from "../../types/Product";

interface ProductSummaryCardsProps {
  product: Product;
  isArabic: boolean;
}

export default function ProductSummaryCards({
  product,
  isArabic,
}: ProductSummaryCardsProps) {
  const { t } = useTranslation();

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* Selling Price Card */}
      <div className="rounded-2xl border border-emerald-500/20 bg-card p-5 space-y-1.5 shadow-sm text-start">
        <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase block">
          {t("inventory.summaryCards.sellingPrice")}
        </span>
        <p className="text-2xl font-bold tracking-tight text-emerald-400">
          {product.selling_price?.toLocaleString()}{" "}
          <span className="text-xs">
            {t("inventory.summaryCards.currency")}
          </span>
        </p>
      </div>

      {/* Buying Price Card */}
      <div className="rounded-2xl border border-border bg-card p-5 space-y-1.5 shadow-sm text-start">
        <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase block">
          {t("inventory.summaryCards.buyingPrice")}
        </span>
        <p className="text-2xl font-bold tracking-tight text-foreground">
          {(product.buying_price || 0).toLocaleString()}{" "}
          <span className="text-xs">
            {t("inventory.summaryCards.currency")}
          </span>
        </p>
      </div>

      {/* Current Stock Card */}
      <div className="rounded-2xl border border-border bg-card p-5 space-y-1.5 shadow-sm text-start">
        <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase block">
          {t("inventory.summaryCards.currentStock")}
        </span>
        <p className="text-2xl font-bold tracking-tight text-foreground">
          {product.total_quantity}{" "}
          <span className="text-xs">
            {product.base_unit?.name || t("inventory.summaryCards.defaultUnit")}
          </span>
        </p>
      </div>

      {/* Nearest Expiry Card */}
      <div className="rounded-2xl border border-border bg-card p-5 space-y-1.5 shadow-sm text-start">
        <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase block">
          {t("inventory.summaryCards.nearestExpiry")}
        </span>
        <p className="text-2xl font-bold tracking-tight text-amber-500 font-mono">
          {product.nearest_expiry || "—"}
        </p>
      </div>
    </div>
  );
}
