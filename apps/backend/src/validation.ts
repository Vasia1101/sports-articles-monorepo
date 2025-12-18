import { z } from "zod";

export const articleInputSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  imageUrl: z.string().url("Image URL must be valid").optional()
});

export type ArticleInput = z.infer<typeof articleInputSchema>;
