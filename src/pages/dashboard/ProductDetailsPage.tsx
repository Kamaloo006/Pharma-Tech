import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit2,
  Plus,
  UploadCloud,
  ShieldCheck,
  MoreVertical,
  AlertTriangle,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import AddProductModal from "@/features/inventory/components/AddProductModal";
import { useProductDetails } from "@/features/inventory/hooks/useProductDetails";

export default function ProductDetailsPage() {
  const navigate = useNavigate();

  // استخراج كافة البيانات والحالات من الـ Hook
  const {
    product,
    batches,
    categories,
    companies,
    isLoading,
    isError,
    t,
    isArabic,
    isEditModalOpen,
    setIsEditModalOpen,
  } = useProductDetails();

  // فحص حالة اقتراب انتهاء الصلاحية
  const isExpiringSoon = (expiryDate: string | null) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
    return expiry <= sixMonthsFromNow;
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-2 bg-background text-muted-foreground">
        <AlertTriangle className="h-8 w-8 text-destructive" />
        <p>
          {isArabic
            ? "عذراً، تعذر العثور على بيانات هذا المنتج"
            : "Sorry, product details could not be found"}
        </p>
      </div>
    );
  }

  const isLowStock = product.total_quantity < product.min_stock;
  const isOut = product.total_quantity === 0;

  return (
    <div
      className="min-h-screen bg-background text-foreground p-6 space-y-6"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* الرأس (Header Area) */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border pb-6">
        <div className="flex items-start gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 bg-card hover:bg-accent text-muted-foreground hover:text-foreground rounded-xl border border-border transition-colors mt-1"
          >
            <ArrowLeft className={`h-4 w-4 ${isArabic ? "rotate-180" : ""}`} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-card-foreground">
                {isArabic ? product.ar_name : product.brand_name}
              </h1>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border tracking-wide uppercase ${
                  isOut
                    ? "border-red-500/30 bg-red-500/10 text-red-400"
                    : isLowStock
                      ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                      : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                }`}
              >
                {isOut ? "OUT OF STOCK" : isLowStock ? "LOW STOCK" : "IN STOCK"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">
              {product.scientific_name || "—"}{" "}
              <span className="text-border mx-2">|</span>{" "}
              {product.company?.name || "—"}
            </p>
          </div>
        </div>

        {/* أزرار التحكم العلوية */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 bg-card hover:bg-accent border border-border text-muted-foreground hover:text-foreground text-xs font-semibold px-4 py-2.5 rounded-xl transition-all"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>Edit Product</span>
          </button>

          <button
            onClick={() => console.log("فتح مودال إضافة شحنة")}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>New Stock</span>
          </button>
        </div>
      </div>

      {/* شبكة توزيع العناصر (Grid Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* العمود الأيسر: الصورة والأسعار */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              PRODUCT VISUAL
            </h3>
            <div className="border border-dashed border-border hover:border-muted bg-muted/20 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer group transition-colors">
              <div className="p-3 bg-card group-hover:bg-accent rounded-full border border-border mb-4 transition-colors">
                <UploadCloud className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
              </div>
              <p className="text-xs font-medium text-foreground">
                Choose a file or drag & drop it here
              </p>
              <button className="mt-4 bg-card hover:bg-accent border border-border text-foreground text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-colors">
                Browse File
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-emerald-500/30 bg-card p-5 space-y-1.5 ring-1 ring-emerald-500/20">
              <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase block">
                SELLING PRICE
              </span>
              <p className="text-2xl font-bold tracking-tight text-emerald-400">
                {product.selling_price.toLocaleString()}{" "}
                <span className="text-xs">s.p</span>
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 space-y-1.5">
              <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase block">
                BUYING PRICE
              </span>
              <p className="text-2xl font-bold tracking-tight text-foreground">
                {product.buying_price?.toLocaleString() || 0}{" "}
                <span className="text-xs">s.p</span>
              </p>
            </div>
          </div>
        </div>

        {/* العمود الأيمن: الخصائص وجدول الباتشات */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
            <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase border-b border-border pb-3">
              DETAILED PROPERTIES
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8">
              <div>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase block mb-1">
                  Barcode
                </span>
                <p className="text-xs font-mono font-bold text-foreground tracking-wider bg-muted px-2 py-1.5 rounded-lg border border-border inline-block">
                  {product.barcode}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase block mb-1">
                  Category
                </span>
                <p className="text-xs font-semibold text-foreground">
                  {product.category?.name || "—"}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase block mb-1">
                  Current Stock
                </span>
                <div className="flex items-center gap-2.5">
                  <span className="text-base font-bold text-foreground">
                    {product.total_quantity.toLocaleString()}{" "}
                    {product.base_unit?.name || "Units"}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase block mb-1">
                  Nearest Expiry
                </span>
                <p
                  className={`text-xs font-semibold ${product.nearest_expiry ? "text-amber-500" : "text-muted-foreground"}`}
                >
                  📅 {product.nearest_expiry || "—"}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase block mb-1">
                  Minimum Stock Alert
                </span>
                <p className="text-xs font-medium text-amber-500">
                  ⚠️{" "}
                  <span className="font-bold text-foreground mx-0.5">
                    {product.min_stock}
                  </span>{" "}
                  Units
                </p>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase block mb-1">
                  Regulatory Class
                </span>
                <p className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>
                    {product.prescription_required ? "Rx Required" : "OTC"}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* إدارة الباتشات الحية */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                BATCH MANAGEMENT
              </h3>
              <div className="flex items-center gap-3 text-[11px] font-medium">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />{" "}
                  Healthy
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />{" "}
                  Expiring Soon
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="text-muted-foreground border-b border-border">
                    <th className="pb-3 font-medium">ID</th>
                    <th className="pb-3 font-medium">AVAILABLE STOCK</th>
                    <th className="pb-3 font-medium">EXPIRY DATE</th>
                    <th className="pb-3 font-medium text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {batches.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-4 text-center text-muted-foreground"
                      >
                        {isArabic
                          ? "لا يوجد تشغيلات متاحة حالياً"
                          : "No active batches available"}
                      </td>
                    </tr>
                  ) : (
                    batches.map((batch: any) => (
                      <tr
                        key={batch.id}
                        className="text-foreground hover:bg-muted/30 transition-colors"
                      >
                        <td className="py-3.5 font-medium">
                          {batch.batch_number || `Batch-${batch.id}`}
                        </td>
                        <td className="py-3.5 text-muted-foreground">
                          {batch.quantity_on_hand} {product.base_unit?.name}
                        </td>
                        <td
                          className={`py-3.5 font-medium ${isExpiringSoon(batch.expiry_date) ? "text-amber-500" : "text-muted-foreground"}`}
                        >
                          {batch.expiry_date || "—"}
                        </td>
                        <td className="py-3.5 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger className="p-1 hover:bg-muted rounded-lg text-muted-foreground transition-colors">
                              <MoreVertical className="h-3.5 w-3.5" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="text-xs"
                            >
                              <DropdownMenuItem className="cursor-pointer">
                                {isArabic ? "تعديل الباتش" : "Edit Batch"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <button className="w-full flex items-center justify-center gap-2 border border-dashed border-border hover:border-muted-foreground/40 bg-muted/10 hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-medium py-3 rounded-xl transition-all">
              <Plus className="h-3.5 w-3.5" />
              <span>[Add Stock]</span>
            </button>
          </div>
        </div>
      </div>
      <AddProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        categories={categories}
        companies={companies}
        t={t}
        isArabic={isArabic}
        productToEdit={product}
      />
    </div>
  );
}
