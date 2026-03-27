import {z} from 'zod';

const mediaTypeEnum = z.enum(['image', 'video', 'audio', 'document', 'pdf']);

const mediaSchema = z.object({
    url: z.string(),
    type: mediaTypeEnum,
    fileId: z.string().optional(),
})

export const createMediaSchema = mediaSchema

export type CreateMediaInput = z.infer<typeof createMediaSchema>;