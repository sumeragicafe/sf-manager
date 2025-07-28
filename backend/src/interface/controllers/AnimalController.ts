import { Request, Response } from 'express';
import { animalRepositorySingleton } from 'src/dependencies/singletons';

import { createAnimal } from '@usecases/Animal/createAnimal';
import { listAnimals } from '@usecases/Animal/listAnimals';

export class AnimalController {
  static async create(req: Request, res: Response) {
    try {
      const animalData = req.body;

      // Validate required fields
      if (!animalData.name || !animalData.species || !animalData.gender || !animalData.size) {
        return res.status(400).json({
          error: 'Nome, espécie, gênero e tamanho são obrigatórios.'
        });
      }

      const animal = await createAnimal(animalRepositorySingleton)(animalData);

      res.status(201).json({
        id: animal.props.id,
        name: animal.props.name,
        species: animal.props.species,
        breed: animal.props.breed,
        age: animal.props.age,
        gender: animal.props.gender,
        size: animal.props.size,
        color: animal.props.color,
        description: animal.props.description,
        isVaccinated: animal.props.isVaccinated,
        isCastrated: animal.props.isCastrated,
        isAvailable: animal.props.isAvailable,
        adoptionFee: animal.props.adoptionFee,
        imageUrl: animal.props.imageUrl,
        createdAt: animal.props.createdAt
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async list(req: Request, res: Response) {
    try {
      const { availableOnly } = req.query;

      const animals = await listAnimals(animalRepositorySingleton)({
        availableOnly: availableOnly === 'true'
      });

      const formattedAnimals = animals.map(animal => ({
        id: animal.props.id,
        name: animal.props.name,
        species: animal.props.species,
        breed: animal.props.breed,
        age: animal.props.age,
        ageInYears: animal.ageInYears,
        gender: animal.props.gender,
        size: animal.props.size,
        color: animal.props.color,
        description: animal.props.description,
        healthStatus: animal.props.healthStatus,
        isVaccinated: animal.props.isVaccinated,
        isCastrated: animal.props.isCastrated,
        isAvailable: animal.props.isAvailable,
        adoptionFee: animal.props.adoptionFee,
        imageUrl: animal.props.imageUrl,
        rescueDate: animal.props.rescueDate,
        createdAt: animal.props.createdAt,
        displayName: animal.displayName
      }));

      res.json(formattedAnimals);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const animal = await animalRepositorySingleton.findById(id);
      
      if (!animal) {
        return res.status(404).json({ error: 'Animal não encontrado.' });
      }

      res.json({
        id: animal.props.id,
        name: animal.props.name,
        species: animal.props.species,
        breed: animal.props.breed,
        age: animal.props.age,
        ageInYears: animal.ageInYears,
        gender: animal.props.gender,
        size: animal.props.size,
        color: animal.props.color,
        description: animal.props.description,
        healthStatus: animal.props.healthStatus,
        isVaccinated: animal.props.isVaccinated,
        isCastrated: animal.props.isCastrated,
        isAvailable: animal.props.isAvailable,
        adoptionFee: animal.props.adoptionFee,
        imageUrl: animal.props.imageUrl,
        rescueDate: animal.props.rescueDate,
        createdAt: animal.props.createdAt,
        displayName: animal.displayName
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedAnimal = await animalRepositorySingleton.update(id, updateData);
      
      if (!updatedAnimal) {
        return res.status(404).json({ error: 'Animal não encontrado.' });
      }

      res.json({
        id: updatedAnimal.props.id,
        name: updatedAnimal.props.name,
        species: updatedAnimal.props.species,
        isAvailable: updatedAnimal.props.isAvailable,
        updatedAt: updatedAnimal.props.updatedAt,
        message: 'Animal atualizado com sucesso!'
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const deleted = await animalRepositorySingleton.delete(id);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Animal não encontrado.' });
      }

      res.json({ message: 'Animal removido com sucesso!' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
} 