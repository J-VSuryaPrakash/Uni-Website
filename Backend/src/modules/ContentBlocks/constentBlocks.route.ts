import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import {
	createContentBlock,
	deleteContentBlock,
	getBlocksBySectionId,
	reorderContentBlocks,
	updateContentBlock,
} from "./contentBlocks.controller";

const router = Router();

/* ---------- ADMIN ---------- */
router.post("/sections/:sectionId/blocks", authMiddleware, createContentBlock);
router.get("/sections/:sectionId/blocks", authMiddleware, getBlocksBySectionId);
router.patch("/blocks/reorder", authMiddleware, reorderContentBlocks);
router.patch("/blocks/:blockId", authMiddleware, updateContentBlock);
router.delete("/blocks/:blockId", authMiddleware, deleteContentBlock);
export default router;
