import { IAnimalVaccineRepository } from '@domain/repositories/IAnimalVaccineRepository';

export function deleteAnimalVaccine(repo: IAnimalVaccineRepository) {
  return async (id: string) => {
    return await repo.delete(id);
  };
}
