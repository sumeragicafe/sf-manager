import { Router } from 'express';
import { EventController } from '@interface/controllers/EventController';
import { hasPermissions } from '@interface/middlewares/hasPermissions';
import { authServiceSingleton } from '@dependencies/singletons';
import { userRepositorySingleton } from '@dependencies/singletons';

const router = Router();

router.get('/', EventController.list);
router.post('/', hasPermissions(["event.create"], authServiceSingleton, userRepositorySingleton), EventController.create);
router.delete('/', hasPermissions(["event.delete"], authServiceSingleton, userRepositorySingleton), EventController.delete);

export default router;