import { z } from "zod";

const allowedCategories = [
    "Groceries",
    "Dinning",
    "Shopping",
    "Utilities",
    "Transport",
    "Education",
] as const;

export const transactionSchema = z.object({
    merchant: z
        .string()
        .trim()
        .min(4, "Merchant must be at least 4 characters")
        .max(200, "Merchant is too long")
        .refine((val) => {
            const words = val.split(/\s+/);
            // ensure each word has at least one vowel
            return words.every(word => /[aeiouAEIOU]/.test(word));
        }, "Merchant name must contain real words"),
    amount: z
        .string()
        .min(1, "Amount required")
        .transform((val) => Number(val.replace(/,/g, "")))
        .refine((val) => !Number.isNaN(val), "Invalid amount")
        .refine((val) => val >= 10, "Amount cannot be less than 10")
        .refine((val) => val <= 5_000_000, "Amount cannot exceed 5,000,000"
        ),

    categories: z
        .enum(allowedCategories, {
            message: "Invalid category selected",
        })
});