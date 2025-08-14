import { DataTypes, Model, Sequelize } from 'sequelize';

export class AnimalModel extends Model {}

export default (sequelize: Sequelize) => {

  AnimalModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      speciesId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'species_id'
      },
      breedId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'breed_id'
      },
      gender: DataTypes.STRING(1),
      size: DataTypes.STRING(20),
      status: DataTypes.STRING(50),
      isCastrated: {
        type: DataTypes.BOOLEAN,
        field: 'is_castrated'
      },
      notes: DataTypes.TEXT,
      entryDate: {
        type: DataTypes.DATE,
        field: 'entry_date'
      },
      birthDate: {
        type: DataTypes.DATE,
        field: 'birth_date'
      },
      isBirthDateEstimated: {
        type: DataTypes.BOOLEAN,
        field: 'is_birth_date_estimated'
      }
    },
    {
      sequelize,
      modelName: 'Animal',
      tableName: 'animals',
      timestamps: false,
      underscored: true
    }
  );

  return AnimalModel;
};


