import { Request, Response } from 'express';
import { createAnimal } from '@usecases/Animal/createAnimal';
import { listAnimals } from '@usecases/Animal/listAnimals';
import { updateAnimal } from '@usecases/Animal/updateAnimal';
import { SequelizeAnimalRepository } from '@infra/sequelize/repositories/SequelizeAnimalRepository';
import { SequelizeSpeciesRepository } from '@infra/sequelize/repositories/SequelizeSpeciesRepository';
import { SequelizeBreedRepository } from '@infra/sequelize/repositories/SequelizeBreedRepository';

const animalRepo = new SequelizeAnimalRepository();
const speciesRepo = new SequelizeSpeciesRepository();
const breedRepo = new SequelizeBreedRepository();

export class AnimalController {
  static async create(req: Request, res: Response) {
    try {
      const animalData = req.body;

      const animalProps = await createAnimal(animalRepo)(animalData);

      res.status(201).json({ animalProps });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    } finally {
      return;
    }
  }

  static async list(req: Request, res: Response) {
    try {
      // Paginação e ordenação
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : 10;
      const sortBy = (req.query.sortBy as string) || 'entry_date';
      const sortOrder =
        (req.query.sortOrder as string)?.toLowerCase() === 'asc' ? 'asc' : 'desc' as 'asc' | 'desc';

      // Filtros (JSON string)
      let filters: Record<string, any> = {};
      if (req.query.filters && typeof req.query.filters === 'string') {
        try {
          filters = JSON.parse(req.query.filters);
        } catch {
          return res.status(400).json({ error: 'Invalid filters JSON format' });
        }
      }

      const includeRelations = req.query.includeRelations === 'true';

      const pagination = {
        page,
        pageSize,
        sortBy, 
        sortOrder,
        filters,
      };

      const result = await listAnimals(animalRepo)(
        pagination
      );

      res.status(200).json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
  

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const animal = await animalRepo.findById(id);
      
      if (!animal) {
        res.status(404).json({ error: 'Animal não encontrado.' });
        return;
      }

      res.status(200).json(animal);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }finally{
      return;
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedAnimal = await updateAnimal(animalRepo)(id, updateData);
      
      if (!updatedAnimal) {
        return res.status(404).json({ error: 'Animal não encontrado.' });
      }

      res.status(200).json({
        animal: updatedAnimal,
        message: 'Animal atualizado com sucesso!'
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    } finally {
      return;
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const deleted = await animalRepo.delete(id);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Registro de Vacina não encontrada' });
      }

      res.json({ message: 'Animal removido com sucesso!' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    } finally{
      return;
    }
  }
} 