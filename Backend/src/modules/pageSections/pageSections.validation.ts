import { z } from 'zod';

export const createPageSectionSchema = z.object({
    title: z.string().min(2).max(200).trim(),
    position: z.number().int().nonnegative(),
});

export const updatePageSectionSchema = createPageSectionSchema.partial();

export type CreatePageSectionDTO = z.infer<typeof createPageSectionSchema>;
export type UpdatePageSectionDTO = z.infer<typeof updatePageSectionSchema>;