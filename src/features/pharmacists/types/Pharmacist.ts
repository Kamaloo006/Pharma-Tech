import z from "zod";

export const pharmacistSchema = z.object({
  id: z.number().optional(),
  first_name: z.string().min(2, "الاسم الأول مطلوب"),
  father_name: z.string().optional().nullable(),
  last_name: z.string().min(2, "اللقب مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  phone_number: z.string().min(8, "رقم الهاتف غير صحيح"),
  pharmacy_id: z.number().optional(),
  role: z.literal("pharmacist").optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type Pharmacist = z.infer<typeof pharmacistSchema>;


export interface PharmacistsResponse {
  status: string;
  data: Pharmacist[];
}


export interface CreatePharmacistResponse {
  message: string;
  data: Pharmacist;
}

export type PharmacistPayload = Omit<
  Pharmacist,
  "id" | "role" | "created_at" | "updated_at" | "pharmacy_id"
>;