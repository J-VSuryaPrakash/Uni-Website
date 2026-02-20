import prisma from "../../DB/prisma";
import { ApiError } from "../../utils/apiError";
import type { createEventInput, updateEventInput } from "./event.validation";


export class EventService {

    async createEvent(data: createEventInput) {

        const newEvent = await prisma.event.create({
            data: {
                categoryId: data.categoryId,
                title: data.title,
                description: (data.description !== undefined) ? data.description : null,
                eventDate: (data.eventDate !== undefined) ? data.eventDate : null,
                position: data.position,
                isActive: data.isActive
            }
        })

        return newEvent;
    }

    async getAllEvents() {

        const events = await prisma.event.findMany({
            orderBy: {
                position: 'asc'
            }
        });

        return events;
    }

    async updateEvent(id: number, data: updateEventInput) {

        const existingEvent = await prisma.event.findUnique({
            where: {
                id: id
            }
        });

        if (!existingEvent) {
            throw new ApiError(404, "Event not found");
        }

        const updatedEvent = await prisma.event.update({
            where: {
                id: id
            },
            data: {
                categoryId: data.categoryId ?? existingEvent.categoryId,
                title: data.title ?? existingEvent.title,
                description: (data.description !== undefined) ? data.description : existingEvent.description,
                eventDate: (data.eventDate !== undefined) ? data.eventDate : existingEvent.eventDate,
                position: data.position ?? existingEvent.position,
                isActive: data.isActive ?? existingEvent.isActive
            }
        });

        return updatedEvent;
    }

    async getActiveEvents() {

        const events = await prisma.event.findMany({
            where: {
                isActive: true
            },
            orderBy: {
                position: 'asc'
            },
            include: {
                category: true,
                media: {
                    orderBy: { position: 'asc' },
                    include: { media: true }
                }
            }
        });

        if (events.length === 0 || !events) {
            return [];
        }

        return events;
    }

    async toggleEventStatus(id: number) {

        const existingEvent = await prisma.event.findUnique({
            where: {
                id: id
            }
        });

        if (!existingEvent) {
            throw new ApiError(404, "Event not found");
        }

        const updatedEvent = await prisma.event.update({
            where: {
                id: id
            },
            data: {
                isActive: !existingEvent.isActive
            }
        });

        return updatedEvent;
    }
}