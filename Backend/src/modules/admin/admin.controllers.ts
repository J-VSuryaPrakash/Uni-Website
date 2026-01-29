import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/apiError";
import { ApiResponse } from "../../utils/apiResponse";
import type { LoginDTO, RegisterDTO } from "./admin.validation";
import { authService } from "./admin.service";

const registerAdmin = asyncHandler(async(req, res) => {

    const registerData: RegisterDTO = req.body
    
    if(!registerData.name || !registerData.email || !registerData.password){
        throw new ApiError(400,"Admin details are required")
    }

    const registeredAdmin = await authService.registerAdmin(registerData)

    return res.status(201).json(new ApiResponse(201,registeredAdmin, "Admin registered successfully"))

})

const loginAdmin = asyncHandler(async(req, res) => {
    const loginData: LoginDTO = req.body;

    if (!loginData.email || !loginData.password) {
        throw new ApiError(400, "Email and password are required");
    }

    const { accessToken, refreshToken } = await authService.loginAdmin(loginData);

    return res.status(200)
        .cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true
        })
        .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true
        })
        .json(new ApiResponse(200,{accessToken, refreshToken}, "Admin logged in successfully"));
})

const logoutAdmin = asyncHandler(async(req, res) => {

    return res.status(200)
        .clearCookie("accessToken", {
            httpOnly: true,
            secure: true
        })
        .clearCookie("refreshToken", {
            httpOnly: true,
            secure: true
        })
        .json(new ApiResponse(200, {}, "Admin logged out successfully"));
})

export {
    registerAdmin,
    loginAdmin,
    logoutAdmin
}