interface ProductSummaryCardsProps {
  product: any;
  isArabic: boolean;
}

export default function ProductSummaryCards({
  product,
  isArabic,
}: ProductSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="rounded-2xl border border-emerald-500/20 bg-card p-5 space-y-1.5 shadow-sm">
        <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase block">
          {isArabic ? "سعر المبيع" : "SELLING PRICE"}
        </span>
        <p className="text-2xl font-bold tracking-tight text-emerald-400">
          {product.selling_price?.toLocaleString()}{" "}
          <span className="text-xs">SYP</span>
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 space-y-1.5 shadow-sm">
        <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase block">
          {isArabic ? "سعر الشراء" : "BUYING PRICE"}
        </span>
        <p className="text-2xl font-bold tracking-tight text-foreground">
          {(product.buying_price || 0).toLocaleString()}{" "}
          <span className="text-xs">SYP</span>
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 space-y-1.5 shadow-sm">
        <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase block">
          {isArabic ? "المخزون الحالي" : "CURRENT STOCK"}
        </span>
        <p className="text-2xl font-bold tracking-tight text-foreground">
          {product.total_quantity}{" "}
          <span className="text-xs">{product.base_unit?.name || "Box"}</span>
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 space-y-1.5 shadow-sm">
        <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase block">
          {isArabic ? "أقرب صلاحية" : "NEAREST EXPIRY"}
        </span>
        <p className="text-2xl font-bold tracking-tight text-amber-500 font-mono">
          {product.nearest_expiry || "—"}
        </p>
      </div>
    </div>
  );
}
