import { IAnimalFactRepository } from '@domain/repositories/IAnimalFactRepository';

export function deleteAnimalFact(animalFactRepository: IAnimalFactRepository) {
  return async (factId: string): Promise<boolean> => {
    if (!factId) {
      throw new Error('ID do fato é obrigatório');
    }

    const deleted = await animalFactRepository.delete(factId);
    if (!deleted) {
      return false;
    }

    return true;
  };
}
