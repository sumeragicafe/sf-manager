import { IPermissionRepository } from '@domain/repositories/IPermissionRepository';

export function createPermission(permissionRepo: IPermissionRepository) {
  return async (name: string, description?: string) => {
    const existingPermissions = await permissionRepo.list();
    const exists = existingPermissions.some(p => p.props.name === name);

    if (exists) {
      throw new Error('Permissão já existe');
    }

    try {
      return await permissionRepo.create(name, description);
    } catch (error: any) {
      throw new Error(`Erro ao criar permissão: ${error.message}`);
    }
  };
}
