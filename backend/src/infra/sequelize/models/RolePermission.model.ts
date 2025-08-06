import { Sequelize } from 'sequelize';
import { RoleModel } from '@infra/sequelize/models/Role.model';
import { PermissionModel } from '@infra/sequelize/models/Permission.model';
import { UserModel } from '@infra/sequelize/models/User.model';

export function associateRolePermission() {
  // Role -> Permission (M:N)
  RoleModel.belongsToMany(PermissionModel, {
    through: 'role_permissions',
    as: 'Permissions',
    foreignKey: 'role_id',
    otherKey: 'permission_id',
    timestamps: false,
  });

  // Permission -> Role (M:N)
  PermissionModel.belongsToMany(RoleModel, {
    through: 'role_permissions',
    as: 'Roles',
    foreignKey: 'permission_id',
    otherKey: 'role_id',
    timestamps: false,
  });

  // User -> Role (1:N)
  UserModel.belongsTo(RoleModel, {
    foreignKey: 'role_id',
    as: 'role'
  });

}