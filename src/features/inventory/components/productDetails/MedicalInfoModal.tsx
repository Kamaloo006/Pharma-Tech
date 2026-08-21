import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Loader2,
  Save,
  Trash2,
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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  useProductMedicalInfo,
  useUpsertMedicalInfo,
  useDeleteMedicalInfo,
} from "../../hooks/useProductMedicalInfo";
import type { MedicalInfoFormValues } from "../../types/MedicalInfo";

const medicalInfoSchema = z.object({
  indications: z.string().nullable().optional(),
  contraindications: z.string().nullable().optional(),
  overdose: z.string().nullable().optional(),
  pregnancy_safety: z.string().nullable().optional(),
  lactation_safety: z.string().nullable().optional(),
  warnings: z.string().nullable().optional(),
  side_effects: z.string().nullable().optional(),
  drug_interactions: z.string().nullable().optional(),
  dose_info: z.string().nullable().optional(),
});

interface MedicalInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
}

export default function MedicalInfoModal({
  isOpen,
  onClose,
  productId,
}: MedicalInfoModalProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const { data: medicalInfo, isLoading } = useProductMedicalInfo(
    productId,
    isOpen,
  );
  const upsertMutation = useUpsertMedicalInfo(productId);
  const deleteMutation = useDeleteMedicalInfo(productId);

  const form = useForm<MedicalInfoFormValues>({
    resolver: zodResolver(medicalInfoSchema),
    defaultValues: {
      indications: "",
      contraindications: "",
      overdose: "",
      pregnancy_safety: "",
      lactation_safety: "",
      warnings: "",
      side_effects: "",
      drug_interactions: "",
      dose_info: "",
    },
  });

  useEffect(() => {
    if (medicalInfo) {
      form.reset({
        indications: medicalInfo.indications ?? "",
        contraindications: medicalInfo.contraindications ?? "",
        overdose: medicalInfo.overdose ?? "",
        pregnancy_safety: medicalInfo.pregnancy_safety ?? "",
        lactation_safety: medicalInfo.lactation_safety ?? "",
        warnings: medicalInfo.warnings ?? "",
        side_effects: medicalInfo.side_effects ?? "",
        drug_interactions: medicalInfo.drug_interactions ?? "",
        dose_info: medicalInfo.dose_info ?? "",
      });
    } else {
      form.reset({
        indications: "",
        contraindications: "",
        overdose: "",
        pregnancy_safety: "",
        lactation_safety: "",
        warnings: "",
        side_effects: "",
        drug_interactions: "",
        dose_info: "",
      });
    }
  }, [medicalInfo, form, isOpen]);

  const onSubmit = (data: MedicalInfoFormValues) => {
    upsertMutation.mutate(data, {
      onSuccess: () => onClose(),
    });
  };

  const handleDelete = () => {
    if (
      confirm(
        t(
          "medical_info.delete_dialog.description",
          "هل أنت تأكد من حذف المعلومات الطبية؟",
        ),
      )
    ) {
      deleteMutation.mutate(undefined, { onSuccess: () => onClose() });
    }
  };

  const fieldsConfig = [
    {
      name: "indications",
      label: t("medical_info.fields.indications", "دواعي الاستعمال"),
      icon: Stethoscope,
    },
    {
      name: "dose_info",
      label: t("medical_info.fields.dose_info", "الجرعة وطريقة الاستخدام"),
      icon: Pill,
    },
    {
      name: "contraindications",
      label: t("medical_info.fields.contraindications", "موانع الاستعمال"),
      icon: ShieldAlert,
    },
    {
      name: "side_effects",
      label: t("medical_info.fields.side_effects", "الآثار الجانبية"),
      icon: Activity,
    },
    {
      name: "warnings",
      label: t("medical_info.fields.warnings", "التحذيرات والاحتياطات"),
      icon: AlertTriangle,
    },
    {
      name: "drug_interactions",
      label: t("medical_info.fields.drug_interactions", "التداخلات الدوائية"),
      icon: Zap,
    },
    {
      name: "pregnancy_safety",
      label: t("medical_info.fields.pregnancy_safety", "الأمان أثناء الحمل"),
      icon: Baby,
    },
    {
      name: "lactation_safety",
      label: t("medical_info.fields.lactation_safety", "الأمان أثناء الرضاعة"),
      icon: Milk,
    },
    {
      name: "overdose",
      label: t("medical_info.fields.overdose", "الجرعة الزائدة والتسمم"),
      icon: Info,
    },
  ] as const;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && !upsertMutation.isPending && onClose()}
    >
      <DialogContent
        className="sm:max-w-3xl bg-card border border-border rounded-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <DialogHeader className="border-b border-border pb-4 flex justify-between items-center flex-row">
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-emerald-500" />
            {t("medical_info.title", "إدارة المعلومات الطبية")}
          </DialogTitle>
          {medicalInfo && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-xl size-8"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
            </Button>
          )}
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="size-8 animate-spin text-emerald-500" />
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 mt-3"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fieldsConfig.map(({ name, label, icon: Icon }) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name}
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                          <Icon className="w-3.5 h-3.5 text-emerald-500" />
                          {label}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            rows={3}
                            className="text-xs rounded-xl resize-none bg-muted/30 border-border focus-visible:ring-emerald-500"
                            placeholder={label}
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              <DialogFooter className="pt-4 border-t border-border mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="rounded-xl h-9 text-xs px-4"
                >
                  {t("common.cancel", "إلغاء")}
                </Button>
                <Button
                  type="submit"
                  disabled={upsertMutation.isPending}
                  className="rounded-xl h-9 text-xs bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold px-4 gap-2"
                >
                  {upsertMutation.isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Save className="size-4" />
                  )}
                  {t("common.save_changes", "حفظ التغييرات")}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
