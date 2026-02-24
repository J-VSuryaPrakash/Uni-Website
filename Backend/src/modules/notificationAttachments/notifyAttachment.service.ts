import prisma from "../../DB/prisma";
import { ApiError } from "../../utils/apiError";
import type { CreateNotifyAttachmentDTO, CreateAttachmentWithMediaDTO, UpdateNotifyAttachmentDTO } from "./notifyAttachment.validation";

export class NotifyAttachmentService {

    async createAttachment(data: CreateNotifyAttachmentDTO) {

        const newAttachment = await prisma.notificationAttachment.create({
            data: {
                notificationId: data.notificationId,
                title: data.title,
                mediaId: data.mediaId,
                position: data.position
            },
            include: { media: true }
        });

        return newAttachment;
    }

    // Creates a Media record and links it as an attachment in one transaction
    async createAttachmentWithMedia(data: CreateAttachmentWithMediaDTO) {

        const result = await prisma.$transaction(async (tx) => {
            const media = await tx.media.create({
                data: {
                    url: data.url,
                    type: data.mediaType
                }
            });

            const attachment = await tx.notificationAttachment.create({
                data: {
                    notificationId: data.notificationId,
                    title: data.title,
                    mediaId: media.id,
                    position: data.position ?? 0
                },
                include: { media: true }
            });

            return attachment;
        });

        return result;
    }

    // Deletes the attachment and its linked media record
    async deleteAttachmentWithMedia(id: number) {

        const attachment = await prisma.notificationAttachment.findFirst({
            where: { id }
        });

        if (!attachment) {
            throw new ApiError(404, "Notification attachment not found");
        }

        await prisma.$transaction(async (tx) => {
            await tx.notificationAttachment.delete({ where: { id } });
            await tx.media.delete({ where: { id: attachment.mediaId } });
        });

        return { id };
    }

    async updateAttachment(id: number, data: UpdateNotifyAttachmentDTO) {

        const notifyAttachment = await prisma.notificationAttachment.findFirst({
            where: { id }
        });

        if (!notifyAttachment) {
            throw new ApiError(404, "Notification attachment not found");
        }

        const updatedAttachment = await prisma.notificationAttachment.update({
            where: { id },
            data: {
                title: data.title ?? notifyAttachment.title,
                position: data.position ?? notifyAttachment.position
            },
            include: { media: true }
        });

        return updatedAttachment;
    }

    async getAttachmentById(id: number) {

        const attachment = await prisma.notificationAttachment.findFirst({
            where: { id },
            include: { media: true }
        });

        if (!attachment) {
            throw new ApiError(404, "Notification attachment not found");
        }

        return attachment;
    }

    async getAttachmentsByNotificationId(notificationId: number) {

        const attachments = await prisma.notificationAttachment.findMany({
            where: { notificationId },
            include: { media: true },
            orderBy: { position: 'asc' }
        });

        return attachments ?? [];
    }

    async unLinkAttachment(id: number) {

        const notifyAttachment = await prisma.notificationAttachment.findFirst({
            where: { id }
        });

        if (!notifyAttachment) {
            throw new ApiError(404, "Notification attachment not found");
        }

        const deletedAttachment = await prisma.notificationAttachment.delete({
            where: { id }
        });

        return deletedAttachment;
    }
}
