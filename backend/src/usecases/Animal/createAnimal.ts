import { IAnimalRepository } from '@domain/repositories/IAnimalRepository';
import { AnimalProps, Animal } from '@domain/entities/Animal';

type CreateAnimalInput = Omit<AnimalProps, 'id'> & { id?: string };

export function createAnimal(animalRepository: IAnimalRepository) {
  return async (data: CreateAnimalInput): Promise<AnimalProps> => {

    if (!data.name || !data.speciesId || !data.gender || !data.size) {
      throw new Error('Faltando nome, espécie, gênero ou tamanho.');
    }

    const animalData = {
      ...data,
      id: data.id || undefined, // undefined deixa o repositório gerar se quiser
    };

    const animal = await animalRepository.create(animalData);

    return animal.props;
  };
}