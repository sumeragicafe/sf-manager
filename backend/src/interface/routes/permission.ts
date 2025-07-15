import { Router } from 'express';
import { PermissionController } from '@interface/controllers/PermissionController';
import { hasPermissions } from '@interface/middlewares/hasPermissions';
import { authServiceSingleton } from '@dependencies/singletons';
import { userRepositorySingleton } from '@dependencies/singletons';

const router = Router();

router.get('/', hasPermissions(["PERMISSION_GET"], authServiceSingleton, userRepositorySingleton), PermissionController.list);
router.post('/', hasPermissions(["PERMISSION_CREATE"], authServiceSingleton, userRepositorySingleton), PermissionController.create);
router.delete('/', hasPermissions(["PERMISSION_DELETE"], authServiceSingleton, userRepositorySingleton), PermissionController.delete);

export default router;
