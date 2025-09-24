import { IVaccineRepository } from '@domain/repositories/IVaccineRepository';
import { PaginationOptions } from '@types/Pagination';

export function listVaccines(vaccineRepository: IVaccineRepository) {
  return async (options?: PaginationOptions) => {

    const filters = options?.filters ? { ...options.filters } : {};

    return await vaccineRepository.findAll({
      page: options?.page ?? 1,
      pageSize: options?.pageSize ?? 20,
      sortBy: options?.sortBy ?? 'name',
      sortOrder: options?.sortOrder ?? 'asc',
      filters
    });
  };
}
