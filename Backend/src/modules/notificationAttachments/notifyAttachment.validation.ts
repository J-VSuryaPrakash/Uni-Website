import { z } from 'zod';

const mediaTypeEnum = z.enum(['image', 'video', 'audio', 'document', 'pdf']);

const notifyAttachmentSchema = z.object({
    notificationId: z.number().int().positive(),
    title: z.string().min(1).max(255),
    mediaId: z.number().int().positive(),
    position: z.number().int().nonnegative().default(0)
});

// Used when creating attachment + media together in one request
const attachmentWithMediaSchema = z.object({
    notificationId: z.number().int().positive(),
    title: z.string().min(1, 'Title is required').max(255),
    // Accepts both full URLs (https://...) and relative upload paths (/uploads/...)
    url: z.string().min(1, 'URL or file path is required'),
    mediaType: mediaTypeEnum,
    position: z.number().int().nonnegative().default(0)
});

export const createNotifyAttachment = notifyAttachmentSchema;
export const updateNotifyAttachment = notifyAttachmentSchema.partial();
export const createAttachmentWithMediaSchema = attachmentWithMediaSchema;

export type CreateNotifyAttachmentDTO = z.infer<typeof createNotifyAttachment>;
export type UpdateNotifyAttachmentDTO = z.infer<typeof updateNotifyAttachment>;
export type CreateAttachmentWithMediaDTO = z.infer<typeof createAttachmentWithMediaSchema>;
