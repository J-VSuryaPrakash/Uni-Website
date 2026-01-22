import {Router} from 'express';
import { createMedia, getMediaById, deleteMediaById } from './media.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/', authMiddleware, createMedia);
router.get('/:id', authMiddleware, getMediaById);
router.delete('/:id', authMiddleware, deleteMediaById);

export default router;