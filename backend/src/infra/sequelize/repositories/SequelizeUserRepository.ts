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
        return user ? user.toJSON() as User : null;
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
        return users.map(u => u.toJSON() as User);
    }


}