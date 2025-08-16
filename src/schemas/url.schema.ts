import { z } from "zod";

export const createUrlSchema = z.object({
    originalUrl: z.string().url(),
    shortUrl: z.string().min(1),
});