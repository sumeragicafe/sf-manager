import { DataTypes, Model, Sequelize } from 'sequelize';

export class EventModel extends Model {
  public id!: string;
  public name!: string;
  public description!: string;
  public startAt!: Date;
  public endAt!: Date;
}

export function initEventModel(sequelize: Sequelize) {
  EventModel.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    startAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    endAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Event',
    tableName: 'events',
    timestamps: false,
  });
}