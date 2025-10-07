import { IAnimalRepository } from '@domain/repositories/IAnimalRepository';
import { PaginationOptions } from '@types/Pagination';

export function listAnimals(animalRepo: IAnimalRepository) {
  return async (pagination: PaginationOptions) => {
    return await animalRepo.findPaginated(pagination);
  };
}
