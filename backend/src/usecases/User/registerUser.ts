import { User } from '@domain/entities/User';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import bcrypt from 'bcrypt';

interface RegisterUserDTO {
  name: string;
  username: string;
  email: string;
  password: string;
  role?: string;
}

export function registerUser(userRepo: IUserRepository) {
  return async (data: RegisterUserDTO): Promise<User> => {
    const { name, username, email, password, role } = data;

    const existing = await userRepo.findByEmail(email);
    if (existing) {
      throw new Error('User already exists with this email');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = User.createNew({
      name,
      username,
      email,
      password: hashedPassword,
      isActive: true,
      roleId: data.role
    });

    return await userRepo.save(user);
  };
}
