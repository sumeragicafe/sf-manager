import { IRoleRepository } from '@domain/repositories/IRoleRepository';

export function assignPermissionsToRole(roleRepo: IRoleRepository) {
  return async (roleId: string, permissionIds: string[]) => {
    const role = await roleRepo.findById(roleId);
    if (!role) throw new Error('Cargo não encontrado');
    
    return await roleRepo.update(roleId, role.props.name, role.props.description || '', permissionIds);
  };
}
