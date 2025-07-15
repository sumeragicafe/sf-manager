import { RoleModel } from "@infra/sequelize/models/Role.model";
import { Role } from "@domain/entities/Role";
import { PermissionModel } from "@infra/sequelize/models/Permission.model";
import { IRoleRepository } from "@domain/repositories/IRoleRepository";

export class SequelizeRoleRepository implements IRoleRepository {
  async findById(id: string) {
    const r = await RoleModel.findByPk(id);
    return r ? new Role(r.toJSON()) : null;
  }

  async findByIdWithPermissions(id: string): Promise<Role | null> {
    const roleModel = await RoleModel.findByPk(id, {
      include: [{ model: PermissionModel, as: 'Permissions' }]
    });

    if (!roleModel) return null;

    const roleJson = roleModel.toJSON() as any;

    const domainRole = new Role({
      id: roleJson.id,
      name: roleJson.name,
      description: roleJson.description,
      permissions: roleJson.Permissions?.map((perm: any) => ({
        id: perm.id,
        name: perm.name,
        description: perm.description
      })) || []
    });

    return domainRole;
  }


  async findByName(name: string) {
    const r = await RoleModel.findOne({ where: { name } });
    return r ? new Role(r.toJSON()) : null;
  }

  async create(name: string, description: string){
    const r = await RoleModel.create({name, description});
    return new Role(r.toJSON());
  }

  async createWithPermissions(name: string, description: string, permissionIds: string[]){
    const roleModel = await RoleModel.create({ name, description });
    await roleModel.setPermissions(permissionIds);

    const withPermissions = await RoleModel.findByPk(roleModel.id, {
      include: [{ model: PermissionModel, as: 'permissions' }]
    });

    const json = withPermissions!.toJSON() as any;

    return new Role({
      id: json.id,
      name: json.name,
      description: json.description,
      permissions: json.permissions?.map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description,
      })) || [],
    });
  }

  async update(roleId: string, name: string, description: string, permissionIds: string[]){
    const roleModel = await RoleModel.findByPk(roleId);
    if (!roleModel) throw new Error('Cargo não encontrado');

    await roleModel.update({ name, description });
    await roleModel.setPermissions(permissionIds);

    const updated = await RoleModel.findByPk(roleId, {
      include: [{ model: PermissionModel, as: 'permissions' }]
    });

    const json = updated!.toJSON() as any;

    return new Role({
      id: json.id,
      name: json.name,
      description: json.description,
      permissions: json.permissions?.map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description,
      })) || [],
    });
  }


  async list(){
    const roles = await RoleModel.findAll({
      include: [{ model: PermissionModel, as: 'Permissions' }]
    });

    return roles.map((r) => {
      const json = r.toJSON() as any;

      return new Role({
        id: json.id,
        name: json.name,
        description: json.description,
        permissions: json.permissions?.map((p: any) => ({
          id: p.id,
          name: p.name,
          description: p.description,
        })) || [],
      });
    });
  }

  async delete(roleId: string){
    const deleted = await RoleModel.destroy({ where: { id: roleId } });
    return deleted > 0;
  }
}
