import { IAnimalFactRepository } from '@domain/repositories/IAnimalFactRepository';
import { AnimalFactProps } from '@domain/entities/AnimalFact';

export function createAnimalFact(animalFactRepository: IAnimalFactRepository) {
  return async (data: Omit<AnimalFactProps, 'id'>): Promise<AnimalFactProps> => {
    if (!data.text || !data.petId) {
      throw new Error('PetId e texto do fato são obrigatórios');
    }

    return await animalFactRepository.create(data);
  };
}
