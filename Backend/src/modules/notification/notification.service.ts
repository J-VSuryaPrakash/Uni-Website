import prisma from "../../DB/prisma";
import { ApiError } from "../../utils/apiError";
import type { createNotificationInput, updateNotificationInput } from "./notification.validation";


export class NotificationService {

    async createNotification(data: createNotificationInput) {

        const newNotification = await prisma.notification.create({
            data: {
                title: data.title,
                category: (data.category ?? null),
                departmentId: (data.departmentId ?? null),
                status: data.status,
                priority: data.priority,
                startsAt: (data.startsAt ?? null),
                endsAt: (data.endsAt ?? null),
                isScrolling: data.isScrolling,
                isActive: data.isActive
            }
        });

        return newNotification;
    }

    async getNotificationsByCategory(category: string) {

        const notifications = await prisma.notification.findMany({
            where: {
                category: category,
                isActive: true
            },
            include:{
                department: true,
                attachments: { include: { media: true } }
            },
            orderBy: {
                priority: 'asc'
            }
        });

        return notifications;
    }

    async getNotifications() {

        const notifications = await prisma.notification.findMany({
            include:{
                department: true,
                attachments: { include: { media: true } }
            },
            orderBy: {
                priority: 'asc'
            }
        });

        return notifications;
    }

    async updateNotification(id: number, data: updateNotificationInput) {

        const existingNotification = await prisma.notification.findUnique({
            where: { id }
        });

        if (!existingNotification) {
            throw new ApiError(404, 'Notification not found');
        }

        const updatedNotification = await prisma.notification.update({
            where: { id },
            data: {
                title: data.title ?? existingNotification.title,
                category: data.category ?? existingNotification.category,
                departmentId: data.departmentId ?? existingNotification.departmentId,
                status: data.status ?? existingNotification.status,
                priority: data.priority ?? existingNotification.priority,
                startsAt: data.startsAt ?? existingNotification.startsAt,
                endsAt: data.endsAt ?? existingNotification.endsAt,
                isScrolling: data.isScrolling ?? existingNotification.isScrolling,
                isActive: data.isActive ?? existingNotification.isActive
            }
        })

        return updatedNotification;

    }

    async toggleNotificationActiveStatus(id: number) {

        const existingNotification = await prisma.notification.findUnique({
            where: { id }
        });

        if (!existingNotification) {
            throw new ApiError(404, 'Notification not found');
        }

        const updatedNotification = await prisma.notification.update({
            where: { id },
            data: {
                isActive: !existingNotification.isActive
            }
        });

        return updatedNotification;
    }

    async getLiveScrollingNotifications() {

        const now = new Date();

        const notifications = await prisma.notification.findMany({
            where: {
                isScrolling: true,
                isActive: true,
                AND: [{ OR: [{ startsAt: null }, { startsAt: { lte: now } }] }, { OR: [{ endsAt: null }, { endsAt: { gte: now } }] }]
            },
            orderBy: {
                priority: 'asc'
            }
        })

        if (!notifications || notifications.length === 0) {
            return [];
        }

        return notifications;

    }
}
