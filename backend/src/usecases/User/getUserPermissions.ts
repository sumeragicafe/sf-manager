import { UserModel } from '@infra/sequelize/models/User.model';
import { Role } from '@infra/sequelize/models/Role.model';
import { Permission } from '@infra/sequelize/models/Permission.model';

export async function getUserPermissionsUseCase(userRepo: IUserRepository) {
  return async (userId: string) => {
    return await userRepo.getUserPermissions(userId);
  }
}