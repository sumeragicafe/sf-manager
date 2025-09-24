import { IVaccineRepository } from '@domain/repositories/IVaccineRepository';
import { VaccineProps } from '@domain/entities/Vaccine';

export function createVaccine(vaccineRepository: IVaccineRepository) {
  return async (data: Omit<VaccineProps, 'id'>) => {

    return vaccineRepository.create(data);

  };
}
