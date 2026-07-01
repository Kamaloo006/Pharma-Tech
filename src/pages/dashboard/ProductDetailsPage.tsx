import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Layers,
  DollarSign,
  Tag,
  Building2,
  AlertCircle,
  Calendar,
  FileText,
} from "lucide-react";
import api from "@/lib/api";

// واجهات البيانات المتوافقة مع الـ JSON الخاص بك
interface Unit {
  id: number;
  name: string;
  type: string;
}

interface ProductDetails {
  id: number;
  barcode: string;
  brand_name: string;
  scientific_name: string | null;
  ar_name: string;
  strength: string | null;
  prescription_required: boolean;
  buying_price: number;
  selling_price: number;
  total_quantity: number;
  tax_rate: number;
  discount_rate: number;
  min_stock: number;
  max_stock: number | null;
  units_per_base: number;
  allow_partial_selling: boolean;
  nearest_expiry: string | null;
  shelf: string | null;
  image_path: string | null;
  base_unit: Unit | null;
  selling_unit: Unit | null;
  category: { id: number; name: string } | null;
  company: { id: number; name: string; address?: string } | null;
  medical_info: any | null;
}

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isArabic = true;
  const {
    data: product,
    isLoading,
    error,
  } = useQuery<ProductDetails>({
    queryKey: ["product-details", id],
    queryFn: async () => {
      const { data } = await api.get(`/products/${id}`);
      return data.data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-2 text-muted-foreground">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p>
          {isArabic
            ? "حدث خطأ أثناء تحميل بيانات المنتج"
            : "Error loading product details"}
        </p>
      </div>
    );
  }

  // حساب حالة المخزون ديناميكياً للعرض المرئي مرئياً
  const isOut = product.total_quantity === 0;
  const isLow = product.total_quantity < product.min_stock;

  return (
    <div
      className="space-y-6 p-6 max-w-6xl mx-auto"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* الرأس وزر العودة */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-muted rounded-xl border transition-colors"
          >
            <ArrowLeft className={`h-4 w-4 ${isArabic ? "rotate-180" : ""}`} />
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                {isArabic ? product.ar_name : product.brand_name}
              </h1>
              {product.prescription_required && (
                <span className="text-[10px] font-medium bg-red-50 text-red-600 px-2 py-0.5 rounded-full border border-red-200">
                  {isArabic ? "وصفة طبية" : "Rx Required"}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {product.scientific_name ||
                (isArabic ? "لا يوجد اسم علمي" : "No scientific name")}
              {product.strength && ` • ${product.strength}`}
            </p>
          </div>
        </div>

        {/* عرض سريع لحالة المخزون الحالي */}
        <div className="flex items-center gap-2">
          <div
            className={`flex flex-col items-end px-3 py-1.5 rounded-xl border ${
              isOut
                ? "bg-red-50/50 border-red-200 text-red-700"
                : isLow
                  ? "bg-amber-50/50 border-amber-200 text-amber-700"
                  : "bg-green-50/50 border-green-200 text-green-700"
            }`}
          >
            <span className="text-[10px] text-muted-foreground font-medium">
              {isArabic ? "المخزون الحالي" : "Current Stock"}
            </span>
            <span className="text-sm font-bold">
              {product.total_quantity} {product.base_unit?.name}
            </span>
          </div>
        </div>
      </div>

      {/* شبكة البيانات الأساسية */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* الكارت الأول: الأسعار والمخزون */}
        <div className="rounded-2xl border bg-card p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-xs font-bold text-foreground">
              {isArabic ? "التسعير والحدود المخزنية" : "Pricing & Stock Limits"}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-0.5">
              <span className="text-[10px] text-muted-foreground">
                {isArabic ? "سعر الشراء" : "Buying Price"}
              </span>
              <p className="text-sm font-semibold">
                {product.buying_price.toLocaleString()} s.p
              </p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] text-muted-foreground">
                {isArabic ? "سعر البيع" : "Selling Price"}
              </span>
              <p className="text-sm font-semibold text-primary">
                {product.selling_price.toLocaleString()} s.p
              </p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] text-muted-foreground">
                {isArabic ? "الحد الأدنى" : "Min Stock"}
              </span>
              <p className="text-sm font-medium">{product.min_stock}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] text-muted-foreground">
                {isArabic ? "الحد الأعلى" : "Max Stock"}
              </span>
              <p className="text-sm font-medium">{product.max_stock || "—"}</p>
            </div>
          </div>

          <div className="border-t pt-3 grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
            <div>
              {isArabic ? "الضرائب:" : "Tax:"}{" "}
              <span className="font-medium text-foreground">
                {product.tax_rate}%
              </span>
            </div>
            <div>
              {isArabic ? "الخصم المتاح:" : "Discount:"}{" "}
              <span className="font-medium text-foreground">
                {product.discount_rate}%
              </span>
            </div>
          </div>
        </div>

        {/* الكارت الثاني: التعبئة وتركيبة الوحدات */}
        <div className="rounded-2xl border bg-card p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <Layers className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-xs font-bold text-foreground">
              {isArabic ? "التعبئة والوحدات الداخلية" : "Packaging & Fractions"}
            </h2>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center bg-muted/50 px-3 py-2 rounded-xl">
              <span className="text-xs text-muted-foreground">
                {isArabic ? "الوحدة الأساسية (الغلاف)" : "Base Unit"}
              </span>
              <span className="text-xs font-bold text-foreground">
                {product.base_unit?.name || "—"}
              </span>
            </div>

            <div className="flex justify-between items-center bg-muted/50 px-3 py-2 rounded-xl">
              <span className="text-xs text-muted-foreground">
                {isArabic ? "الوحدة المجزأة (الداخلية)" : "Selling Unit"}
              </span>
              <span className="text-xs font-bold text-foreground">
                {product.selling_unit?.name || "—"}
              </span>
            </div>

            <div className="pt-1 flex flex-col gap-1.5">
              <div className="text-xs text-muted-foreground">
                {isArabic ? "معامل التجزئة:" : "Packing Factor:"}
                <span className="font-bold text-foreground mx-1">
                  1 {product.base_unit?.name}
                </span>
                {isArabic ? "يحتوي على" : "contains"}
                <span className="font-bold text-primary mx-1">
                  {product.units_per_base} {product.selling_unit?.name}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <div
                  className={`h-2 w-2 rounded-full ${product.allow_partial_selling ? "bg-green-500" : "bg-gray-300"}`}
                />
                <span className="text-[11px] text-muted-foreground">
                  {product.allow_partial_selling
                    ? isArabic
                      ? "مسموح بيع أجزاء (شرائط/حبوب منفصلة)"
                      : "Partial selling allowed"
                    : isArabic
                      ? "غير مسموح بالتجزئة (بيع العبوة كاملة فقط)"
                      : "Full pack selling only"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* الكارت الثالث: التصنيف واللوجستيات */}
        <div className="rounded-2xl border bg-card p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-xs font-bold text-foreground">
              {isArabic ? "التصنيف وبيانات الشركة" : "Category & Supplier"}
            </h2>
          </div>

          <div className="space-y-3.5">
            <div className="flex items-start gap-2.5">
              <Tag className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
              <div>
                <span className="block text-[10px] text-muted-foreground">
                  {isArabic ? "العائلة الدوائية / الفئة" : "Category"}
                </span>
                <p className="text-xs font-semibold text-foreground">
                  {product.category?.name || "—"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Building2 className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
              <div>
                <span className="block text-[10px] text-muted-foreground">
                  {isArabic ? "الشركة المصنعة" : "Manufacturer"}
                </span>
                <p className="text-xs font-semibold text-foreground">
                  {product.company?.name || "—"}
                </p>
                {product.company?.address && (
                  <span className="text-[10px] text-muted-foreground block mt-0.5">
                    {product.company.address}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-start gap-2.5 border-t pt-2.5">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
              <div>
                <span className="block text-[10px] text-muted-foreground">
                  {isArabic ? "أقرب تاريخ صلاحية ينتهي" : "Nearest Expiry Date"}
                </span>
                <p
                  className={`text-xs font-semibold ${product.nearest_expiry ? "text-amber-600" : "text-foreground"}`}
                >
                  {product.nearest_expiry ||
                    (isArabic ? "لا يوجد تشغيلات بعد" : "No batches available")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* الـ Barcode والرف السفلي */}
      <div className="rounded-2xl border bg-muted/30 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="text-xs text-muted-foreground">
          {isArabic ? "الباركود الدولي:" : "International Barcode:"}{" "}
          <span className="font-mono bg-background px-2 py-1 rounded-lg border text-foreground font-semibold mx-1">
            {product.barcode}
          </span>
        </div>
        <div className="text-xs text-muted-foreground">
          {isArabic ? "موقع الرف المخزني:" : "Shelf Location:"}{" "}
          <span className="font-medium text-foreground">
            {product.shelf || (isArabic ? "غير محدد" : "Not Assigned")}
          </span>
        </div>
      </div>

      {/* كارت المعلومات الطبية الإضافية (يظهر فقط إذا توفرت الداتا) */}
      {product.medical_info && (
        <div className="rounded-2xl border bg-card p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 border-b pb-3">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-xs font-bold text-foreground">
              {isArabic ? "التعليمات والمعلومات الطبية" : "Medical Information"}
            </h2>
          </div>
          <div className="text-xs text-muted-foreground leading-relaxed">
            {typeof product.medical_info === "object"
              ? JSON.stringify(product.medical_info)
              : product.medical_info}
          </div>
        </div>
      )}
    </div>
  );
}
