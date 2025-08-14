import { IAnimalRepository } from '@domain/repositories/IAnimalRepository';
import { Animal } from '@domain/entities/Animal';
import { PaginationOptions } from '@types/Pagination';


export function listAnimals(animalRepository: IAnimalRepository) {
  return async (pagination?: PaginationOptions) => {
    return await animalRepository.findAll(pagination);
  };
}