import { Router } from "express";
import {

    createPage,
    getAllpages,
    getPageById,
    updatePage,
    deletePage,
    movePage,
    reorderPages,
    getPageBySlug,
} from "./page.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// Admin routes
router.post("/", authMiddleware, createPage);
router.get("/", authMiddleware, getAllpages);
router.get("/:id", authMiddleware, getPageById);
router.put("/:id", authMiddleware, updatePage);
router.delete("/:id", authMiddleware, deletePage);
router.patch("/:id/move", authMiddleware, movePage);
router.patch("/reorder", authMiddleware, reorderPages);

// Public routes
router.get("/:slug", getPageBySlug);

export default router;