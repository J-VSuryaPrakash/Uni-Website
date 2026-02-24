import fs from "fs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { ApiError } from "./apiError";

// ─── Resolve uploads root (backend/uploads/) ──────────────────────────────────
// Works correctly for both tsx (dev) and compiled dist (prod)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// src/utils/uploadConfig.ts  →  ../../uploads  →  backend/uploads/
export const UPLOADS_ROOT = path.resolve(__dirname, "../../uploads");

// ─── Valid folder names ────────────────────────────────────────────────────────
export type UploadFolder =
    | "notifications"
    | "faculty"
    | "events"
    | "general";

export const VALID_FOLDERS: UploadFolder[] = [
    "notifications",
    "faculty",
    "events",
    "general",
];

// ─── MIME → Media type mapping ────────────────────────────────────────────────
const MIME_TO_TYPE: Record<string, string> = {
    // Images
    "image/jpeg": "image",
    "image/jpg": "image",
    "image/png": "image",
    "image/webp": "image",
    "image/gif": "image",
    "image/svg+xml": "image",
    // PDF
    "application/pdf": "pdf",
    // Office documents
    "application/msword": "document",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "document",
    "application/vnd.ms-excel": "document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "document",
    "application/vnd.ms-powerpoint": "document",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "document",
    // Video
    "video/mp4": "video",
    "video/x-msvideo": "video",
    "video/quicktime": "video",
    "video/x-matroska": "video",
    "video/webm": "video",
    // Audio
    "audio/mpeg": "audio",
    "audio/wav": "audio",
    "audio/ogg": "audio",
    "audio/mp4": "audio",
};

export const mimeToMediaType = (mime: string): string =>
    MIME_TO_TYPE[mime] ?? "document";

// ─── Allowed MIME types ───────────────────────────────────────────────────────
const ALLOWED_MIMES = new Set(Object.keys(MIME_TO_TYPE));

// ─── Multer disk storage ──────────────────────────────────────────────────────
const storage = multer.diskStorage({
    destination: (req, _file, cb) => {
        const raw = (req.body?.folder ?? "general") as string;
        const folder = VALID_FOLDERS.includes(raw as UploadFolder)
            ? raw
            : "general";
        const dest = path.join(UPLOADS_ROOT, folder);
        fs.mkdirSync(dest, { recursive: true });
        cb(null, dest);
    },
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const ts = Date.now();
        const rand = Math.random().toString(36).slice(2, 8);
        cb(null, `${ts}-${rand}${ext}`);
    },
});

// ─── File filter ──────────────────────────────────────────────────────────────
const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
    if (ALLOWED_MIMES.has(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new ApiError(
                415,
                `File type "${file.mimetype}" is not allowed. Accepted: images, PDF, Office docs, video, audio.`,
            ),
        );
    }
};

// ─── Exported multer instance ─────────────────────────────────────────────────
export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100 MB
    },
});

// ─── Helper: delete a file from disk (used when DB record creation fails) ─────
export const deleteUploadedFile = (filePath: string): void => {
    if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};

// ─── Helper: build the public URL from disk path ──────────────────────────────
// e.g.  backend/uploads/notifications/file.pdf  →  /uploads/notifications/file.pdf
export const toPublicUrl = (absolutePath: string): string => {
    const relative = path.relative(UPLOADS_ROOT, absolutePath);
    return "/uploads/" + relative.split(path.sep).join("/");
};
