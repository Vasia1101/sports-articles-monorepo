import { z } from "zod";

export const articleInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  content: z.string().trim().min(1, "Content is required"),
  imageUrl: z.string().trim().url("Invalid image URL").optional()
});

export type ArticleInput = z.infer<typeof articleInputSchema>;
