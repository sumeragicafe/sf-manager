import { DataTypes, Model, Sequelize } from 'sequelize';

export class Media extends Model {}
export default (sequelize: Sequelize) => {

  Media.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      fileName: {
        type: DataTypes.STRING(255),
        field: 'file_name'
      },
      mimeType: {
        type: DataTypes.STRING(100),
        field: 'mime_type'
      },
      data: DataTypes.BLOB('long'),
      isPublic: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_public'
      },
      uploadDate: {
        type: DataTypes.DATE,
        field: 'upload_date'
      }
    },
    {
      sequelize,
      modelName: 'Media',
      tableName: 'media',
      timestamps: false,
      underscored: true
    }
  );

  return Media;
};
