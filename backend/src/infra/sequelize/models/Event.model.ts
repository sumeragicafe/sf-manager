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
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    place: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    start_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_at: {
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