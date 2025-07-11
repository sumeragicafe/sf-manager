import { Sequelize } from 'sequelize';
import { Role } from '@infra/sequelize/models/Role.model';
import { Permission } from '@infra/sequelize/models/Permission.model';
import { UserModel } from '@infra/sequelize/models/User.model';

export function associateRolePermission(sequelize: Sequelize) {
  Role.belongsToMany(Permission, {
    through: 'role_permissions',
    foreignKey: 'role_id',
    otherKey: 'permission_id',
    timestamps: false,
  });

  Permission.belongsToMany(Role, {
    through: 'role_permissions',
    foreignKey: 'permission_id',
    otherKey: 'role_id',
    timestamps: false,
  });

   UserModel.belongsTo(Role, {
    foreignKey: 'roleId',
    as: 'role'
  });
}