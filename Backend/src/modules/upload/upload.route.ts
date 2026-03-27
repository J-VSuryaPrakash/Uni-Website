import { Router } from "express";
import { uploadFile, deleteUpload } from "./upload.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { upload, validateFileSize } from "../../middlewares/multer.middleware";

const router = Router();

// POST /api/v1/admin/upload
// multipart/form-data: { file, folder? }
router.post("/", authMiddleware, upload.array("file", 5), validateFileSize, uploadFile);

// DELETE /api/v1/admin/upload/:id
router.delete("/:id", authMiddleware, deleteUpload);

export default router;
