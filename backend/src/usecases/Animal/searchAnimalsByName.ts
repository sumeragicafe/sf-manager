import { IAnimalRepository } from '@domain/repositories/IAnimalRepository';
import { PaginationOptions } from '@types/Pagination';

export function searchAnimalsByName(animalRepository: IAnimalRepository) {
  return async (name: string, pagination?: PaginationOptions) => {
    return await animalRepository.searchByName(name, pagination);
  };
}