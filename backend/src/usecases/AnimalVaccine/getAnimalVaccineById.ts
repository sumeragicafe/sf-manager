import { IAnimalVaccineRepository } from '@domain/repositories/IAnimalVaccineRepository';

export function getAnimalVaccineById(repo: IAnimalVaccineRepository) {
  return async (id: string) => {
    return await repo.findById(id);
  };
}
