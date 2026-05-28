import { z } from "zod";
import i18n from "@/utils/i18n";

const t = (key: string) => i18n.t(key);
const err = (key: string) => () => t(key);

const localizedString = (messageKey: string) =>
  z.string({
    error: err(messageKey),
  });

const authBase = {
  email: localizedString("validation.invalidEmail").email({
    error: err("validation.invalidEmail"),
  }),
  password: z
    .string({
      error: err("validation.passwordMinLength"),
    })
    .min(8, { error: err("validation.passwordMinLength") })
    .regex(/[A-Za-z]/, { error: err("validation.passwordRequiresLetter") })
    .regex(/[0-9]/, { error: err("validation.passwordRequiresNumber") }),
};

export const loginSchema = z.object({
  ...authBase,
});

export const registerSchema = z.object({
  ...authBase,

  password_confirmation: z
    .string({
      error: err("validation.passwordConfirmationMinLength"),
    })
    .min(8, { error: err("validation.passwordConfirmationMinLength") }),

  first_name: z
    .string({
      error: err("validation.firstNameRequired"),
    })
    .min(1, { error: err("validation.firstNameRequired") })
    .max(255, { error: err("validation.firstNameTooLong") }),

  father_name: z
    .string({
      error: err("validation.fatherNameTooLong"),
    })
    .max(255, { error: err("validation.fatherNameTooLong") })
    .optional()
    .or(z.literal("")),

  last_name: z
    .string({
      error: err("validation.lastNameRequired"),
    })
    .min(1, { error: err("validation.lastNameRequired") })
    .max(255, { error: err("validation.lastNameTooLong") }),

  phone_number: z
    .string({
      error: err("validation.phoneNumberRequired"),
    })
    .min(1, { error: err("validation.phoneNumberRequired") })
    .regex(/^(?:\+9639|09|009639)\d{8}$/, {
      error: err("validation.invalidSyrianPhoneNumber"),
    }),

  licence_number: z
    .string({
      error: err("validation.licenseNumberRequired"),
    })
    .min(1, { error: err("validation.licenseNumberRequired") })
    .max(255, { error: err("validation.licenseNumberTooLong") }),

  pharmacy_name: z
    .string({
      error: err("validation.pharmacyNameRequired"),
    })
    .min(1, { error: err("validation.pharmacyNameRequired") })
    .max(255, { error: err("validation.pharmacyNameTooLong") }),

  city_id: z
    .string({
      error: err("validation.cityRequired"),
    })
    .min(1, { error: err("validation.cityRequired") }),

  address: z
    .string({
      error: err("validation.addressTooLong"),
    })
    .max(255, { error: err("validation.addressTooLong") })
    .optional()
    .or(z.literal("")),
}).superRefine((data, ctx) => {
  if (data.password !== data.password_confirmation) {
    ctx.addIssue({
      code: "custom",
      message: t("validation.passwordsDoNotMatch"),
      path: ["password_confirmation"],
    });
  }
});


export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "invalidEmail" }), 
});


export const resetPasswordSchema = z.object({
  email: z.string().email(),
  token: z.string().min(1),
  password: z.string().min(8, { message: "passwordMinLength" }),
  password_confirmation: z.string().min(8),
}).refine((data) => data.password === data.password_confirmation, {
    message: "auth.passwordMismatch",
    path: ["password_confirmation"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;