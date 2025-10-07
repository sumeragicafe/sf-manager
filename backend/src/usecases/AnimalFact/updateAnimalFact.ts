import { IAnimalFactRepository } from '@domain/repositories/IAnimalFactRepository';
import { AnimalFactProps } from '@domain/entities/AnimalFact';

export function updateAnimalFact(animalFactRepository: IAnimalFactRepository) {
  return async (factId: string, data: Partial<Omit<AnimalFactProps, 'id'>>): Promise<AnimalFactProps | null> => {
    if (!factId) {
      throw new Error('ID do fato é obrigatório');
    }
    
    return await animalFactRepository.update(factId, data);
  };
}
