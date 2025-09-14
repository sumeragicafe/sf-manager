import { IAnimalMediaRepository } from '@domain/repositories/IAnimalMediaRepository';

interface ListAnimalMediaInput {
  petId: string;
  page?: number;
  pageSize?: number;
}

export function listAnimalMedia(animalMediaRepo: IAnimalMediaRepository) {
  return async ({ petId, page = 1, pageSize = 10 }: ListAnimalMediaInput) => {
    if (!petId) {
      throw new Error('petId é obrigatório');
    }

    const result = await animalMediaRepo.findByPet(petId, { page, pageSize });
    return result;
  };
}
