import { DataTypes, Model, Sequelize } from 'sequelize';

export class AnimalMedia extends Model {}
export default (sequelize: Sequelize) => {

  AnimalMedia.init(
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
      mediaId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'media_id'
      },
      type: DataTypes.STRING(50)
    },
    {
      sequelize,
      modelName: 'AnimalMedia',
      tableName: 'animal_media',
      timestamps: false,
      underscored: true
    }
  );

  return AnimalMedia;
};
