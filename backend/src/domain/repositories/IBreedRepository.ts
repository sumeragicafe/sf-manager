import { BreedProps } from '@domain/entities/Breed';
import { PaginationOptions, PaginatedResult } from '@types/Pagination';

export interface IBreedRepository {
  findById(id: number): Promise<BreedProps | null>;
  searchByName(name: string, pagination?: PaginationOptions): Promise<PaginatedResult<BreedProps>>;
  create(data: Omit<BreedProps, 'id'>): Promise<BreedProps>;
  update(id: number, data: Partial<Omit<BreedProps, 'id'>>): Promise<BreedProps | null>;
  delete(id: number): Promise<boolean>;
  findBySpecies(speciesId: number, pagination?: PaginationOptions): Promise<PaginatedResult<BreedProps>>;
}