import z from "zod";

const pharmacySchema= z.object({
    address: z.string(),
    city_id: z.number(),
    governorate_id: z.number(),
    license_number: z.string(),
    name: z.string(),
    status: z.enum(["active", "suspended", "pending", "archived"]),
});

export type Pharmacy = z.infer<typeof pharmacySchema>;