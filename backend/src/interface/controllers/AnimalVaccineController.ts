import { Request, Response } from 'express';
import { SequelizeAnimalVaccineRepository } from '@infra/sequelize/repositories/SequelizeAnimalVaccineRepository';

import { createAnimalVaccine } from '@usecases/AnimalVaccine/createAnimalVaccine';
import { listAnimalVaccines } from '@usecases/AnimalVaccine/listAnimalVaccines';
import { getAnimalVaccineById } from '@usecases/AnimalVaccine/getAnimalVaccineById';
import { updateAnimalVaccine } from '@usecases/AnimalVaccine/updateAnimalVaccine';
import { deleteAnimalVaccine } from '@usecases/AnimalVaccine/deleteAnimalVaccine';

const repo = new SequelizeAnimalVaccineRepository();

export class AnimalVaccineController {
  static async create(req: Request, res: Response) {
    try {
      const { petId } = req.params;
      const { vaccineId, applicationDate, applicator } = req.body;

      if (!petId || !vaccineId || !applicationDate) {
        return res.status(400).json({ error: 'petId, vaccineId e applicationDate são obrigatórios' });
      }

      const result = await createAnimalVaccine(repo)(
        petId,
        vaccineId,
        new Date(applicationDate),
        applicator
      );

      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async list(req: Request, res: Response) {
    try {
      const { petId } = req.params;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : 10;

      // Parse filters
      let filters: Record<string, any> = {};
      if (req.query.filters && typeof req.query.filters === 'string') {
        try {
          filters = JSON.parse(req.query.filters);
        } catch {
          filters = {};
        }
      }

      const result = await listAnimalVaccines(repo)(petId,
        {
            page,
            pageSize,
            filters,
            sortBy: (req.query.sortBy as string) || 'applicationDate',
            sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
        });

      res.status(200).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const vaccine = await getAnimalVaccineById(repo)(id);

      if (!vaccine) {
        return res.status(404).json({ error: 'AnimalVaccine não encontrada' });
      }

      res.status(200).json(vaccine);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;

      const updated = await updateAnimalVaccine(repo)(id, data);

      if (!updated) {
        return res.status(404).json({ error: 'AnimalVaccine não encontrada' });
      }

      res.status(200).json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const deleted = await deleteAnimalVaccine(repo)(id);

      if (!deleted) {
        return res.status(404).json({ error: 'AnimalVaccine não encontrada' });
      }

      res.status(204).send();
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
