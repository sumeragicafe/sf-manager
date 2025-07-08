import { User } from '@domain/entities/User';
import { UserRepository } from '@domain/repositories/UserRepository';
import bcrypt from 'bcrypt';

interface RegisterUserDTO {
  name: string;
  username: string;
  email: string;
  password: string;
  role?: string;
}

export function registerUser(userRepo: UserRepository) {
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
      role
    });

    return await userRepo.save(user);
  };
}
