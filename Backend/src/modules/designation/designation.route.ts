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
router.post("/", createDesignation);
router.put("/:id",  updateDesignation);
router.get("/",  getAllDesignations);
router.delete("/:id", deleteDesignation);

export default router;