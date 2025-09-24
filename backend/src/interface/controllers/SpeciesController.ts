import { Request, Response } from 'express';
import { SequelizeSpeciesRepository } from '@infra/sequelize/repositories/SequelizeSpeciesRepository';

const speciesRepo = new SequelizeSpeciesRepository();

export class SpeciesController {
  static async getAll(req: Request, res: Response) {
    try {
      const { page = 1, pageSize = 10, search = '' } = req.query;
      const data = await speciesRepo.searchByName(String(search), {
        page: Number(page),
        pageSize: Number(pageSize),
      });
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar espécies', details: err });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const species = await speciesRepo.findById(Number(id));
      if (!species) return res.status(404).json({ error: 'Espécie não encontrada' });
      res.json(species);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar espécie', details: err });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { name } = req.body;
      const species = await speciesRepo.create({ name });
      res.status(201).json(species);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao criar espécie', details: err });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;
      const species = await speciesRepo.update(Number(id), data);
      if (!species) return res.status(404).json({ error: 'Espécie não encontrada' });
      res.json(species);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao atualizar espécie', details: err });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await speciesRepo.delete(Number(id));
      if (!deleted) return res.status(404).json({ error: 'Espécie não encontrada' });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao deletar espécie', details: err });
    }
  }
}
