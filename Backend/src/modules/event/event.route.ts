import { Router } from "express";
import { createEvent, getActiveEvents, getAllEvents, toggleEventStatus, updateEvent } from "./event.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// Public Routes

router.get("/active", getActiveEvents);

// Admin Routes

router.post("/", authMiddleware, createEvent);
router.get("/", authMiddleware, getAllEvents);
router.put("/:id", authMiddleware, updateEvent);
router.patch("/:id", authMiddleware, toggleEventStatus);

export default router;