import { User } from '@domain/entities/User';

export interface IUserRepository {
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    findByName(name: string): Promise<User[] | null>;
    save(user: User): Promise<User>;
    getUserPermissions(userId: string): Promise<String[] | null>
    getUserRoleWithPermissions(userId: string): Promise<Object | null>
}