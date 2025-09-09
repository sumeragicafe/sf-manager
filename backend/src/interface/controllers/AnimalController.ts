import { Request, Response } from 'express';
import { createAnimal } from '@usecases/Animal/createAnimal';
import { listAnimals } from '@usecases/Animal/listAnimals';
import { updateAnimal } from '@usecases/Animal/updateAnimal';
import { SequelizeAnimalRepository } from '@infra/sequelize/repositories/SequelizeAnimalRepository';

const animalRepo = new SequelizeAnimalRepository();

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
      const page = req.body.page ? parseInt(req.body.page as string, 10) : 1;
      const pageSize = req.body.pageSize ? parseInt(req.body.pageSize as string, 10) : 10;

      const animals = await listAnimals(animalRepo)({ page, pageSize });
      
      res.status(200).json(animals);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    } finally {
      return;
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

      res.status(201).json({
        updatedAnimal,
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
        return res.status(404).json({ error: 'Animal não encontrado.' });
      }

      res.json({ message: 'Animal removido com sucesso!' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    } finally{
      return;
    }
  }
} 