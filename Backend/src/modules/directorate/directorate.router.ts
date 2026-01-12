import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { createDirectorate, deleteDirectorate, getAllDirectorates, getDirectorateById, updateDirectorate } from "./directorate.controller";

const router = Router();

router.post("/", authMiddleware, createDirectorate);
router.get("/", authMiddleware, getAllDirectorates);
router.patch("/:id", authMiddleware, updateDirectorate);
router.delete("/:id", authMiddleware, deleteDirectorate);
router.get("/:id", authMiddleware, getDirectorateById);

export default router;