import { IPermissionRepository } from "@domain/repositories/IPermissionRepository";
import { PermissionModel } from "@infra/sequelize/models/Permission.model";
import { Permission } from "@domain/entities/Permission";

export class SequelizePermissionRepository implements IPermissionRepository {
  async create(name: string, description?: string): Promise<Permission> {
    const p = await PermissionModel.create({ name, description });
    return new Permission(p.toJSON());
  }

  async list(): Promise<Permission[]> {
    const all = await PermissionModel.findAll();
    return all.map(p => new Permission(p.toJSON()));
  }

  async delete(permissionId: string): Promise<void> {
    await PermissionModel.destroy({ where: { id: permissionId } });
  }

  async findByRoleId(roleId: string): Promise<Permission[]> {
    const permissions = await PermissionModel.findAll({
      include: [
        {
          association: 'roles',
          where: { id: roleId }
        }
      ]
    });
    return permissions.map(p => new Permission(p.toJSON()));
  }
}