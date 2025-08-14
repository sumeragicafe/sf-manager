import { IMediaRepository } from '@domain/repositories/IMediaRepository';

export function deleteMedia(mediaRepository: IMediaRepository) {
  return async (id: string) => {
    const deleted = await mediaRepository.delete(id);
    if (!deleted) throw new Error('Media not found or already deleted');
    return deleted;
  };
}