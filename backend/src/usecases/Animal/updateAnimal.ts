import { IAnimalRepository } from '@domain/repositories/IAnimalRepository';
import { AnimalProps } from '@domain/entities/Animal';

export function updateAnimal(animalRepository: IAnimalRepository) {
  return async (id: string, data: Partial<Omit<AnimalProps, 'id'>>) => {
    const updated = await animalRepository.update(id, data);
    if (!updated) throw new Error('Animal not found');
    return updated;
  };
}