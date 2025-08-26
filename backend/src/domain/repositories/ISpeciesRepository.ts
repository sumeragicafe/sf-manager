import { SpeciesProps } from '@domain/entities/Species';
import { PaginationOptions, PaginatedResult } from '@types/Pagination';

export interface ISpeciesRepository {
  findById(id: number): Promise<SpeciesProps | null>;
  searchByName(name: string, pagination?: PaginationOptions): Promise<PaginatedResult<SpeciesProps>>;
  create(data: Omit<SpeciesProps, 'id'>): Promise<SpeciesProps>;
  update(id: number, data: Partial<Omit<SpeciesProps, 'id'>>): Promise<SpeciesProps | null>;
  delete(id: number): Promise<boolean>;
}