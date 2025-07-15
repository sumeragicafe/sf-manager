import { Request, Response } from 'express';
import { createPermission } from '@usecases/Permission/createPermission';
import { listPermissions } from '@usecases/Permission/listPermissions';
import { deletePermission } from '@usecases/Permission/deletePermission';
import { SequelizePermissionRepository } from '@infra/sequelize/repositories/SequelizePermissionRepository';

const permissionRepo = new SequelizePermissionRepository();

export class PermissionController {
  static async create(req: Request, res: Response) {
    try {
      const { name, description } = req.body;

      if (!name) {
        return res.status(400).json({ message: 'Nome é obrigatório' });
      }

      const permission = await createPermission(permissionRepo)(name, description);
      return res.status(201).json(permission);

    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  }

  static async list(req: Request, res: Response) {
    try {
      const permissions = await listPermissions(permissionRepo)();
      if (permissions.length === 0) {
        return res.json({ message: 'Nenhuma permissão encontrada' });
      }
      return res.json(permissions);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erro ao buscar permissões' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ message: 'ID da permissão é obrigatório' });
      }

      await deletePermission(permissionRepo)(id);
      return res.status(200).json({ message: 'Permissão deletada com sucesso' });

    } catch (err: any) {
      return res.status(404).json({ message: err.message });
    }
  }
}
