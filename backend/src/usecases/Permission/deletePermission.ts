import { IPermissionRepository } from '@domain/repositories/IPermissionRepository';

export function deletePermission(permissionRepo: IPermissionRepository) {
  return async (id: string) => {
    const all = await permissionRepo.list();
    const exists = all.find(p => p.props.id === id);
    
    if (!exists) {
      throw new Error('Permissão não encontrada');
    }

    await permissionRepo.delete(id);
  };
}
