import { IUserRepository } from '@domain/repositories/IUserRepository';

export function listUserPermissions(userRepo: IUserRepository) {
  return async (userId: string) => {
    return await userRepo.getUserPermissions(userId);
  }
}