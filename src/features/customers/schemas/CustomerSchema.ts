import { z } from "zod";

export const customerSchema = z.object({
  full_name: z
    .string()
    .min(2, { message: "الاسم يجب أن يكون حرفين على الأقل" })
    .max(100, { message: "الاسم طويل جداً" }),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[0-9+()\s-]{7,20}$/.test(val),
      { message: "رقم الهاتف غير صالح" }
    ),
  notes: z
    .string()
    .max(500, { message: "الملاحظات يجب ألا تتجاوز 500 حرف" })
    .optional(),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;