import { MediaProps } from '@domain/entities/Media';
import { PaginationOptions, PaginatedResult } from '@types/Pagination';

export interface IMediaRepository {
  findById(id: string): Promise<MediaProps | null>;
  create(data: Omit<MediaProps, 'id'>): Promise<MediaProps>;
  update(id: string, data: Partial<Omit<MediaProps, 'id'>>): Promise<MediaProps | null>;
  delete(id: string): Promise<boolean>;
  findAll(pagination?: PaginationOptions, canViewPrivate: bool): Promise<PaginatedResult<MediaProps>>;
  saveFile(file: { buffer: Buffer; fileName: string; mimeType: string }): Promise<MediaProps>;
}