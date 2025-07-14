// src/app/dependencies.ts
import { SequelizeUserRepository } from '@infra/sequelize/repositories/SequelizeUserRepository';
import { AuthService } from '@infra/services/AuthService';

export const userRepositorySingleton = new SequelizeUserRepository();
export const authServiceSingleton = new AuthService(process.env.SESSION_SECRET!);
