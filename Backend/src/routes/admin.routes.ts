import { Router } from "express";
import { loginAdmin, registerAdmin } from "../controllers/admin.controllers";

const router = Router()

router.route('/adminRegister').post(registerAdmin)
router.route('/adminLogin').post(loginAdmin)

export default router