import multer from "multer";
import type { StorageEngine } from "multer";
import type { NextFunction, Request, Response } from "express";
import path from "path";

const storage: StorageEngine = multer.memoryStorage();

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const DOC_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const IMAGE_EXT = ["jpg", "jpeg", "png", "webp"];
const DOC_EXT = ["pdf", "doc", "docx"];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_DOC_SIZE = 10 * 1024 * 1024;   // 10MB

const fileFilter: multer.Options["fileFilter"] = (
    req: Request,
    file,
    cb
) => {

    const ext = path.extname(file.originalname).toLowerCase().replace(".", "");
    const isImage = IMAGE_TYPES.includes(file.mimetype) && IMAGE_EXT.includes(ext);
    const isDoc = DOC_TYPES.includes(file.mimetype) && DOC_EXT.includes(ext);

    if (!isImage && !isDoc) {
        return cb(
            new Error("Invalid file type. Only images, PDF, DOC, DOCX are allowed")
        );
    }

    (file as any).fileCategory = isImage ? "image" : "document";
    
    cb(null, true);
};

export const validateFileSize = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const files = (req.files as Express.Multer.File[]) || (req.file ? [req.file] : []);

    for (const file of files) {

        const category = (file as any).fileCategory;

        if (category === "image" && file.size > MAX_IMAGE_SIZE) {
            return res.status(400).json({
                error: `Image "${file.originalname}" exceeds 5MB limit`,
            });
        }

        if (category === "document" && file.size > MAX_DOC_SIZE) {
            return res.status(400).json({
                error: `Document "${file.originalname}" exceeds 10MB limit`,
            });
        }
    }

    next();
};

export const upload = multer({
    storage,
    fileFilter,
});
