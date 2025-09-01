import { UserModel, initUserModel } from '@infra/sequelize/models/User.model';
import { Sequelize } from 'sequelize';
import { RoleModel, initRoleModel } from '@infra/sequelize/models/Role.model';
import { PermissionModel, initPermissionModel } from '@infra/sequelize/models/Permission.model';
import { AdoptionRequestModel, initAdoptionRequestModel } from '@infra/sequelize/models/AdoptionRequest.model';

import AnimalModel from '@infra/sequelize/models/Animal.model';
import SpeciesModel from "@infra/sequelize/models/Species.model";
import BreedModel from '@infra/sequelize/models/Breed.model';
import AnimalFactModel from '@infra/sequelize/models/AnimalFact.model';
import AnimalVaccineModel from '@infra/sequelize/models/AnimalVaccine.model';
import VaccineModel from '@infra/sequelize/models/Vaccine.model';
import MediaModel from '@infra/sequelize/models/Media.model';
import AnimalMediaModel from '@infra/sequelize/models/AnimalMedia.model';
import { initEventModel, EventModel } from '@infra/sequelize/models/Event.model';

export function initModels(sequelize: Sequelize) {
    // Inicializa os modelos
    const Species = SpeciesModel(sequelize);
    const Breed = BreedModel(sequelize);
    const Animal = AnimalModel(sequelize);
    const AnimalFact = AnimalFactModel(sequelize);
    const Vaccine = VaccineModel(sequelize);
    const AnimalVaccine = AnimalVaccineModel(sequelize);
    const Media = MediaModel(sequelize);
    const AnimalMedia = AnimalMediaModel(sequelize);

    initRoleModel(sequelize);
    initPermissionModel(sequelize);
    initUserModel(sequelize);
   
    initAdoptionRequestModel(sequelize);
    initEventModel(sequelize);

    // Ensure events table exists in development setups without migrations
    try {
        // This will create the table if it does not exist
        // and will be a no-op if it already exists
        EventModel.sync();
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Erro ao sincronizar tabela events:', err);
    }


   
    // Role -> Permission (M:N)
    RoleModel.belongsToMany(PermissionModel, {
        through: 'role_permissions',
        as: 'Permissions',
        foreignKey: 'role_id',
        otherKey: 'permission_id',
        timestamps: false,
    });

    // Permission -> Role (M:N)
    PermissionModel.belongsToMany(RoleModel, {
        through: 'role_permissions',
        as: 'Roles',
        foreignKey: 'permission_id',
        otherKey: 'role_id',
        timestamps: false,
    });

    // User -> Role (1:N)
    UserModel.belongsTo(RoleModel, {
        foreignKey: 'role_id',
        as: 'role'
    });

    AdoptionRequestModel.belongsTo(Animal, {
        foreignKey: 'animalId',
        as: 'animal'
    });

    AdoptionRequestModel.belongsTo(UserModel, {
        foreignKey: 'reviewedBy',
        as: 'reviewer'
    });

    Species.hasMany(Breed, { foreignKey: 'species_id' });
    Breed.belongsTo(Species, { foreignKey: 'species_id' });

    Species.hasMany(Animal, { foreignKey: 'species_id' });
    Breed.hasMany(Animal, { foreignKey: 'breed_id' });
    Animal.belongsTo(Species, { foreignKey: 'species_id' });
    Animal.belongsTo(Breed, { foreignKey: 'breed_id' });

    Animal.hasMany(AnimalFact, { foreignKey: 'pet_id' });
    AnimalFact.belongsTo(Animal, { foreignKey: 'pet_id' });

    Animal.hasMany(AnimalVaccine, { foreignKey: 'pet_id' });
    AnimalVaccine.belongsTo(Animal, { foreignKey: 'pet_id' });

    Vaccine.hasMany(AnimalVaccine, { foreignKey: 'vaccine_id' });
    AnimalVaccine.belongsTo(Vaccine, { foreignKey: 'vaccine_id' });

    Animal.hasMany(AnimalMedia, { foreignKey: 'pet_id' });
    AnimalMedia.belongsTo(Animal, { foreignKey: 'pet_id' });

    Media.hasMany(AnimalMedia, { foreignKey: 'media_id' });
    AnimalMedia.belongsTo(Media, { foreignKey: 'media_id' });


}