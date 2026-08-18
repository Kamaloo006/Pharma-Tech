import z from "zod";

const userSchema = z.object({
    first_name: z.string(),
    father_name: z.string().optional().nullable(),
    last_name: z.string(),
    email: z.string(),
    phone_number: z.string(),
    role: z.enum(["pharmacy_owner", "pharmacist", "system_admin"]),
});

export type User = z.infer<typeof userSchema>;