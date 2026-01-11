import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
    admin?: {
        id: number;
    }
}

export const authMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
    if (!token) {
        throw new ApiError(401, "user is not authenticated");
    }

    try {
        const secret = process.env.ACCESS_TOKEN_SECRET!;
        const decoded = jwt.verify(token, secret) as { id: number };
        req.admin = { id: decoded.id };
        next();
    }catch (error) {
        throw new ApiError(401, "Invalid authentication token");
    }
}