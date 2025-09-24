import { IAnimalVaccineRepository } from '@domain/repositories/IAnimalVaccineRepository';

export function updateAnimalVaccine(repo: IAnimalVaccineRepository) {
  return async (id: string, data: Partial<{ applicationDate: Date; applicator: string }>) => {
    return await repo.update(id, data);
  };
}
