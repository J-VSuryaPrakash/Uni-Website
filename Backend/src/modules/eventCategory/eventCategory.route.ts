import { Router } from "express";
import { createEventCategory, getActiveEventCategories, getAllEventCategories, toggleEventCategory, updateEventCategory } from "./eventCategory.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// Public Route

router.get('/active', getActiveEventCategories);

// Admin Routes

router.get('/', authMiddleware, getAllEventCategories);
router.post('/', authMiddleware, createEventCategory);
router.put('/:id', authMiddleware, updateEventCategory);
router.patch('/:id', authMiddleware, toggleEventCategory);

export default router;