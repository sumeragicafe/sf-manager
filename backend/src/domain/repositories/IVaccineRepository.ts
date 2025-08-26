import { VaccineProps } from '@domain/entities/Vaccine';
import { PaginationOptions, PaginatedResult } from '@types/Pagination';

export interface IVaccineRepository {
  findById(id: number): Promise<VaccineProps | null>;
  searchByName(name: string, pagination?: PaginationOptions): Promise<PaginatedResult<VaccineProps>>;
  create(data: Omit<VaccineProps, 'id'>): Promise<VaccineProps>;
  update(id: number, data: Partial<Omit<VaccineProps, 'id'>>): Promise<VaccineProps | null>;
  delete(id: number): Promise<boolean>;
  findAll(pagination?: PaginationOptions): Promise<PaginatedResult<VaccineProps>>;
}