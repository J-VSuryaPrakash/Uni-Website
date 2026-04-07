import prisma from "../../DB/prisma";
import { ApiError } from "../../utils/apiError";
import type { Prisma } from "../../../generated/prisma/client";
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
            include: {
                department: true,
                attachments: { include: { media: true } }
            },
            orderBy: {
                priority: 'asc'
            }
        });

        return notifications;
    }

    async getAllNotifications() {

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

    async getNotifications(query: {
        page?: string;
        limit?: string;
        category?: string;
        search?: string;
    }) {
        try {
            const {
                page = "1",
                limit = "5",
                category,
                search
            } = query;

            const pageNumber = parseInt(page, 10);
            const limitNumber = parseInt(limit, 10);
            const skip = (pageNumber - 1) * limitNumber;

            const where: Prisma.NotificationWhereInput = {};

            if (category && category !== "all") {
                where.category = category;
            }

            if (search) {
                where.title = {
                    contains: search,
                    mode: "insensitive",
                };
            }

            const [notifications, total] = await Promise.all([
                prisma.notification.findMany({
                    where,
                    skip,
                    take: limitNumber,
                    orderBy: {
                        createdAt: "desc",
                    },
                    include: {
                        department: true,
                        attachments: {
                            include: {
                                media: true,
                            },
                        },
                    },
                }),
                prisma.notification.count({ where }),
            ]);

            return {
                notifications,
                pagination: {
                    page: pageNumber,
                    limit: limitNumber,
                    total,
                    totalPages: Math.ceil(total / limitNumber),
                },
            };

        } catch (error) {
            console.error("Error fetching notifications:", error);
            throw new ApiError(500, "Failed to fetch notifications");
        }
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
