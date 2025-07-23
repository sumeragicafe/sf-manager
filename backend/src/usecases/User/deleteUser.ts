import { IUserRepository } from '@domain/repositories/IUserRepository';

export function deleteUser(userRepository: IUserRepository) {
  return async (userId: string): Promise<void> => {
    await userRepository.deleteById(userId);
  };
}
