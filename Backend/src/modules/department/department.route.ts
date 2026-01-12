import { authMiddleware } from "../../middlewares/auth.middleware";
import { Router } from "express";
import {
  createDepartment,
  deleteDepartment,
  getAllDepartments,
  updateDepartment,
} from "./department.controller";

const router = Router();

// Admin protected routes
router.post("/", authMiddleware, createDepartment);
router.put("/:id", authMiddleware, updateDepartment);
router.get("/", authMiddleware, getAllDepartments);
router.delete("/:id", authMiddleware, deleteDepartment);

export default router;
