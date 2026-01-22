import prisma from "../../DB/prisma";
import { ApiError } from "../../utils/apiError";
import type { CreateEventMediaInput } from "./eventMedia.validation";

export class EventMediaService {

    async createEventMedia(data: CreateEventMediaInput) {

        const eventMedia = await prisma.eventMedia.create({
            data: {
                eventId: data.eventId,
                mediaId: data.mediaId,
                position: ((data.position !== undefined) ? data.position : null),
                altText: ((data.altText !== undefined) ? data.altText : null)
            }
        });

        return eventMedia;
    }

    async getEventMediaById(id: number) {

        const eventMedia = await prisma.eventMedia.findUnique({
            where: {
                id: id
            }
        });

        if(!eventMedia) {
            throw new ApiError(404, "Event media not found");
        }

        return eventMedia;
    }

}