import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../DB/prisma";
import type {
	JWTPayload,
	LoginDTO,
	RegisterDTO,
} from "./admin.validation"
import { ApiError } from "../../utils/apiError";

class AuthService {
	// Generate Access Token
	private generateAccessToken(payload: JWTPayload): string {
		const secret = process.env.ACCESS_TOKEN_SECRET;
		
		if (!secret) throw new Error("ACCESS_TOKEN_SECRET missing");
		
		return jwt.sign(payload, secret, {
			expiresIn: "1d",
		});
	}

	// Generate Refresh Token
	private generateRefreshToken(payload: JWTPayload): string {
		const secret = process.env.REFRESH_TOKEN_SECRET;
		if (!secret) throw new Error("REFRESH_TOKEN_SECRET missing");
		return jwt.sign(payload, secret, {
			expiresIn: "10d",
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
		const { email, password } = loginData;
		// Find admin by email
		const admin = await prisma.admin.findUnique({ where: { email } });

		if (!admin) {
			throw new ApiError(401, "Invalid credentials");
		}
		// Compare password
		const isValid = await this.comparePassword(
			password,
			admin.passwordHash
		);
		if (!isValid) {
			throw new ApiError(401, "Invalid credentials");
		}
		// Generate tokens
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
		const { name, email, password } = registerData;

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

	public async getAdminById(adminId: number) {
		const admin = await prisma.admin.findUnique({
			where: { id: adminId },
			select: {
				id: true,
				name: true,
				email: true,
			},
		});
		
		return admin;
	}
}

export const authService = new AuthService();
