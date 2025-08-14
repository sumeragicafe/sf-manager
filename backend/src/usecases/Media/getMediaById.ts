import { IMediaRepository } from '@domain/repositories/IMediaRepository';

export function getMediaById(mediaRepository: IMediaRepository) {
  return async (id: string) => {
    const media = await mediaRepository.findById(id);
    if (!media) throw new Error('Media not found');
    return media;
  };
}