import { Request, Response } from 'express';
import { SequelizeAnimalFactRepository } from '@infra/sequelize/repositories/SequelizeAnimalFactRepository';
import { createAnimalFact } from '@usecases/AnimalFact/createAnimalFact';
import { listAnimalFacts } from '@usecases/AnimalFact/listAnimalFacts';
import { updateAnimalFact } from '@usecases/AnimalFact/updateAnimalFact';
import { deleteAnimalFact } from '@usecases/AnimalFact/deleteAnimalFact';

const animalFactRepo = new SequelizeAnimalFactRepository();

export class AnimalFactController {
  static async create(req: Request, res: Response) {
    try {
      const petId = req.params.petId;
      const {text} = req.body;
      const fact = await createAnimalFact(animalFactRepo)({petId, text});
      res.status(201).json(fact);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async list(req: Request, res: Response) {
    try {
      const petId = req.params.petId;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : 10;

      let filters: Record<string, any> = {};
      if (req.query.filters && typeof req.query.filters === 'string') {
        try {
          filters = JSON.parse(req.query.filters);
        } catch {
          filters = {};
        }
      }

      const result = await listAnimalFacts(animalFactRepo)(petId, {
        page,
        pageSize,
        filters
      });

      res.status(200).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { factId } = req.params;
      const {text} = req.body;
      const updated = await updateAnimalFact(animalFactRepo)(factId, {text});
      res.status(200).json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { factId } = req.params;
      await deleteAnimalFact(animalFactRepo)(factId);
      res.status(204).send();
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
