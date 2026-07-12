// components/productDetails/MedicalInformationCard.tsx
import { File, Plus } from "lucide-react";
import { type ProductDetails } from "../../types/Product";

interface MedicalInformationCardProps {
  product: ProductDetails;
  isArabic: boolean;
}

export default function MedicalInformationCard({
  product,
  isArabic,
}: MedicalInformationCardProps) {
  const hasMedicalInfo = product.medical_info !== null;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase flex items-center gap-2">
          <File className="h-4 w-4 text-emerald-500" />
          {isArabic ? "المعلومات الطبية والسريرية" : "MEDICAL INFORMATION"}
        </h3>
        {!hasMedicalInfo && (
          <button
            onClick={() => console.log("Open medical info configuration modal")}
            className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-500 transition-colors"
          >
            <Plus className="h-3 w-3" />
            {isArabic ? "إضافة بيانات طبية" : "Add Medical Info"}
          </button>
        )}
      </div>

      {!hasMedicalInfo ? (
        <div className="flex flex-col items-center justify-center py-6 text-center bg-muted/10 rounded-xl border border-dashed border-border/60">
          <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
            {isArabic
              ? "لا توجد معلومات طبية (جرعات، موانع استعمال، تفاعلات) مسجلة لهذا المنتج حالياً."
              : "No clinical medical information setup for this product yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1 bg-muted/20 p-3 rounded-xl border border-border/40">
            <span className="font-bold text-muted-foreground">
              {isArabic ? "الجرعة الدوائية" : "Dosage"}
            </span>
            <p className="text-foreground">
              {product.medical_info?.dosage || "—"}
            </p>
          </div>
          <div className="space-y-1 bg-muted/20 p-3 rounded-xl border border-border/40">
            <span className="font-bold text-red-400">
              {isArabic ? "موانع الاستعمال" : "Contraindications"}
            </span>
            <p className="text-foreground">
              {product.medical_info?.contraindications || "—"}
            </p>
          </div>
          <div className="space-y-1 bg-muted/20 p-3 rounded-xl border border-border/40">
            <span className="font-bold text-amber-500">
              {isArabic ? "الحمل والرضاعة" : "Pregnancy & Lactation"}
            </span>
            <p className="text-foreground">
              {product.medical_info?.pregnancy || "—"}
            </p>
          </div>
          <div className="space-y-1 bg-muted/20 p-3 rounded-xl border border-border/40">
            <span className="font-bold text-emerald-400">
              {isArabic ? "ظروف التخزين" : "Storage Conditions"}
            </span>
            <p className="text-foreground">
              {product.medical_info?.storage || "—"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
