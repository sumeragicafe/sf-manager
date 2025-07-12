import { Sequelize } from 'sequelize';
import { Role } from '@infra/sequelize/models/Role.model';
import { Permission } from '@infra/sequelize/models/Permission.model';
import { UserModel } from '@infra/sequelize/models/User.model';

export function associateRolePermission(sequelize: Sequelize) {
  // Role -> Permission (M:N)
  Role.belongsToMany(Permission, {
    through: 'role_permissions',
    as: 'Permissions',
    foreignKey: 'role_id',
    otherKey: 'permission_id',
    timestamps: false,
  });

  // Permission -> Role (M:N)
  Permission.belongsToMany(Role, {
    through: 'role_permissions',
    as: 'Roles',
    foreignKey: 'permission_id',
    otherKey: 'role_id',
    timestamps: false,
  });

  // User -> Role (1:N)
  UserModel.belongsTo(Role, {
    foreignKey: 'role_id',
    as: 'role'
  });

}