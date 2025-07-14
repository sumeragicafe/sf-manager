import { DataTypes, Model, Sequelize } from 'sequelize';
import { PermissionModel } from '@infra/sequelize/models/Permission.model';

export class RoleModel extends Model {
  public id!: string;
  public name!: string;
  public description?: string;

  public setPermissions!: (permissions: string[] | PermissionModel[]) => Promise<void>;
}

export function initRoleModel(sequelize: Sequelize) {
  RoleModel.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'Role',
    tableName: 'roles',
    timestamps: false,
  });
}

