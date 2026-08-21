export interface ProductMedicalInfo {
  id?: number;
  indications?: string | null;
  contraindications?: string | null;
  overdose?: string | null;
  pregnancy_safety?: string | null;
  lactation_safety?: string | null;
  warnings?: string | null;
  side_effects?: string | null;
  drug_interactions?: string | null;
  dose_info?: string | null;
  updated_at?: string;
}

export type MedicalInfoFormValues = Omit<ProductMedicalInfo, "id" | "updated_at">;