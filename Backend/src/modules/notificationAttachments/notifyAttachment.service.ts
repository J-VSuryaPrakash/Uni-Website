import prisma from "../../DB/prisma";
import { ApiError } from "../../utils/apiError";
import type { CreateNotifyAttachmentDTO, UpdateNotifyAttachmentDTO } from "./notifyAttachment.validation";

export class NotifyAttachmentService {
    
    async createAttachment(data: CreateNotifyAttachmentDTO  ) {

        const newAttachment = await prisma.notificationAttachment.create({
            data: {
                notificationId: data.notificationId,
                title: data.title,
                mediaId: data.mediaId,
                position: data.position
            }
        });

        return newAttachment;
    }

    async updateAttachment(id: number, data: UpdateNotifyAttachmentDTO){

        const notifyAttachment = await prisma.notificationAttachment.findFirst({
            where: {
                id: id
            }
        });

        if(!notifyAttachment){
            throw new ApiError(404, "Notification attachment not found");
        }

        const updatedAttachment = await prisma.notificationAttachment.update({
            where: {
                id: id
            },
            data: {
                title: data.title ?? notifyAttachment.title,
                position: data.position ?? notifyAttachment.position
            }
        });

        return updatedAttachment;
    }

    async getAttachmentById(id: number) {

        const attachment = await prisma.notificationAttachment.findFirst({  
            where: {
                id: id
            }
        });

        if(!attachment){
            throw new ApiError(404, "Notification attachment not found");
        }

        return attachment;
    }

    async getAttachmentsByNotificationId(notificationId: number) {

        const attachments = await prisma.notificationAttachment.findMany({
            where: {
                notificationId: notificationId
            },
            orderBy: {
                position: 'asc'
            }
        });

        if(!attachments){
            return [];
        }

        return attachments;
    }

    async unLinkAttachment(id: number) {

        const notifyAttachment = await prisma.notificationAttachment.findFirst({
            where: {
                id: id
            }
        });

        if(!notifyAttachment){
            throw new ApiError(404, "Notification attachment not found");
        }

        const deletedAttachment = await prisma.notificationAttachment.delete({
            where: {
                id: id
            }        
        }); 

        return deletedAttachment;
    }
}