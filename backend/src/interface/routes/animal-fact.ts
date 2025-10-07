import { Router } from 'express';
import { AnimalFactController } from '@interface/controllers/AnimalFactController';
import { authServiceSingleton } from '@dependencies/singletons';
import { requireAuth } from '@interface/middlewares/requireAuth';

const router = Router();

router.post('/:petId/fact', requireAuth(authServiceSingleton), AnimalFactController.create);

router.get('/:petId/fact', requireAuth(authServiceSingleton), AnimalFactController.list);

router.put('/fact/:factId', requireAuth(authServiceSingleton), AnimalFactController.update);

router.delete('/fact/:factId', requireAuth(authServiceSingleton), AnimalFactController.delete);

export default router;
