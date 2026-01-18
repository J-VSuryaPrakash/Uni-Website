import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { createPageDirectorates, deletePageDirectorate, getPageDirectorateById, getPageDirectorates, getPageDirectoratesForPage, updatePageDirectoratePosition,  } from "./pageDirectorates.controller";

const router = Router();

router.post("/", authMiddleware, createPageDirectorates);
router.get("/", authMiddleware, getPageDirectorates);
router.get("/page/:pageId", authMiddleware, getPageDirectoratesForPage);
router.get("/:pageId/:directorateId", authMiddleware, getPageDirectorateById);
router.patch("/:pageId/:directorateId/", authMiddleware, updatePageDirectoratePosition);
router.delete("/:pageId/:directorateId", authMiddleware, deletePageDirectorate);

export default router;