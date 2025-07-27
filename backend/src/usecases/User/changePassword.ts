import { User } from '@domain/entities/User';
import bcrypt from 'bcrypt'
import { IUserRepository } from "@domain/repositories/IUserRepository";

export function changePassword(userRepo: IUserRepository) {
  return async (userId: string, currentPassword: string, newPassword: string): Promise<void> => {
    const user = await userRepo.findById(userId);

    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.props.password);
    if (!isMatch) {
      throw new Error('Senha atual incorreta.');
    }

    // Criptografa nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualiza a senha no usuário (mantém outras propriedades)
    const updatedUser = new User({
      ...user.props,
      password: hashedPassword,
      updatedAt: new Date(),
    });

    await userRepo.update(updatedUser);
  };
}
