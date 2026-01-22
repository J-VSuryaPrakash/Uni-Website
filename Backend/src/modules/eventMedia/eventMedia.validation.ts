import {z} from 'zod';

const eventMediaSchema = z.object({
    eventId: z.number().int().positive(),
    mediaId: z.number().int().positive(),
    position: z.number().int().nonnegative().optional(),
    altText: z.string().max(255).optional()
});

export const createEventMediaSchema = eventMediaSchema

export type CreateEventMediaInput = z.infer<typeof createEventMediaSchema>;