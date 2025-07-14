import { RoleModel } from '@infra/sequelize/models/Role.model';
import { IRoleRepository } from '@domain/repositories/IRoleRepository';

export function createRole(roleRepository: IRoleRepository) {

  return async (name:string, description: string) => {
    const existingRoles = await roleRepository.list();
    const exists = existingRoles.some(r => r.props.name === name);
  
     if (exists) {
      throw new Error('Cargo já existe');
    }

    const role = await roleRepository.create(name, description);
  
    return role;
  }
  
}
