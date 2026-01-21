import {z} from 'zod';

const notificationSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    category: z.string().optional(),
    departmentId: z.number().int().optional(),
    status: z.string().optional().default('open'),
    priority: z.number().default(0),
    startsAt: z.coerce.date().optional(),
    endsAt: z.coerce.date().optional(),
    isScrolling: z.boolean().default(false),
    isActive: z.boolean().default(true)
})

export const createNotificationSchema = notificationSchema;
export const updateNotificationSchema = notificationSchema.partial();

export type createNotificationInput = z.infer<typeof createNotificationSchema>;
export type updateNotificationInput = z.infer<typeof updateNotificationSchema>;