import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiResponse } from "../../utils/apiResponse";
import { ApiError } from "../../utils/apiError";
import prisma from "../../DB/prisma";
import { uploadOnImageKit, imagekit } from "../../utils/imagekitIO";

const folderMap: Record<string, string> = {
  notifications: "/notifications",
  faculty: "/faculty",
  events: "/events",
  general: "/general",
  pdf: "/documents",
};

const resolveFolder = (input?: string) => {
  if (!input) return "/general";
  return folderMap[input] || "/general";
};

const getMediaType = (mimetype: string): string => {
  if (mimetype.startsWith("image/")) return "image";
  if (mimetype === "application/pdf") return "pdf";
  if (mimetype.includes("word")) return "document";
  return "file";
};

export const uploadFile = asyncHandler(async (req: Request, res: Response) => {
  const files = (req.files as Express.Multer.File[]) || (req.file ? [req.file] : []);

  if (!files || files.length === 0) {
    throw new ApiError(400, "No file(s) provided");
  }

  const folder = resolveFolder(req.body.folder);

  const results = await Promise.allSettled(
    files.map(async (file) => {
      const mediaType = getMediaType(file.mimetype);
      const uniqueName = `${Date.now()}-${file.originalname}`;

      const uploadResult = await uploadOnImageKit({
        file: file.buffer,
        fileName: uniqueName,
        folder,
      });

      try {
        const media = await prisma.media.create({
          data: {
            url: uploadResult.url,
            type: mediaType,
            fileId: uploadResult.fileId,
          },
        });

        return {
          id: media.id,
          url: media.url,
          type: media.type,
          size: uploadResult.size,
          originalName: uploadResult.name,
          mimetype: file.mimetype,
        };
      } catch (err) {
        await imagekit.deleteFile(uploadResult.fileId);
        throw new Error("DB save failed, upload rolled back");
      }
    })
  );

  const success = results
    .filter((r) => r.status === "fulfilled")
    .map((r: any) => r.value);

  const failed = results
    .filter((r) => r.status === "rejected")
    .map((r: any) => r.reason?.message || "Upload failed");

  let responseData;

  if (success.length === 0) {
    throw new ApiError(500, failed[0] || "Upload failed");
  }

  if (success.length === 1 && files.length === 1) {
    responseData = success[0];
  }

  else {
    responseData = {
      files: success,
      failed,
      total: files.length,
      uploaded: success.length,
    };
  }
  
  return res.status(201).json(
    new ApiResponse(
      201,
      responseData,
      "Upload completed"
    )
  );
});

export const deleteUpload = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const media = await prisma.media.findUnique({
    where: { id },
  });

  if (!media) {
    throw new ApiError(404, "Media not found");
  }

  try {
    await imagekit.deleteFile(media.fileId || "");
  } catch (err: any) {
    throw new ApiError(500, `ImageKit delete failed: ${err.message}`);
  }

  await prisma.media.delete({
    where: { id },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { id }, "File deleted successfully"));
});