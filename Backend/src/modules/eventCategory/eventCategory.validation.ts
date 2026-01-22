import { z } from 'zod';
import slugify from 'slugify';

const eventCategorySchema = z.object({
    name: z.string().min(1).max(100),
    slug: z.string().min(1).max(100).trim().optional(),
    position: z.number().int().nonnegative(),
    isActive: z.boolean().default(true)
});

const handleSlugAndPosition = (data: any) => ({
    ...data,
    slug: data.slug || slugify(data.name, { lower: true, strict: true }),
    position: data.position ?? 0,
}); 

export const createEventCategorySchema = eventCategorySchema.transform(handleSlugAndPosition);

export const updateEventCategorySchema = eventCategorySchema.partial().transform((data) => {
    if (data.name && !data.slug) {
        return {
            ...data,
            slug: slugify(data.name, { lower: true, strict: true }),
        };
    }
    return data;
});

export type CreateEventCategoryDTO = z.infer<typeof createEventCategorySchema>;
export type UpdateEventCategoryDTO = z.infer<typeof updateEventCategorySchema>;