import type { ProductDetails } from "../../types/Product";
import { useTranslation } from "react-i18next";

interface ProductInformationCardProps {
  product: ProductDetails;
  isArabic: boolean;
}

export default function ProductInformationCard({
  product,
}: ProductInformationCardProps) {
  const { t } = useTranslation();

  const infoItems = [
    {
      label: t("inventory.productInfo.labels.brandName"),
      val: product.brand_name,
      bold: true,
    },
    {
      label: t("inventory.productInfo.labels.arabicName"),
      val: product.ar_name,
      bold: true,
    },
    {
      label: t("inventory.productInfo.labels.scientificName"),
      val: product.scientific_name,
      italic: true,
    },
    {
      label: t("inventory.productInfo.labels.strength"),
      val: product.strength,
    },
    {
      label: t("inventory.productInfo.labels.barcode"),
      val: product.barcode,
      mono: true,
      color: "text-emerald-500",
    },
    {
      label: t("inventory.productInfo.labels.category"),
      val: product.category?.name,
    },
    {
      label: t("inventory.productInfo.labels.company"),
      val: product.company?.name,
    },
    {
      label: t("inventory.productInfo.labels.baseUnit"),
      val: product.base_unit?.name,
    },
    {
      label: t("inventory.productInfo.labels.sellingUnit"),
      val: product.selling_unit?.name,
    },
    {
      label: t("inventory.productInfo.labels.unitsPerBase"),
      val: product.units_per_base,
    },
    {
      label: t("inventory.productInfo.labels.minStock"),
      val: product.min_stock,
      color: "text-amber-500",
    },
    {
      label: t("inventory.productInfo.labels.taxRate"),
      val: `${product.tax_rate}%`,
    },
    {
      label: t("inventory.productInfo.labels.discountRate"),
      val: `${product.discount_rate}%`,
      color: "text-emerald-400",
    },
    {
      label: t("inventory.productInfo.labels.prescription"),
      val: product.prescription_required ? "Rx" : "OTC",
      color: "text-red-400",
    },
    {
      label: t("inventory.productInfo.labels.allowPartialSelling"),
      val: product.allow_partial_selling
        ? t("inventory.productInfo.values.yes")
        : t("inventory.productInfo.values.no"),
      color: "text-emerald-400",
    },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
      <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase border-b border-border pb-3">
        {t("inventory.productInfo.title")}
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
        {infoItems.map((item, idx) => (
          <div
            key={idx}
            className="border-b border-border/40 pb-2 last:border-0"
          >
            <span className="text-[10px] font-medium text-muted-foreground block mb-0.5">
              {item.label}
            </span>
            <p
              className={`text-xs font-semibold ${item.bold ? "font-bold" : ""} ${item.italic ? "italic" : ""} ${item.mono ? "font-mono" : ""} ${item.color || "text-foreground"}`}
            >
              {item.val}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
