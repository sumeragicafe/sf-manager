import { DataTypes, Model, Sequelize } from 'sequelize';

export class AnimalModel extends Model {}

export function initAnimalModel(sequelize: Sequelize) {
  AnimalModel.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    species: {
      type: DataTypes.STRING,
      allowNull: false
    },
    breed: {
      type: DataTypes.STRING,
      allowNull: true
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Age in months'
    },
    gender: {
      type: DataTypes.ENUM('male', 'female'),
      allowNull: false
    },
    size: {
      type: DataTypes.ENUM('small', 'medium', 'large'),
      allowNull: false
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    healthStatus: {
      type: DataTypes.STRING,
      field: 'health_status',
      allowNull: true
    },
    isVaccinated: {
      type: DataTypes.BOOLEAN,
      field: 'is_vaccinated',
      defaultValue: false,
      allowNull: false
    },
    isCastrated: {
      type: DataTypes.BOOLEAN,
      field: 'is_castrated',
      defaultValue: false,
      allowNull: false
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      field: 'is_available',
      defaultValue: true,
      allowNull: false
    },
    adoptionFee: {
      type: DataTypes.DECIMAL(10, 2),
      field: 'adoption_fee',
      allowNull: true
    },
    imageUrl: {
      type: DataTypes.STRING,
      field: 'image_url',
      allowNull: true
    },
    rescueDate: {
      type: DataTypes.DATE,
      field: 'rescue_date',
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
    modelName: 'Animal',
    tableName: 'animals',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  });

  return AnimalModel;
} 