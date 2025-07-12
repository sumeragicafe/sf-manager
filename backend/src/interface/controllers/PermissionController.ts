// src/interface/controllers/PermissionController.ts
import { Request, Response } from 'express';
import { Permission } from '@infra/sequelize/models/Permission.model';

export class PermissionController {
    static async create(req: Request, res: Response) {
        try {
            const { name, description } = req.body;

            if (!name) {
            return res.status(400).json({ message: 'Nome é obrigatório' });
            }

            const existing = await Permission.findOne({ where: { name } });
            if (existing) {
            return res.status(409).json({ message: 'Permissão já existe' });
            }

            const permission = await Permission.create({ name, description });
            return res.status(201).json(permission);

        } catch (err) {

            console.error(err);
            return res.status(500).json({ message: 'Erro ao criar permissão' });

        }
    }

    static async list(req: Request, res: Response) {
        try {
            const permissions = await Permission.findAll();

            if(permissions.length == 0){
            return res.json({ message: 'Nenhuma Permissão encontrada' });
            }
            return res.json(permissions);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erro ao buscar permissões' });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id) {
            return res.status(400).json({ message: 'ID da permissão é obrigatório' });
            }

            const permission = await Permission.findByPk(id);

            if (!permission) {
            return res.status(404).json({ message: 'Permissão não encontrada' });
            }

            await permission.destroy();

            return res.status(200).json({ message: 'Permissão deletada com sucesso' });
        } catch (error) {
            console.error('Erro ao deletar permissão:', error);
            return res.status(500).json({ message: 'Erro interno ao deletar permissão' });
        }
    }

}
