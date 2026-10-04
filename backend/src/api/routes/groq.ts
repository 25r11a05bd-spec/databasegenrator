import { Router } from 'express';
import { GroqController } from '../controllers/groqController';

const router = Router();

router.post('/parse', GroqController.parse);
router.post('/adjust', GroqController.adjust);
router.post('/clarify', GroqController.clarify);

export default router;
