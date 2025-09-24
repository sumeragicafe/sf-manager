import { IAnimalVaccineRepository } from '@domain/repositories/IAnimalVaccineRepository';
import { AnimalVaccine } from '@domain/entities/AnimalVaccine';

export function createAnimalVaccine(repo: IAnimalVaccineRepository) {
  return async (petId: string, vaccineId: number, applicationDate: Date, applicator?: string) => {
    const entity = AnimalVaccine.createNew({petId, vaccineId, applicationDate, applicator});
    return await repo.create(entity.props);
  };
}
