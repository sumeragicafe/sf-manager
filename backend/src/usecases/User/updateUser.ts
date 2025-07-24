import { User, UserProps } from '@domain/entities/User';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import bcrypt from 'bcrypt';

// interface UpdateUserDTO {
//   id: string;
//   name?: string;
//   username?: string;
//   email?: string;
//   password?: string;
//   isActive?: boolean;
//   roleId?: string;
// }

export function updateUser(userRepo: IUserRepository) {
  return async (data: UserProps): Promise<User> => {
    const existingUser = await userRepo.findById(data.id);

    if (!existingUser) {
      throw new Error('Usuário não encontrado');
    }

    // Atualiza somente os campos recebidos (preservando os demais)
    const updatedUser = new User({
      ...existingUser.props,
      name: data.name ?? existingUser.props.name,
      username: data.username ?? existingUser.props.username,
      email: data.email ?? existingUser.props.email,
      isActive: data.isActive ?? existingUser.props.isActive,
      roleId: data.roleId ?? existingUser.props.roleId,
      password: data.password
        ? await bcrypt.hash(data.password, 10)
        : existingUser.props.password,
    });

    return await userRepo.update(updatedUser);
  };
}
