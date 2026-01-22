import {Router } from 'express';
import { createEventMedia, getEventMedia } from './eventMedia.controller';

const router = Router();

router.post('/', createEventMedia);
router.get('/:id', getEventMedia);

export default router;