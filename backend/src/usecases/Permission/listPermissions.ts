import { IPermissionRepository } from '@domain/repositories/IPermissionRepository';

export function listPermissions(permissionRepo: IPermissionRepository) {
  return async () => {
    return await permissionRepo.list();
  };
}
