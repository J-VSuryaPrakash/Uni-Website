import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/apiError";
import { ApiResponse } from "../../utils/apiResponse";
import type { LoginDTO, RegisterDTO } from "./admin.validation";
import { RegisterDTOSchema,LoginDTOSchema } from "./admin.validation";
import { authService } from "./admin.service";

const registerAdmin = asyncHandler(async(req, res) => {

    const registerData: RegisterDTO = await RegisterDTOSchema.parseAsync(req.body);

    const registeredAdmin = await authService.registerAdmin(registerData)

    return res.status(201).json(new ApiResponse(201,registeredAdmin, "Admin registered successfully"))

})

const loginAdmin = asyncHandler(async(req, res) => {
    const loginData: LoginDTO = await LoginDTOSchema.parseAsync(req.body);

    const { accessToken, refreshToken } = await authService.loginAdmin(loginData);

    return res
		.status(200)
		.cookie("accessToken", accessToken, {
			httpOnly: true,
			secure: true,
			sameSite: "lax",
		})
		.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: "lax",
		})
		.json(
			new ApiResponse(
				200,
				{},
				"Admin logged in successfully",
			),
		);
})

const logoutAdmin = asyncHandler(async(req, res) => {

    return res
		.status(200)
		.clearCookie("accessToken", {
			httpOnly: true,
			secure: true,
			sameSite: "lax",
		})
		.clearCookie("refreshToken", {
			httpOnly: true,
			secure: true,
			sameSite: "lax",
		})
		.json(new ApiResponse(200, {}, "Admin logged out successfully"));
})

const getAdminById = asyncHandler(async (req, res) => {
	const adminId = parseInt(req.admin.id);
	const admin = await authService.getAdminById(adminId);

	if (!admin) {
		throw new ApiError(404, "Admin not found");
	}

	return res
		.status(200)
		.json(new ApiResponse(200, admin, "Admin fetched successfully"));
});

export {
    registerAdmin,
    loginAdmin,
    logoutAdmin,
    getAdminById
}