import { User } from '@domain/entities/User';

export interface IUserRepository {
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    findByName(name: string): Promise<User[] | null>;
    save(user: User): Promise<User>;
    update(user: User): Promise<User>; 
    getUserPermissions(userId: string): Promise<String[] | null>
    getUserRoleWithPermissions(userId: string): Promise<Object | null>
    deleteById(id: string): Promise<void>; 
    // changePassword(userId: string, currentPassword: string, newPassword: string): Promise<string>;
    // adminChangePassword(userId: string, newPassword: string): Promise<boolean>;
}