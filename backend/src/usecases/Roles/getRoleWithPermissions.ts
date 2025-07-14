import { IRoleRepository } from '@domain/repositories/IRoleRepository';

export function getRoleWithPermissions(roleRepo: IRoleRepository) {
  return async (roleId: string) => {
    const role = await roleRepo.findByIdWithPermissions(roleId);
    if (!role) throw new Error('Cargo não encontrado');
    return role;
  };
}
