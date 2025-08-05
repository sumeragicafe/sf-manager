import { Router } from 'express';
import { RoleController } from '@interface/controllers/RoleController';

import { hasPermissions } from '@interface/middlewares/hasPermissions';
import { authServiceSingleton } from '@dependencies/singletons';
import { userRepositorySingleton } from '@dependencies/singletons';

const router = Router();


router.get(
  '/',
  hasPermissions(["role.get"], authServiceSingleton, userRepositorySingleton),
  RoleController.list
);

router.post(
  '/',
  hasPermissions(["role.create"], authServiceSingleton, userRepositorySingleton),
  RoleController.create
);

router.get(
  '/:id',
  hasPermissions(["role.get"], authServiceSingleton, userRepositorySingleton),
  RoleController.getById
);

router.delete(
  '/:id',
  hasPermissions(["role.delete"], authServiceSingleton, userRepositorySingleton),
  RoleController.delete
);

// Atribuir permissões a um cargo pelo ID
router.post(
  '/:id/add-permission',
  hasPermissions(["role.update_permissions"], authServiceSingleton, userRepositorySingleton),
  RoleController.assignPermissions
);

export default router;
