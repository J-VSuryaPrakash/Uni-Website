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

// Public routes
router.get("/slug/:slug", getPageBySlug);

// Admin routes
router.post("/", authMiddleware, createPage);
router.get("/", authMiddleware, getAllpages);
router.patch("/reorder", authMiddleware, reorderPages);
router.get("/:id", authMiddleware, getPageById);
router.patch("/:id", authMiddleware, updatePage);
router.delete("/:id", authMiddleware, deletePage);
router.patch("/:id/move", authMiddleware, movePage);


export default router;