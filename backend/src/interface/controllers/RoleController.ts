import { Request, Response } from 'express';
import { SequelizeRoleRepository } from '@infra/sequelize/repositories/SequelizeRoleRepository';
import { createRole } from '@usecases/Roles/createRole';
import { listRoles } from '@usecases/Roles/listRoles';
import { deleteRole } from '@usecases/Roles/deleteRole';
import { getRoleWithPermissions } from '@usecases/Roles/getRoleWithPermissions';
import { assignPermissionsToRole } from '@usecases/Roles/assignPermissionsToRole';
import { updateRole } from '@usecases/Roles/updateRole';

const roleRepo = new SequelizeRoleRepository();

export class RoleController {

  static async create(req: Request, res: Response) {
    try {
      const { name, description } = req.body;
      const role = await createRole(roleRepo)(name, description);

      res.status(201).json({
        id: role.props.id,
        name: role.props.name,
        description: role.props.description
      });
      return;
    } catch (err: any) {
      res.status(400).json({ error: err.message });
      return;
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description, permissionIds } = req.body;

      const role = await updateRole(roleRepo)(id, name, description, permissionIds);

      res.status(200).json({
        id: role.props.id,
        name: role.props.name,
        description: role.props.description,
        permissions: role.props.permissions
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async list(req: Request, res: Response) {
    try {
      const roles = await listRoles(roleRepo)();
      if (roles.length === 0) {
        res.json({ message: 'Nenhum cargo encontrado' });
        return;
      }
      res.json(roles);
      return;
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro ao buscar cargos' });
      return;
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const role = await getRoleWithPermissions(roleRepo)(id);
      res.json(role);
      return;
    } catch (err: any) {
      res.status(404).json({ error: err.message });
      return;
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await deleteRole(roleRepo)(id);
      res.json({ message: 'Cargo deletado com sucesso' });
      return;
    } catch (err: any) {
      res.status(404).json({ error: err.message });
      return;
    }
  }

  static async assignPermissions(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { permissionIds } = req.body;

      if (!Array.isArray(permissionIds)) {
        res.status(400).json({ error: 'permissionIds deve ser um array' });
        return;
      }

      const updatedRole = await assignPermissionsToRole(roleRepo)(id, permissionIds);
      res.json(updatedRole);
      return;

    } catch (err: any) {
      res.status(400).json({ error: err.message });
      return;
    }
  }
}
