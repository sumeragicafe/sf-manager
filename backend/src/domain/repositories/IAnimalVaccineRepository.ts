import { AnimalVaccineProps } from '@domain/entities/AnimalVaccine';
import { PaginationOptions, PaginatedResult } from '@types/Pagination';

export interface IAnimalVaccineRepository {
  findById(id: string): Promise<AnimalVaccineProps | null>;
  findAll(petId: String, pagination?: PaginationOptions): Promise<PaginatedResult<AnimalVaccineProps>>;
  create(data: Omit<AnimalVaccineProps, 'id'>): Promise<AnimalVaccineProps>;
  update(id: string, data: Partial<Omit<AnimalVaccineProps, 'id'>>): Promise<AnimalVaccineProps | null>;
  delete(id: string): Promise<boolean>;
}
