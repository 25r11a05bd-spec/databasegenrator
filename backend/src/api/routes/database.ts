import { Router } from 'express';
import { DatabaseController } from '../controllers/databaseController';

const router = Router();

router.post('/create', DatabaseController.create);
router.get('/history', DatabaseController.history);
router.get('/connection-string', DatabaseController.connectionString);
router.delete('/:id', DatabaseController.delete);

export default router;
