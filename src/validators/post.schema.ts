import { z } from "zod";

export const createPostSchema = z.object({
  content: z.string().min(1).max(300),
});

export const updatePostSchema = z.object({
  content: z.string().min(1).max(300),
});

export const scheduleSchema  = z.object({
  scheduledAt: z.coerce.date(), 
});

export const listPostsQuerySchema = z.object({
  status: z.enum(["draft", "scheduled", "published", "failed"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});
