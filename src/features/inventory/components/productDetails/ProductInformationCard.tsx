interface ProductInformationCardProps {
  product: any;
  isArabic: boolean;
}

export default function ProductInformationCard({
  product,
  isArabic,
}: ProductInformationCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
      <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase border-b border-border pb-3">
        {isArabic ? "المعلومات العامة للمنتج" : "GENERAL INFORMATION"}
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
        {[
          {
            label: isArabic ? "الاسم التجاري" : "Brand Name",
            val: product.brand_name,
            bold: true,
          },
          {
            label: isArabic ? "الاسم العربي" : "Arabic Name",
            val: product.ar_name,
            bold: true,
          },
          {
            label: isArabic ? "الاسم العلمي" : "Scientific Name",
            val: product.scientific_name,
            italic: true,
          },
          {
            label: isArabic ? "العيار" : "Strength",
            val: product.strength,
          },
          {
            label: isArabic ? "الباركود" : "Barcode",
            val: product.barcode,
            mono: true,
            color: "text-emerald-500",
          },
          {
            label: isArabic ? "الفئة الدوائية" : "Category",
            val: product.category?.name,
          },
          {
            label: isArabic ? "الشركة المصنعة" : "Company",
            val: product.company?.name,
          },
          {
            label: isArabic ? "الوحدة الأساسية" : "Base Unit",
            val: product.base_unit?.name,
          },
          {
            label: isArabic ? "وحدة المبيع تجزئة" : "Selling Unit",
            val: product.selling_unit?.name,
          },
          {
            label: isArabic ? "عدد الوحدات داخل العبوة" : "Units / Box",
            val: product.units_per_base,
          },
          {
            label: isArabic ? "الحد الأدنى للأمان" : "Min Stock",
            val: product.min_stock,
            color: "text-amber-500",
          },

          {
            label: isArabic ? "النسبة الضريبية" : "Tax",
            val: `${product.tax_rate}%`,
          },
          {
            label: isArabic ? "الخصم المسموح" : "Discount",
            val: `${product.discount_rate}%`,
            color: "text-emerald-400",
          },
          {
            label: isArabic ? "نوع الوصفة" : "Prescription",
            val: product.prescription_required ? "Rx" : "OTC",
            color: "text-red-400",
          },
          {
            label: isArabic ? "السماح بالبيع الجزئي" : "Allow Partial Selling",
            val: product.allow_partial_selling
              ? isArabic
                ? "نعم"
                : "Yes"
              : isArabic
                ? "لا"
                : "No",
            color: "text-emerald-400",
          },
        ].map((item, idx) => (
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
