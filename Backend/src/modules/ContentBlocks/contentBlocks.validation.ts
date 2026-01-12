import { z } from 'zod';

export const blockTypes = ["text", "image", "list", "html"] as const;

export const createContentBlockSchema = z.object({
    blockType: z.enum(blockTypes),
    content: z.record(z.any(), z.any()),
    position: z.number().int().nonnegative(),
    isVisible: z.boolean().optional(),
});

export const updateContentBlockSchema = createContentBlockSchema.partial();

export type createContentBlockDTO = z.infer<typeof createContentBlockSchema>;
export type UpdatecontentBlockDTO = z.infer<typeof updateContentBlockSchema>;