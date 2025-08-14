import { DataTypes, Model, Sequelize } from 'sequelize';

export class Species extends Model {}
export default (sequelize: Sequelize) => {

  Species.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Species',
      tableName: 'species',
      timestamps: false,
      underscored: true
    }
  );

  return Species;
};
