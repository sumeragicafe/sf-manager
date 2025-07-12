import { IUserRepository } from "@domain/repositories/IUserRepository";
import { User } from '@domain/entities/User';
import { UserModel } from '@infra/sequelize/models/User.model'

export class SequelizeUserRepository implements IUserRepository{
    async save(user: User): Promise <User> {
        const created = await UserModel.create(user.toPersistence());
        return new User(created.toJSON());
    }

    async findById(id: string): Promise<User | null> {
        const user = await UserModel.findByPk(id);
        return user ? new User(user.toJSON()) : null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const result = await UserModel.findOne({where: {email}});
        return result ? new User(result.toJSON()): null;
    }

    async findByUsername(username: string): Promise<User | null> {
        const result = await UserModel.findOne({ where: { username } });
        return result ? new User(result.toJSON()) : null;
    }

    async findByName(name: string): Promise<User[]> {
        const results = await UserModel.findAll({ where: { name } });
        return results.map(r => new User(r.toJSON()));
    }

    async list(): Promise<User[]> {
        const users = await UserModel.findAll();
        return users.map(u => new User(u.toJSON()));
    }

    async getUserPermissions(userId: string): Promise<string[]> {
        const user = await UserModel.findByPk(userId, {
        include: {
            model: Role,
            as: 'role',
            include: [{
            model: Permission,
            as: 'permissions'
            }]
        }
        });

        if (!user || !user.role || !user.role.permissions) {
        return [];
        }

        return user.role.permissions.map(p => p.name);
    }


}