import { DataTypes, Model, Sequelize } from 'sequelize';

export class PermissionModel extends Model {
  public id!: string;
  public name!: string;
  public description?: string;
}

export function initPermissionModel(sequelize: Sequelize) {
  PermissionModel.init({
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
    modelName: 'Permission',
    tableName: 'permissions',
    timestamps: false,
  });
}