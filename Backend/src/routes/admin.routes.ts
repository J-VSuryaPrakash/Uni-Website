import { Router } from "express";
import { loginAdmin, logoutAdmin, registerAdmin } from "../Controllers/admin.controllers";

const router = Router()

router.route('/adminRegister').post(registerAdmin)
router.route('/adminLogin').post(loginAdmin)
router.route('/adminLogout').post(logoutAdmin)

export default router