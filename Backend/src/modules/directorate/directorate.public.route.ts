import { Router } from "express";
import { getDirectoratesByPage, getPublicDirectorates } from "./directorate.public.controller";

const router = Router();

router.get("/public", getPublicDirectorates);
router.get("/public/by-page/:pageId", getDirectoratesByPage);

export default router;
