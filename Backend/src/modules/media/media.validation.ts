import {z} from 'zod';

const mediaTypeEnum = z.enum(['image', 'video', 'audio', 'document']);

const mediaSchema = z.object({
    url: z.string(),
    type: mediaTypeEnum
})

export const createMediaSchema = mediaSchema

export type CreateMediaInput = z.infer<typeof createMediaSchema>;