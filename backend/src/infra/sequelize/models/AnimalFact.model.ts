import { DataTypes, Model, Sequelize } from 'sequelize';

export class AnimalFact extends Model {}

export default (sequelize: Sequelize) => {

  AnimalFact.init(
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
      text: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'created_at'
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'updated_at'
      }
    },
    {
      sequelize,
      modelName: 'AnimalFact',
      tableName: 'animal_facts',
      timestamps: true,
      underscored: true
    }
  );

  return AnimalFact;
};

