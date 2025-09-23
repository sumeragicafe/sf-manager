import { DataTypes, Model, Sequelize } from 'sequelize';

export class ContactMessageModel extends Model {}

export function initContactMessageModel(sequelize: Sequelize) {
  ContactMessageModel.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    acceptPolicy: {
      type: DataTypes.BOOLEAN,
      field: 'accept_policy',
      allowNull: false
    },
    allowContact: {
      type: DataTypes.BOOLEAN,
      field: 'allow_contact',
      allowNull: false,
      defaultValue: false
    },
    read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'ContactMessage',
    tableName: 'contact_messages',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  });

  return ContactMessageModel;
}


