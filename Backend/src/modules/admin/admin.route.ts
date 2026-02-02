import { Router } from "express";
import { getAdminById,loginAdmin,logoutAdmin,registerAdmin } from "./admin.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/auth/login", loginAdmin);
router.get("/auth/logout",authMiddleware, logoutAdmin);
router.post("/auth/registerAdmin", registerAdmin);
router.get("/auth/me", authMiddleware, getAdminById);

export default router;