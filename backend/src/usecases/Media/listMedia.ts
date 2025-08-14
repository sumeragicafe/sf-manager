import { IMediaRepository } from '@domain/repositories/IMediaRepository';
import { PaginationOptions } from '@types/Pagination';

export function listMedia(mediaRepository: IMediaRepository) {
  return async (pagination?: PaginationOptions) => {
    return await mediaRepository.findAll(pagination);
  };
}