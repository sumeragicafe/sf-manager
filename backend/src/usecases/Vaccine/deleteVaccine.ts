import { IVaccineRepository } from '@domain/repositories/IVaccineRepository';
import { VaccineProps } from '@domain/entities/Vaccine';

type DeleteVaccineResult = {
  success: boolean;
  vaccine?: VaccineProps;
};

export function deleteVaccine(vaccineRepository: IVaccineRepository) {
  return async (id: number): Promise<DeleteVaccineResult> => {
    const vaccine = await vaccineRepository.findById(id);

    if (!vaccine) {
      return { success: false };
    }

    const deleted = await vaccineRepository.delete(id);

    return {
      success: deleted,
      vaccine: deleted ? vaccine : undefined,
    };
  };
}
