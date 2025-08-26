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
      type: DataTypes.STRING(50),
      text: DataTypes.TEXT,
      date: DataTypes.DATE
    },
    {
      sequelize,
      modelName: 'AnimalFact',
      tableName: 'animal_facts',
      timestamps: false,
      underscored: true
    }
  );

  return AnimalFact;
};
