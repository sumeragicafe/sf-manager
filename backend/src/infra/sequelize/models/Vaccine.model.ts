import { DataTypes, Model, Sequelize } from 'sequelize';

export class Vaccine extends Model {}
export default (sequelize: Sequelize) => {

  Vaccine.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      description: DataTypes.TEXT
    },
    {
      sequelize,
      modelName: 'Vaccine',
      tableName: 'vaccine',
      timestamps: false,
      underscored: true
    }
  );

  return Vaccine;
};
