import { User } from '@domain/entities/User';

export interface UserRepository {
    findByEmail(email: string): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    findByName(name: string): Promise<User[] | null>;
    save(user: User): Promise<User>;
}