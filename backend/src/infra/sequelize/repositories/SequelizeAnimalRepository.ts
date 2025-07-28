import { IAnimalRepository } from '@domain/repositories/IAnimalRepository';
import { Animal, AnimalProps } from '@domain/entities/Animal';
import { AnimalModel } from '@infra/sequelize/models/Animal.model';

export class SequelizeAnimalRepository implements IAnimalRepository {
    async create(animal: Animal): Promise<Animal> {
        const createdAnimal = await AnimalModel.create(animal.toPersistence());
        return new Animal(createdAnimal.dataValues as AnimalProps);
    }

    async findById(id: string): Promise<Animal | null> {
        const animal = await AnimalModel.findByPk(id);
        if (!animal) return null;
        return new Animal(animal.dataValues as AnimalProps);
    }

    async findAll(): Promise<Animal[]> {
        const animals = await AnimalModel.findAll({
            order: [['createdAt', 'DESC']]
        });
        return animals.map(animal => new Animal(animal.dataValues as AnimalProps));
    }

    async findAvailableForAdoption(): Promise<Animal[]> {
        const animals = await AnimalModel.findAll({
            where: {
                isAvailable: true
            },
            order: [['createdAt', 'DESC']]
        });
        return animals.map(animal => new Animal(animal.dataValues as AnimalProps));
    }

    async update(id: string, animalData: Partial<Animal>): Promise<Animal | null> {
        const [updatedRowsCount] = await AnimalModel.update(animalData, {
            where: { id }
        });

        if (updatedRowsCount === 0) return null;

        const updatedAnimal = await AnimalModel.findByPk(id);
        if (!updatedAnimal) return null;

        return new Animal(updatedAnimal.dataValues as AnimalProps);
    }

    async delete(id: string): Promise<boolean> {
        const deletedRowsCount = await AnimalModel.destroy({
            where: { id }
        });
        return deletedRowsCount > 0;
    }

    async markAsAdopted(id: string): Promise<boolean> {
        const [updatedRowsCount] = await AnimalModel.update(
            { 
                isAvailable: false,
                updatedAt: new Date()
            },
            { where: { id } }
        );
        return updatedRowsCount > 0;
    }

    async markAsAvailable(id: string): Promise<boolean> {
        const [updatedRowsCount] = await AnimalModel.update(
            { 
                isAvailable: true,
                updatedAt: new Date()
            },
            { where: { id } }
        );
        return updatedRowsCount > 0;
    }
} 