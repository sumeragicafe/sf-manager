import bcrypt from 'bcrypt';
import { User } from '@domain/entities/User';
import { IUserRepository } from "@domain/repositories/IUserRepository";

export function adminChangePassword(userRepo: IUserRepository) {
  return async (userId: string, newPassword: string): Promise<string> => {
    const user = await userRepo.findById(userId);

    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = new User({
      ...user.props,
      password: hashedPassword,
      updatedAt: new Date(),
    });

    await userRepo.update(updatedUser);

    return `Senha alterada com sucesso para o usuário ${user.props.username}`;
  };
}
