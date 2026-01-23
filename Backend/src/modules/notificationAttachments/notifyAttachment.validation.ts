import { z } from 'zod';

const notifyAttachmentSchema = z.object({
    notificationId: z.number().int().positive(),
    title: z.string().min(1).max(255),
    mediaId: z.number().int().positive(),
    position: z.number().int().nonnegative().default(0)
});

export const createNotifyAttachment = notifyAttachmentSchema;
export const updateNotifyAttachment = notifyAttachmentSchema.partial()

export type CreateNotifyAttachmentDTO = z.infer<typeof createNotifyAttachment>;
export type UpdateNotifyAttachmentDTO = z.infer<typeof updateNotifyAttachment>;