import { MediaProps } from '@domain/entities/Media';
import { PaginationOptions, PaginatedResult } from '@types/Pagination';

export interface IMediaRepository {
  findById(id: string, canViewPrivate?:boolean): Promise<MediaProps | null>;
  findAll(pagination?: PaginationOptions, canViewPrivate?: boolean): Promise<PaginatedResult<MediaProps>>;
  create(data: Omit<MediaProps, 'id'>): Promise<MediaProps>;
  update(id: string, data: Partial<Omit<MediaProps, 'id'>>): Promise<MediaProps | null>;
  delete(id: string): Promise<boolean>;
  saveFile(file: { buffer: Buffer; fileName: string; mimeType: string }): Promise<MediaProps>;
}