import { authMiddleware } from "../../middlewares/auth.middleware";
import { Router } from "express";
import {
    createDesignation,
    updateDesignation,
    getAllDesignations,
    deleteDesignation
} from "./designation.controller";


const router = Router();

// Admin routes
router.post("/", authMiddleware, createDesignation);
router.put("/:id", authMiddleware, updateDesignation);
router.get("/", authMiddleware, getAllDesignations);
router.delete("/:id", authMiddleware, deleteDesignation);

export default router;