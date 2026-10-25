import { z } from "zod";

export const setStatusSchema = z.object({ isActive: z.boolean() });

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});
