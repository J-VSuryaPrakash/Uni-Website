import { Router } from "express";
import { createNotification, getNotifications, getNotificationByCategory, getLiveScrollingNotifications, toggleNotificationActiveStatus, updateNotification, } from "./notification.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// Public routes

router.get("/live-scrolling", getLiveScrollingNotifications);

// Admin routes

router.post("/", authMiddleware, createNotification);
router.get("/", authMiddleware, getNotifications);
router.get("/:category", authMiddleware, getNotificationByCategory);
router.patch("/update/:id",authMiddleware, updateNotification);
router.patch("/:id", authMiddleware, toggleNotificationActiveStatus);

export default router;