import { Router } from "express";
import { createNotificationAttachment, getNotificationAttachmentById, getNotificationAttachmentByNotificationId, unLinkNotificationAttachment, updateNotificationAttachment } from "./notifyAttachment.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// Public routes

router.get('/notification/:notificationId', getNotificationAttachmentByNotificationId);

// Admin routes

router.post('/', authMiddleware, createNotificationAttachment);
router.patch('/:id', authMiddleware, updateNotificationAttachment);
router.get('/:id', authMiddleware, getNotificationAttachmentById);
router.delete('/:id', authMiddleware, unLinkNotificationAttachment);

export default router;