import prisma from "../../DB/prisma";
import { ApiError } from "../../utils/apiError";
import type { CreateMediaInput } from "./media.validation";


export class MediaService {

    async createMedia(input: CreateMediaInput) {

        const media = await prisma.media.create({
            data: {
                url: input.url,
                type: input.type
            }
        });

        return media;
    }

    async getMediaById(id: number) {

        const media = await prisma.media.findUnique({
            where: {
                id: id
            }
        });

        if(!media) {
            throw new ApiError(404,"Media not found");
        }

        return media;
    }

    async deleteMediaById(id: number) {

        const existingMedia = await prisma.media.findUnique({
            where: {
                id: id
            }
        });

        if(!existingMedia) {
            throw new ApiError(404,"Media not found");
        }

        const media = await prisma.media.delete({
            where: {
                id: id
            }
        });

        return media;
    }
}