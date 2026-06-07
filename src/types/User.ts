import z from "zod";

const userSchema = z.object({
    first_name: z.string(),
    father_name: z.string().optional().nullable(),
    last_name: z.string(),
    email: z.string(),
    phone_number: z.string(),
});

export type User = z.infer<typeof userSchema>;