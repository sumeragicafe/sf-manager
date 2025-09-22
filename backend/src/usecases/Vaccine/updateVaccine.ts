import { IVaccineRepository } from '@domain/repositories/IVaccineRepository';
import { VaccineProps } from '@domain/entities/Vaccine';

export function updateVaccine(vaccineRepository: IVaccineRepository) {
  return async (id: number, data: Partial<Omit<VaccineProps, 'id'>>) => {
    return await vaccineRepository.update(id, data);
  };
}
