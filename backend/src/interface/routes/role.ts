import { Router } from 'express';
import { RoleController } from '@interface/controllers/RoleController';

import { hasPermissions } from '@interface/middlewares/hasPermissions';
import { authServiceSingleton } from '@dependencies/singletons';
import { userRepositorySingleton } from '@dependencies/singletons';

const router = Router();

// Listar todos os cargos
router.get(
  '/',
  hasPermissions(["PERMISSION_GET"], authServiceSingleton, userRepositorySingleton),
  RoleController.list
);

// Criar um novo cargo
router.post(
  '/',
  hasPermissions(["PERMISSION_CREATE"], authServiceSingleton, userRepositorySingleton),
  RoleController.create
);

// Buscar cargo pelo ID com permissões
router.get(
  '/:id',
  hasPermissions(["PERMISSION_GET"], authServiceSingleton, userRepositorySingleton),
  RoleController.getById
);

// Deletar cargo pelo ID
router.delete(
  '/:id',
  hasPermissions(["PERMISSION_DELETE"], authServiceSingleton, userRepositorySingleton),
  RoleController.delete
);

// Atribuir permissões a um cargo pelo ID
router.post(
  '/:id/add-permission',
  hasPermissions(["PERMISSION_ASSIGN"], authServiceSingleton, userRepositorySingleton),
  RoleController.assignPermissions
);

export default router;
