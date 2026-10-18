import z from "zod";

export const productSchema = z.object({
    name: z.string().check(z.minLength(3), z.maxLength(30)),
    brand: z.string().optional(),
    category: z.string(),
    price: z.string().min(1).max(300000),
    stock: z.string().optional().default(1),
});