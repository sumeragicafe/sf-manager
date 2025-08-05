import bcrypt from 'bcrypt';
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { User } from '@domain/entities/User';
import { UserModel } from '@infra/sequelize/models/User.model';
import { RoleModel } from '@infra/sequelize/models/Role.model';
import { PermissionModel } from '@infra/sequelize/models/Permission.model';


export class SequelizeUserRepository implements IUserRepository{
    async save(user: User): Promise <User> {
        const created = await UserModel.create(user.toPersistence());
        return new User(created.toJSON());
    }

    async update(user: User): Promise<User> {
        const persistedUser = await UserModel.findByPk(user.props.id);

        if (!persistedUser) {
            throw new Error(`Usuário com id ${user.props.id} não encontrado para atualização.`);
        }

        await persistedUser.update(user.toPersistence());

        return new User(persistedUser.toJSON());
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
        const users = await UserModel.findAll({
            include: [
            {
                model: RoleModel,
                as: 'role',
                attributes: ['name'],
            }
            ],
        });
        return users.map(u => new User(u.toJSON()));
    }

    async getUserPermissions(userId: string): Promise<string[]> {
        const user = await UserModel.findByPk(userId, {
        include: {
            model: RoleModel,
            as: 'role',
            include: [{
            model: PermissionModel,
            as: 'Permissions'
            }]
        }
        });

        if (!user || !user.role || !user.role.Permissions) {
        return [];
        }

        return user.role.Permissions.map(p => p.name);
    }

    async getUserRoleWithPermissions(userId: string): Promise<{
        id: string;
        name: string;
        description?: string;
        permissions: {
            id: string;
            name: string;
            description?: string;
        }[];
        } | null> {
        const user = await UserModel.findByPk(userId, {
            include: {
            model: RoleModel,
            as: 'role',
            include: [{
                model: PermissionModel,
                as: 'Permissions'
            }]
            }
        });

        if (!user || !user.role) return null;

        const role = user.role as any;

        return {
            id: role.id,
            name: role.name,
            description: role.description,
            permissions: role.Permissions?.map((perm: any) => ({
            id: perm.id,
            name: perm.name,
            description: perm.description
            })) || []
        };
    }

    async deleteById(id: string): Promise<void> {
        const deletedCount = await UserModel.destroy({ where: { id } });

        if (deletedCount === 0) {
            throw new Error(`Usuário com id ${id} não encontrado para exclusão.`);
        }
    }
}