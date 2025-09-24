import { Request, Response } from 'express';
import { SequelizeBreedRepository } from '@infra/sequelize/repositories/SequelizeBreedRepository';

const breedRepo = new SequelizeBreedRepository();

export class BreedController {
  static async getAll(req: Request, res: Response) {
    try {
      const { page = 1, pageSize = 10, search = '' } = req.query;
      const data = await breedRepo.searchByName(String(search), {
        page: Number(page),
        pageSize: Number(pageSize),
      });
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar raças', details: err });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const breed = await breedRepo.findById(Number(id));
      if (!breed) return res.status(404).json({ error: 'Raça não encontrada' });
      res.json(breed);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar raça', details: err });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { name, speciesId } = req.body;
      const breed = await breedRepo.create({ name, speciesId });
      res.status(201).json(breed);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao criar raça', details: err });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;
      const breed = await breedRepo.update(Number(id), data);
      if (!breed) return res.status(404).json({ error: 'Raça não encontrada' });
      res.json(breed);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao atualizar raça', details: err });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await breedRepo.delete(Number(id));
      if (!deleted) return res.status(404).json({ error: 'Raça não encontrada' });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao deletar raça', details: err });
    }
  }

  static async getBySpecies(req: Request, res: Response) {
    try {
      const { speciesId, search = '', page = 1, pageSize = 10 } = req.query;
      const data = await breedRepo.findBySpecies(
        speciesId ? Number(speciesId) : undefined,
        String(search),
        { page: Number(page), pageSize: Number(pageSize) }
      );
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar raças por espécie', details: err });
    }
  }

}
