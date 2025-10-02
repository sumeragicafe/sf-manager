import { IAnimalFactRepository } from '@domain/repositories/IAnimalFactRepository';
import { AnimalFactProps } from '@domain/entities/AnimalFact';
import { PaginationOptions, PaginatedResult } from '@types/Pagination';

export function listAnimalFacts(animalFactRepository: IAnimalFactRepository) {
  return async (petId: string, options: PaginationOptions): Promise<PaginatedResult<AnimalFactProps>> => {
    if (!petId) {
      throw new Error('petId é obrigatório para listar os fatos');
    }

    return await animalFactRepository.findByPet(petId, options);
  };
}
