import { IAnimalRepository } from '@domain/repositories/IAnimalRepository';
import { Animal, AnimalProps } from '@domain/entities/Animal';

type CreateAnimalInput = Omit<AnimalProps, 'id' | 'createdAt' | 'updatedAt'>;

export const createAnimal = (
    animalRepository: IAnimalRepository
) => async (input: CreateAnimalInput): Promise<Animal> => {
    // Create new animal entity
    const animal = Animal.createNew(input);

    // Save to repository
    const createdAnimal = await animalRepository.create(animal);

    return createdAnimal;
}; 