import { IAnimalRepository } from '@domain/repositories/IAnimalRepository';
import { Animal } from '@domain/entities/Animal';

interface ListAnimalsFilters {
    availableOnly?: boolean;
    species?: string;
    size?: string;
}

export const listAnimals = (
    animalRepository: IAnimalRepository
) => async (filters?: ListAnimalsFilters): Promise<Animal[]> => {
    if (filters?.availableOnly) {
        return await animalRepository.findAvailableForAdoption();
    }

    // For now, return all animals (can be enhanced with more filters later)
    return await animalRepository.findAll();
}; 