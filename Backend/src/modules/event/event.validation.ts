import {z } from 'zod';

const eventBaseSchema = z.object({
    categoryId: z.number().int().positive(),
    title: z.string().min(3).max(100),
    description: z.string().min(10).max(1000).optional(),
    eventDate: z.coerce.date().optional(),
    position: z.number().int(),
    isActive: z.boolean().default(true)
});

export const createEventSchema = eventBaseSchema;
export const updateEventSchema = eventBaseSchema.partial();

export type createEventInput = z.infer<typeof createEventSchema>;
export type updateEventInput = z.infer<typeof updateEventSchema>;