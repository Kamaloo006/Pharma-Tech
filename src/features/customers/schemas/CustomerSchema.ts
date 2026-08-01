import { z } from "zod";
import { type TFunction } from "i18next";

export const getCustomerSchema = (t: TFunction) =>
  z.object({
    full_name: z
      .string()
      .min(2, { message: t("customers.validation.fullNameMin") })
      .max(100, { message: t("customers.validation.fullNameMax") }),
    phone: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^[0-9+()\s-]{7,20}$/.test(val),
        { message: t("customers.validation.phoneInvalid") }
      ),
    notes: z
      .string()
      .max(500, { message: t("customers.validation.notesMax") })
      .optional(),
  });

export const customerSchema = z.object({
  full_name: z.string().min(2).max(100),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[0-9+()\s-]{7,20}$/.test(val)),
  notes: z.string().max(500).optional(),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;