import { User, UserProps } from '@domain/entities/User';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import bcrypt from 'bcrypt';


export function updateUser(userRepo: IUserRepository) {
  return async (data: UserProps): Promise<User> => {
    const existingUser = await userRepo.findById(data.id);

    if(!existingUser){
      throw new Error('Usuário não encontrado');
    }

    if(data.email != null){
      const emailIsUsed = await userRepo.findByEmail(data.email);
      
      if (emailIsUsed && emailIsUsed.props.id !== existingUser.props.id) {
        throw new Error('User already exists with this email');
      }
    }

    if(data.username != null){
      const usernameIsUsed = await userRepo.findByUsername(data.username);
      if (usernameIsUsed && usernameIsUsed.props.id !== existingUser.props.id){
        throw new Error('User already exists with this username');
      }
    }


    // Atualiza somente os campos recebidos (preservando os demais)
    const updatedUser = new User({
      ...existingUser.props,
      username: data.username ?? existingUser.props.username,
      name: data.name ?? existingUser.props.name,
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
