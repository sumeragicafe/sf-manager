import { Role } from '@infra/sequelize/models/Role.model';
import { Permission } from '@infra/sequelize/models/Permission.model';

export async function createRoleWithPermissions(roleData: {
  name: string;
  description?: string;
  permissionIds: string[];
}) {
  const role = await Role.create({
    name: roleData.name,
    description: roleData.description
  });

  await role.$set('Permissions', roleData.permissionIds);

  return role;
}
