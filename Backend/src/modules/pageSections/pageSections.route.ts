import { Router } from "express";
import {
	createSection,
	deleteSection,
	getSectionsByPageId,
	reorderSections,
	updateSection,
} from "./pageSections.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

/* ---------- ADMIN ---------- */
router.post("/pages/:pageId/sections", authMiddleware, createSection);
router.get("/pages/:pageId/sections", authMiddleware, getSectionsByPageId);
router.patch("/sections/reorder", authMiddleware, reorderSections);
router.patch("/sections/:sectionId", authMiddleware, updateSection);
router.delete("/sections/:sectionId", authMiddleware, deleteSection);

export default router;
