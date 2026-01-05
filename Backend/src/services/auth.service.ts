import prisma from "../../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { JWTPayload, LoginDTO, RegisterDTO } from "../types/models/auth.types";
import { ApiError } from "../utils/apiError";
import { env } from "../config/env.config";

class AuthService {
    // Generate Access Token
    private generateAccessToken(payload: JWTPayload): string {
        return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1d',
        });
    }

    // Generate Refresh Token
    private generateRefreshToken(payload: JWTPayload): string {
        return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
            expiresIn: '10d',
        });
    }

    // Hash Password
    private async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    // Compare Password
    private async comparePassword(
        password: string,
        passwordHash: string
    ): Promise<boolean> {
        return await bcrypt.compare(password, passwordHash);
    }

    // Login Admin

    public async loginAdmin(loginData: LoginDTO) {

        const {email, password} = loginData

        const admin = await prisma.admin.findUnique({ where: { email } });

        if (!admin) {
        throw new ApiError(401,"Invalid credentials");
        }

        const isValid = await this.comparePassword(password, admin.passwordHash);
        if (!isValid) {
        throw new ApiError(401,"Invalid credentials");
        }

        const payload: JWTPayload = {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        };

        return {
        accessToken: this.generateAccessToken(payload),
        refreshToken: this.generateRefreshToken(payload),
        };
    }

    public async registerAdmin(registerData: RegisterDTO) {

        const {name, email, password} = registerData

        // Check if admin already exists
        const existingAdmin = await prisma.admin.findUnique({
            where: { email },
        });

        if (existingAdmin) {
            throw new ApiError(409, "Admin already exists");
        }

        // Hash password
        const passwordHash = await this.hashPassword(password);

        // Create admin
        const admin = await prisma.admin.create({
            data: {
            name,
            email,
            passwordHash,
            },
        });

        // Return safe response
        return {
            id: admin.id,
            name: admin.name,
            email: admin.email,
        };
    }
}

export const authService = new AuthService();