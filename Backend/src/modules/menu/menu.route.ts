import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import {
	createMenu,
	deleteMenu,
	getAllMenus,
	getMenuById,
	getMenuTree,
	getMenuTreeById,
	getPublicMenus,
	reorderMenus,
	updateMenu,
} from "./menu.controller";

const router = Router();
/* ---------- PUBLIC ---------- */
router.get("/public", getPublicMenus);
router.get("/tree/:id", getMenuTreeById);
router.get("/tree/", getMenuTree);


/* ---------- ADMIN ---------- */
router.post("/", authMiddleware, createMenu);
router.put("/:id", authMiddleware, updateMenu);
router.delete("/:id", authMiddleware, deleteMenu);
router.get("/", authMiddleware, getAllMenus);
router.get("/:id", authMiddleware, getMenuById);
router.patch("/reorder", authMiddleware, reorderMenus);

export default router;
