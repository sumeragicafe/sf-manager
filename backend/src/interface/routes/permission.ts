import { Router } from 'express';
import { PermissionController } from '@interface/controllers/PermissionController';
import { hasPermissions } from '@interface/middlewares/hasPermissions';
import { authServiceSingleton } from '@dependencies/singletons';
import { userRepositorySingleton } from '@dependencies/singletons';

const router = Router();

router.get('/', hasPermissions(["permission.get"], authServiceSingleton, userRepositorySingleton), PermissionController.list);
router.post('/', hasPermissions(["permission.create"], authServiceSingleton, userRepositorySingleton), PermissionController.create);
router.delete('/', hasPermissions(["permission.delete"], authServiceSingleton, userRepositorySingleton), PermissionController.delete);

export default router;
