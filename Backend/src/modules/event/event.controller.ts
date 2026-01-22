import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { createEventSchema, updateEventSchema } from "./event.validation";
import { EventService } from "./event.service";
import { ApiResponse } from "../../utils/apiResponse";

const eventService = new EventService();

export const createEvent = asyncHandler(async(req: Request, res: Response) => {

    const data = createEventSchema.parse(req.body);

    const event = await eventService.createEvent(data);
    
    res.status(201).json(new ApiResponse(201, event, "Event created successfully"));
});

export const getAllEvents = asyncHandler(async(req: Request, res: Response) => {

    const events = await eventService.getAllEvents();   

    res.status(200).json(new ApiResponse(200, events, "Events retrieved successfully"));

});

export const updateEvent = asyncHandler(async(req: Request, res: Response) => {

    const id = Number(req.params.id);

    const data = updateEventSchema.parse(req.body);

    const updatedEvent = await eventService.updateEvent(id, data);

    res.status(200).json(new ApiResponse(200, updatedEvent, "Event updated successfully"));
});

export const getActiveEvents = asyncHandler(async(req: Request, res: Response) => {

    const events = await eventService.getActiveEvents();    

    res.status(200).json(new ApiResponse(200, events, "Active events retrieved successfully"));
}); 

export const toggleEventStatus = asyncHandler(async(req: Request, res: Response) => {

    const id = Number(req.params.id);   

    const updatedEvent = await eventService.toggleEventStatus(id);

    res.status(200).json(new ApiResponse(200, updatedEvent, "Event status toggled successfully"));
});