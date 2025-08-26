import { DataTypes, Model, Sequelize } from 'sequelize';
export class AnimalVaccine extends Model {}

export default (sequelize: Sequelize) => {

  AnimalVaccine.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      petId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'pet_id'
      },
      vaccineId: {
        type: DataTypes.INTEGER,
        field: 'vaccine_id'
      },
      applicationDate: {
        type: DataTypes.DATE,
        field: 'application_date'
      },
      applicator: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'AnimalVaccine',
      tableName: 'animal_vaccines',
      timestamps: false,
      underscored: true
    }
  );

  return AnimalVaccine;
};
