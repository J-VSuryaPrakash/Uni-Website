import { Router } from "express";
import {
    createNotificationAttachment,
    createNotificationAttachmentWithMedia,
    deleteNotificationAttachmentWithMedia,
    getNotificationAttachmentById,
    getNotificationAttachmentByNotificationId,
    unLinkNotificationAttachment,
    updateNotificationAttachment
} from "./notifyAttachment.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// Public routes
router.get('/notification/:notificationId', getNotificationAttachmentByNotificationId);

// Admin routes
router.post('/', authMiddleware, createNotificationAttachment);
router.post('/with-media', authMiddleware, createNotificationAttachmentWithMedia);
router.patch('/:id', authMiddleware, updateNotificationAttachment);
router.get('/:id', authMiddleware, getNotificationAttachmentById);
router.delete('/:id/with-media', authMiddleware, deleteNotificationAttachmentWithMedia);
router.delete('/:id', authMiddleware, unLinkNotificationAttachment);

export default router;
