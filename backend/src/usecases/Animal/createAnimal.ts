import { IAnimalRepository } from '@domain/repositories/IAnimalRepository';
import { AnimalProps, Animal } from '@domain/entities/Animal';

export function createAnimal(animalRepository: IAnimalRepository) {
  return async (data: Omit<AnimalProps, 'id'>): Promise<Animal> => {
    // Validação básica
    if (!data.name || !data.speciesId || !data.gender || !data.size) {
      throw new Error('Faltando, nome, espécie, genero e tamanho.');
    }

    // O repositório cria a entidade
    return await animalRepository.create(data);
  };
}