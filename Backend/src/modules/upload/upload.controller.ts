import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiResponse } from "../../utils/apiResponse";
import { ApiError } from "../../utils/apiError";
import { mimeToMediaType, deleteUploadedFile, toPublicUrl } from "../../utils/uploadConfig";
import prisma from "../../DB/prisma";

/**
 * POST /api/v1/admin/upload
 * Body (multipart/form-data):
 *   file   - the file to upload
 *   folder - destination folder: notifications | faculty | events | general (default: general)
 *
 * Returns a Media record with the public URL.
 */
export const uploadFile = asyncHandler(async (req: Request, res: Response) => {
    const file = req.file;

    if (!file) {
        throw new ApiError(400, "No file provided. Send the file under the field name 'file'.");
    }

    const mediaType = mimeToMediaType(file.mimetype);
    const publicUrl = toPublicUrl(file.path);

    let media;
    try {
        media = await prisma.media.create({
            data: {
                url: publicUrl,
                type: mediaType,
            },
        });
    } catch (err) {
        // If DB insert fails, clean up the uploaded file so disk doesn't get polluted
        deleteUploadedFile(file.path);
        throw new ApiError(500, "Failed to save file record. The uploaded file has been removed.");
    }

    res.status(201).json(
        new ApiResponse(201, {
            ...media,
            originalName: file.originalname,
            size: file.size,
            mimetype: file.mimetype,
        }, "File uploaded successfully"),
    );
});

/**
 * DELETE /api/v1/admin/upload/:id
 * Deletes the Media record from DB AND the file from disk.
 */
export const deleteUpload = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) {
        throw new ApiError(404, "Media record not found");
    }

    // Build the absolute disk path from the stored public URL
    const { UPLOADS_ROOT } = await import("../../utils/uploadConfig");
    const relativePath = media.url.replace(/^\/uploads\//, "");
    const absolutePath = `${UPLOADS_ROOT}/${relativePath}`;

    // Delete from DB first
    await prisma.media.delete({ where: { id } });

    // Then remove from disk (non-fatal if file is already gone)
    deleteUploadedFile(absolutePath);

    res.status(200).json(new ApiResponse(200, { id }, "File deleted successfully"));
});
