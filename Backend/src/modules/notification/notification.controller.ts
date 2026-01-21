import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { createNotificationSchema, updateNotificationSchema } from "./notification.validation";
import { NotificationService } from "./notification.service";
import { ApiResponse } from "../../utils/apiResponse";

const notificationService = new NotificationService();

export const createNotification = asyncHandler(async(req: Request, res: Response) => {

    const data = createNotificationSchema.parse(req.body);
    
    const notification = await notificationService.createNotification(data);

    res.status(201).json(new ApiResponse(201, notification, "Notification created successfully"));
})

export const getNotificationByCategory = asyncHandler(async(req: Request, res: Response) => {

    const category = req.params.category;

    if(!category){
        return res.status(400).json(new ApiResponse(400, null, "Category parameter is required"));
    }

    const notifications = await notificationService.getNotificationsByCategory(category);

    res.status(200).json(new ApiResponse(200, notifications, "Notifications fetched successfully"));
});

export const getNotifications = asyncHandler(async(req: Request, res: Response) => {

    const notifications = await notificationService.getNotifications();

    res.status(200).json(new ApiResponse(200, notifications, "Notifications fetched successfully"));
});

export const updateNotification = asyncHandler(async(req: Request, res: Response) => {

    const id = Number(req.params.id);
    
    const data = updateNotificationSchema.parse(req.body);

    const newNotification = await notificationService.updateNotification(id, data);

    res.status(200).json(new ApiResponse(200, newNotification, "Notification updated successfully"));
});

export const toggleNotificationActiveStatus = asyncHandler(async(req: Request, res: Response) => {

    const id = Number(req.params.id);

    const notification = await notificationService.toggleNotificationActiveStatus(id);

    res.status(200).json(new ApiResponse(200, notification, "Notification active status toggled successfully"));
});

export const getLiveScrollingNotifications = asyncHandler(async(req: Request, res: Response) => {

    const notifications = await notificationService.getLiveScrollingNotifications();

    res.status(200).json(new ApiResponse(200, notifications, "Live scrolling notifications fetched successfully"));
});
