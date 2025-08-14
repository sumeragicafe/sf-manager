import { DataTypes, Model, Sequelize } from 'sequelize';

export class Breed extends Model {}
export default (sequelize: Sequelize) => {

  Breed.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      speciesId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'species_id'
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Breed',
      tableName: 'breeds',
      timestamps: false,
      underscored: true
    }
  );

  return Breed;
};
