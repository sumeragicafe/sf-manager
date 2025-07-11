import { Role } from "@infra/sequelize/models/Role.model";
import { Permission } from "@infra/sequelize/models/Permission.model";

export class SequelizeRoleRepository {
  async createWithPermissions(name: string, description: string, permissionIds: string[]) {
    const role = await Role.create({ name, description });
    await role.setPermissions(permissionIds); // associações automáticas
    return role;
  }

  async update(roleId: string, name: string, description: string, permissionIds: string[]) {
    const role = await Role.findByPk(roleId);
    if (!role) throw new Error('Cargo não encontrado');

    await role.update({ name, description });
    await role.setPermissions(permissionIds); // atualiza as permissões
    return role;
  }

  async list() {
    return Role.findAll({ include: [{ model: Permission, as: 'permissions' }] });
  }

  async delete(roleId: string) {
    await Role.destroy({ where: { id: roleId } });
  }
}
