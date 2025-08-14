import { AnimalVaccineProps } from '@domain/entities/AnimalVaccine';
import { PaginationOptions, PaginatedResult } from '@types/Pagination';

export interface IAnimalVaccineRepository {
  findById(id: string): Promise<AnimalVaccineProps | null>;
  create(data: Omit<AnimalVaccineProps, 'id'>): Promise<AnimalVaccineProps>;
  update(id: string, data: Partial<Omit<AnimalVaccineProps, 'id'>>): Promise<AnimalVaccineProps | null>;
  delete(id: string): Promise<boolean>;
  findByPet(petId: string, pagination?: PaginationOptions): Promise<PaginatedResult<AnimalVaccineProps>>;
}