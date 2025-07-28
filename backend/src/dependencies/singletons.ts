// src/app/dependencies.ts
import { SequelizeUserRepository } from '@infra/sequelize/repositories/SequelizeUserRepository';
import { SequelizeAnimalRepository } from '@infra/sequelize/repositories/SequelizeAnimalRepository';
import { SequelizeAdoptionRequestRepository } from '@infra/sequelize/repositories/SequelizeAdoptionRequestRepository';
import { AuthService } from '@infra/services/AuthService';

export const userRepositorySingleton = new SequelizeUserRepository();
export const animalRepositorySingleton = new SequelizeAnimalRepository();
export const adoptionRequestRepositorySingleton = new SequelizeAdoptionRequestRepository();
export const authServiceSingleton = new AuthService(process.env.SESSION_SECRET!);
