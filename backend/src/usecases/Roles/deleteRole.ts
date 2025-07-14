import { IRoleRepository } from '@domain/repositories/IRoleRepository';

export function deleteRole(roleRepo: IRoleRepository) {
  return async (roleId: string) => {
    const success = await roleRepo.delete(roleId);
    if (!success) throw new Error('Cargo não encontrado');
    return success;
  };
}
