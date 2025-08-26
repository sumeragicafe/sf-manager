import { DataTypes, Model, Sequelize } from 'sequelize';

export class AdoptionRequestModel extends Model {}

export function initAdoptionRequestModel(sequelize: Sequelize) {
  AdoptionRequestModel.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    responsibleName: {
      type: DataTypes.STRING,
      field: 'responsible_name',
      allowNull: false
    },
    contactPhone: {
      type: DataTypes.STRING,
      field: 'contact_phone',
      allowNull: false
    },
    animalId: {
      type: DataTypes.UUID,
      field: 'animal_id',
      allowNull: false,
      references: {
        model: 'animals',
        key: 'id'
      }
    },
    termsAccepted: {
      type: DataTypes.BOOLEAN,
      field: 'terms_accepted',
      allowNull: false,
      defaultValue: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'completed'),
      defaultValue: 'pending',
      allowNull: false
    },
    submittedAt: {
      type: DataTypes.DATE,
      field: 'submitted_at',
      allowNull: true
    },
    reviewedAt: {
      type: DataTypes.DATE,
      field: 'reviewed_at',
      allowNull: true
    },
    reviewedBy: {
      type: DataTypes.UUID,
      field: 'reviewed_by',
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
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
    modelName: 'AdoptionRequest',
    tableName: 'adoption_requests',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  });

  return AdoptionRequestModel;
}

