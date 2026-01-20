import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { NotifyAttachmentService } from "./notifyAttachment.service";
import { createNotifyAttachment, updateNotifyAttachment } from "./notifyAttachment.validation";
import { ApiResponse } from "../../utils/apiResponse";

const notifyAttachmentService =  new NotifyAttachmentService();

export const createNotificationAttachment = asyncHandler(async (req: Request, res: Response) => {

    const data = createNotifyAttachment.parse(req.body);
    
    const result = await notifyAttachmentService.createAttachment(data);

    res.status(201).json(new ApiResponse(201,result, "Notification attachment created successfully"));

})

export const updateNotificationAttachment = asyncHandler(async (req: Request, res: Response) => {

    const id = Number(req.params.id);
    
    const data = updateNotifyAttachment.parse(req.body);

    const result = await notifyAttachmentService.updateAttachment(id, data);

    res.status(200).json(new ApiResponse(200,result, "Notification attachment updated successfully"));  

})

export const getNotificationAttachmentByNotificationId = asyncHandler(async (req: Request, res: Response) => {

    const notificationId = Number(req.params.notificationId);

    const attachments = await notifyAttachmentService.getAttachmentsByNotificationId(notificationId);

    res.status(200).json(new ApiResponse(200, attachments, "Notification attachments fetched successfully"));       

})

export const getNotificationAttachmentById = asyncHandler(async (req: Request, res: Response) => {

    const id = Number(req.params.id);   
 
    const attachment = await notifyAttachmentService.getAttachmentById(id);

    res.status(200).json(new ApiResponse(200, attachment, "Notification attachment fetched successfully"));       

})

export const unLinkNotificationAttachment = asyncHandler(async (req: Request, res: Response) => {

    const id = Number(req.params.id);

    const notification = await notifyAttachmentService.unLinkAttachment(id);

    res.status(200).json(new ApiResponse(200, notification, "Notification attachment unlinked successfully"));
})