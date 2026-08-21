import {
  File,
  Plus,
  Edit,
  Loader2,
  Stethoscope,
  AlertTriangle,
  ShieldAlert,
  Baby,
  Milk,
  Activity,
  Zap,
  Pill,
  Info,
} from "lucide-react";
import { type ProductDetails } from "../../types/Product";
import { useTranslation } from "react-i18next";
import { useProductMedicalInfo } from "../../hooks/useProductMedicalInfo";

interface MedicalInformationCardProps {
  product: ProductDetails;
  isArabic: boolean;
  onOpenModal: () => void;
}

export default function MedicalInformationCard({
  product,
  onOpenModal,
}: MedicalInformationCardProps) {
  const { t } = useTranslation();
  const { data: medicalInfo, isLoading } = useProductMedicalInfo(product.id);

  const hasMedicalInfo =
    !!medicalInfo &&
    Object.entries(medicalInfo).some(
      ([key, val]) =>
        key !== "id" && key !== "updated_at" && val !== null && val !== "",
    );

  const medicalSections = [
    {
      key: "indications",
      label: t("medical_info.fields.indications", "دواعي الاستعمال"),
      icon: Stethoscope,
      color: "text-emerald-500",
    },
    {
      key: "dose_info",
      label: t("medical_info.fields.dose_info", "الجرعة"),
      icon: Pill,
      color: "text-blue-500",
    },
    {
      key: "contraindications",
      label: t("medical_info.fields.contraindications", "موانع الاستعمال"),
      icon: ShieldAlert,
      color: "text-rose-500",
    },
    {
      key: "side_effects",
      label: t("medical_info.fields.side_effects", "الآثار الجانبية"),
      icon: Activity,
      color: "text-amber-500",
    },
    {
      key: "warnings",
      label: t("medical_info.fields.warnings", "التحذيرات"),
      icon: AlertTriangle,
      color: "text-orange-500",
    },
    {
      key: "drug_interactions",
      label: t("medical_info.fields.drug_interactions", "التداخلات الدوائية"),
      icon: Zap,
      color: "text-purple-500",
    },
    {
      key: "pregnancy_safety",
      label: t("medical_info.fields.pregnancy_safety", "الأمان للحوامل"),
      icon: Baby,
      color: "text-pink-500",
    },
    {
      key: "lactation_safety",
      label: t("medical_info.fields.lactation_safety", "الأمان للرضاعة"),
      icon: Milk,
      color: "text-cyan-500",
    },
    {
      key: "overdose",
      label: t("medical_info.fields.overdose", "الجرعة الزائدة"),
      icon: Info,
      color: "text-red-600",
    },
  ] as const;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase flex items-center gap-2">
          <File className="h-4 w-4 text-emerald-500" />
          {t("inventory.medicalInfo.title", "المعلومات الطبية")}
        </h3>
        <button
          onClick={onOpenModal}
          className="flex items-center gap-1 text-[11px] font-bold text-emerald-500 hover:text-emerald-600 transition-colors bg-emerald-500/10 px-2.5 py-1 rounded-md"
        >
          {hasMedicalInfo ? (
            <>
              <Edit className="h-3 w-3" /> {t("common.edit", "تعديل")}
            </>
          ) : (
            <>
              <Plus className="h-3 w-3" />{" "}
              {t("inventory.medicalInfo.addBtn", "إضافة")}
            </>
          )}
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : !hasMedicalInfo ? (
        <div className="flex flex-col items-center justify-center py-6 text-center bg-muted/10 rounded-xl border border-dashed border-border/60">
          <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
            {t(
              "inventory.medicalInfo.noData",
              "لا توجد معلومات طبية مسجلة لهذا المنتج حتى الآن.",
            )}
          </p>
        </div>
      ) : (
        <div className="space-y-3 text-xs">
          {medicalSections.map(({ key, label, icon: Icon, color }) => {
            const val = medicalInfo?.[key as keyof typeof medicalInfo];
            if (!val) return null;

            return (
              <div
                key={key}
                className="space-y-1 bg-muted/20 p-3 rounded-xl border border-border/40"
              >
                <span
                  className={`font-bold flex items-center gap-1.5 ${color}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </span>
                <p className="text-foreground leading-relaxed whitespace-pre-line text-xs">
                  {val}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
