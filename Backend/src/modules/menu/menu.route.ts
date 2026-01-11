import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import {
	createMenu,
	deleteMenu,
	getAllMenus,
	getMenuById,
	getPublicMenus,
	reorderMenus,
	updateMenu,
} from "./menu.controller";

const router = Router();
/* ---------- PUBLIC ---------- */
router.get("/public", getPublicMenus);

/* ---------- ADMIN ---------- */
router.post("/", authMiddleware, createMenu);
router.put("/:id", authMiddleware, updateMenu);
router.delete("/:id", authMiddleware, deleteMenu);
router.get("/", authMiddleware, getAllMenus);
router.get("/:id", authMiddleware, getMenuById);
router.post("/reorder", authMiddleware, reorderMenus);

export default router;
