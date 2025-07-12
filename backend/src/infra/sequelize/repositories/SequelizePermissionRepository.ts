import { Permission } from "@infra/sequelize/models/Permission.model";

export class SequelizePermissionRepository {
  async create(name: string, description?: string) {
    return Permission.create({ name, description });
  }

  async list() {
    return Permission.findAll();
  }

  async delete(permissionId: string) {
    await Permission.destroy({ where: { id: permissionId } });
  }
  
}
